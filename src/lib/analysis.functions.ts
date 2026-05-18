import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { z } from "zod";

const RunSchema = z.object({
  roleId: z.string().uuid(),
  skills: z.array(z.string().min(1).max(80)).max(200),
});

export type AnalysisResult = {
  id: string | null;
  score: number;
  matched: { name: string; priority: string }[];
  missing: { name: string; priority: string }[];
  totalRequired: number;
  roadmap: { week: string; title: string; desc: string; tag: string }[];
};

function computeRoadmap(missing: { name: string; priority: string }[]) {
  // Pick top 4 priorities, group into weeks
  const ordered = [...missing].sort((a, b) =>
    a.priority === b.priority ? 0 : a.priority === "High" ? -1 : 1
  );
  const picks = ordered.slice(0, 4);
  const labels = ["Weeks 1–2", "Weeks 3–4", "Weeks 5–6", "Weeks 7–9"];
  const tags = ["Foundation", "Frameworks", "Applied", "Portfolio"];
  return picks.map((p, i) => ({
    week: labels[i] ?? `Week ${i + 1}`,
    title: `Learn ${p.name}`,
    desc: `Focus on ${p.name} fundamentals, then ship one small project to lock it in.`,
    tag: tags[i] ?? "Practice",
  }));
}

export async function computeAnalysis(roleId: string, skills: string[]) {
  const { data: req, error } = await supabaseAdmin
    .from("role_skills")
    .select("priority, skills(name)")
    .eq("role_id", roleId);
  if (error) throw new Error(error.message);
  const required = (req ?? []).map((r: any) => ({
    name: r.skills.name as string,
    priority: r.priority as string,
  }));
  const have = new Set(skills.map((s) => s.toLowerCase()));
  const matched = required.filter((r) => have.has(r.name.toLowerCase()));
  const missing = required.filter((r) => !have.has(r.name.toLowerCase()));
  // Weighted score: High=3, Med=2, Low=1
  const w = (p: string) => (p === "High" ? 3 : p === "Med" ? 2 : 1);
  const totalW = required.reduce((s, r) => s + w(r.priority), 0) || 1;
  const haveW = matched.reduce((s, r) => s + w(r.priority), 0);
  const score = Math.round((haveW / totalW) * 100);
  return {
    score,
    matched,
    missing,
    totalRequired: required.length,
    roadmap: computeRoadmap(missing),
  };
}

// Public: works for guests too (no auth)
export const runAnalysisPublic = createServerFn({ method: "POST" })
  .inputValidator((input) => RunSchema.parse(input))
  .handler(async ({ data }): Promise<AnalysisResult> => {
    const r = await computeAnalysis(data.roleId, data.skills);
    return { id: null, ...r };
  });

// Authenticated: persists analysis + saves user_skills + roadmap
export const runAnalysis = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => RunSchema.parse(input))
  .handler(async ({ data, context }): Promise<AnalysisResult> => {
    const { userId } = context;
    const r = await computeAnalysis(data.roleId, data.skills);

    // Persist analysis
    const { data: row, error: e1 } = await supabaseAdmin
      .from("analyses")
      .insert({
        user_id: userId,
        role_id: data.roleId,
        match_score: r.score,
        matched_skills: r.matched,
        missing_skills: r.missing,
        total_required: r.totalRequired,
      })
      .select("id")
      .single();
    if (e1) throw new Error(e1.message);

    // Persist user_skills (best-effort)
    if (data.skills.length) {
      const { data: skillRows } = await supabaseAdmin
        .from("skills")
        .select("id,name")
        .in("name", data.skills);
      if (skillRows?.length) {
        const inserts = skillRows.map((s) => ({
          user_id: userId,
          skill_id: s.id,
          level: 70,
        }));
        await supabaseAdmin.from("user_skills").upsert(inserts, {
          onConflict: "user_id,skill_id",
          ignoreDuplicates: true,
        });
      }
    }

    // Persist roadmap
    await supabaseAdmin.from("roadmaps").insert({
      user_id: userId,
      role_id: data.roleId,
      analysis_id: row.id,
      weeks: r.roadmap,
      progress_pct: 0,
    });

    // Update profile target role
    await supabaseAdmin
      .from("profiles")
      .update({ target_role_id: data.roleId })
      .eq("id", userId);

    return { id: row.id, ...r };
  });

export const getLatestAnalysis = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AnalysisResult | null> => {
    const { userId } = context;
    const { data, error } = await supabaseAdmin
      .from("analyses")
      .select("id, match_score, matched_skills, missing_skills, total_required, role_id")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return null;
    const missing = (data.missing_skills as any[]) ?? [];
    return {
      id: data.id,
      score: data.match_score,
      matched: (data.matched_skills as any[]) ?? [],
      missing,
      totalRequired: data.total_required,
      roadmap: computeRoadmap(missing),
    };
  });
