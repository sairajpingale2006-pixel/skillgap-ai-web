import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Send, Wand2, BookOpen, Target, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { chatCoach, chatCoachPublic } from "@/lib/coach.functions";
import { useAuth } from "@/hooks/use-auth";
import { getState } from "@/lib/skillgap-store";
import { toast } from "sonner";

export const Route = createFileRoute("/coach")({
  component: CoachPage,
  head: () => ({ meta: [{ title: "AI Coach — SkillGap" }] }),
});

type Msg = { role: "user" | "assistant"; content: string };
const GUEST_LIMIT = 5;

const suggestions = [
  { icon: Wand2, t: "What should I learn next?" },
  { icon: Target, t: "Am I internship ready?" },
  { icon: BookOpen, t: "Suggest beginner projects" },
];

function CoachPage() {
  const { user, isGuest } = useAuth();
  const callAuth = useServerFn(chatCoach);
  const callPublic = useServerFn(chatCoachPublic);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi! I'm your SkillGap coach. Ask me anything about your career path — I'll be direct and concrete." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const guestCount = messages.filter((m) => m.role === "user").length;

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    if (!user && isGuest && guestCount >= GUEST_LIMIT) {
      toast.error(`Guest limit reached (${GUEST_LIMIT} messages). Sign in to continue.`);
      return;
    }
    const userMsg: Msg = { role: "user", content: text };
    const history = messages.filter((_, i) => i > 0).slice(-10);
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const s = getState();
      const ctx = {
        roleTitle: s.roleTitle,
        skills: s.skills,
        score: s.lastAnalysis?.score,
        missing: s.lastAnalysis?.missing.map((x) => x.name),
      };
      const fn = user ? callAuth : callPublic;
      const res = await fn({ data: { message: text, history, context: ctx } });
      setMessages((m) => [...m, { role: "assistant", content: res.reply }]);
    } catch (e: any) {
      toast.error(e?.message ?? "Coach failed to respond");
      setMessages((m) => m.slice(0, -1));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <div className="mx-auto flex h-screen max-w-5xl flex-col px-6 py-10">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-primary">AI Coach</div>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">Your second brain</h1>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/40 px-3 py-1 text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />
            {user ? "Online" : `Guest ${guestCount}/${GUEST_LIMIT}`}
          </span>
        </div>

        <div className="mt-6 flex-1 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "assistant" ? "flex gap-3" : "flex justify-end"}>
                {m.role === "assistant" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-primary">
                    <Sparkles className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
                <div className={m.role === "assistant"
                  ? "max-w-[75%] whitespace-pre-wrap rounded-2xl rounded-tl-sm glass px-4 py-3 text-sm leading-relaxed"
                  : "max-w-[75%] whitespace-pre-wrap rounded-2xl rounded-tr-sm bg-gradient-primary px-4 py-3 text-sm text-primary-foreground"
                }>{m.content}</div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-primary">
                  <Sparkles className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="rounded-2xl rounded-tl-sm glass px-4 py-3 text-sm">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-3 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button key={s.t} onClick={() => send(s.t)} disabled={loading} className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground disabled:opacity-50">
                <s.icon className="h-3.5 w-3.5" /> {s.t}
              </button>
            ))}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="glass-strong flex items-end gap-2 rounded-2xl p-2">
            <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask anything about your career path..." className="h-10 border-0 bg-transparent focus-visible:ring-0" />
            <Button type="submit" disabled={loading || !input.trim()} size="icon" className="h-10 w-10 bg-gradient-primary"><Send className="h-4 w-4" /></Button>
          </form>
          <p className="mt-2 text-center text-[11px] text-muted-foreground">SkillGap can make mistakes. Verify important info.</p>
        </div>
      </div>
    </AppShell>
  );
}
