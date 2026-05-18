import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway";

const MsgSchema = z.object({
  message: z.string().min(1).max(2000),
  history: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(4000) }))
    .max(40)
    .optional(),
  context: z
    .object({
      roleTitle: z.string().max(120).optional(),
      skills: z.array(z.string().max(80)).max(200).optional(),
      score: z.number().optional(),
      missing: z.array(z.string().max(80)).max(40).optional(),
    })
    .optional(),
});

function systemPrompt(ctx?: z.infer<typeof MsgSchema>["context"]) {
  const parts = [
    "You are SkillGap, a concise, encouraging AI career coach for software engineers.",
    "Give direct, actionable advice. Prefer concrete next steps and short bullets. Avoid fluff.",
  ];
  if (ctx?.roleTitle) parts.push(`User's target role: ${ctx.roleTitle}.`);
  if (typeof ctx?.score === "number") parts.push(`Current match score: ${ctx.score}%.`);
  if (ctx?.skills?.length) parts.push(`Current skills: ${ctx.skills.join(", ")}.`);
  if (ctx?.missing?.length) parts.push(`Missing skills to close: ${ctx.missing.join(", ")}.`);
  return parts.join(" ");
}

async function callModel(input: z.infer<typeof MsgSchema>) {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("AI not configured");
  const gateway = createLovableAiGatewayProvider(key);
  const model = gateway("google/gemini-3-flash-preview");
  const messages = [
    ...(input.history ?? []),
    { role: "user" as const, content: input.message },
  ];
  const { text } = await generateText({
    model,
    system: systemPrompt(input.context),
    messages,
  });
  return text;
}

// Public for guests — no persistence
export const chatCoachPublic = createServerFn({ method: "POST" })
  .inputValidator((input) => MsgSchema.parse(input))
  .handler(async ({ data }) => ({ reply: await callModel(data) }));

// Authenticated — persists history
export const chatCoach = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => MsgSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { userId } = context;
    const reply = await callModel(data);
    await supabaseAdmin.from("chat_history").insert([
      { user_id: userId, role: "user", content: data.message },
      { user_id: userId, role: "assistant", content: reply },
    ]);
    return { reply };
  });

export const getChatHistory = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId } = context;
    const { data, error } = await supabaseAdmin
      .from("chat_history")
      .select("role,content,created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })
      .limit(100);
    if (error) throw new Error(error.message);
    return (data ?? []) as { role: "user" | "assistant"; content: string; created_at: string }[];
  });
