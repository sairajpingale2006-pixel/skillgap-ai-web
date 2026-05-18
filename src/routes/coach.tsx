import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Send, Paperclip, Wand2, BookOpen, Target } from "lucide-react";

export const Route = createFileRoute("/coach")({
  component: CoachPage,
  head: () => ({ meta: [{ title: "AI Coach — SkillGap" }] }),
});

const thread = [
  { role: "ai", text: "Welcome back, Alex. You're 72% to AI Engineer. Want to focus on closing your TensorFlow gap this week?" },
  { role: "user", text: "Yes — give me a concrete week." },
  { role: "ai", text: "Day 1–2: Karpathy's micrograd. Day 3–4: rebuild it in TF. Day 5: ship a notebook + writeup. I'll review your code as you go." },
];

const suggestions = [
  { icon: Wand2, t: "Review my last project" },
  { icon: Target, t: "Mock interview: ML system design" },
  { icon: BookOpen, t: "Explain transformers in 5 minutes" },
];

function CoachPage() {
  return (
    <AppShell>
      <div className="mx-auto flex h-[calc(100vh-0px)] max-w-5xl flex-col px-6 py-10">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-primary">AI Coach</div>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">Your second brain</h1>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/40 px-3 py-1 text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" /> Online
          </span>
        </div>

        <div className="mt-6 flex-1 overflow-y-auto">
          <div className="space-y-4">
            {thread.map((m, i) => (
              <div key={i} className={m.role === "ai" ? "flex gap-3" : "flex justify-end"}>
                {m.role === "ai" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-primary">
                    <Sparkles className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
                <div className={m.role === "ai"
                  ? "max-w-[75%] rounded-2xl rounded-tl-sm glass px-4 py-3 text-sm leading-relaxed"
                  : "max-w-[75%] rounded-2xl rounded-tr-sm bg-gradient-primary px-4 py-3 text-sm text-primary-foreground"
                }>{m.text}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-3 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button key={s.t} className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground">
                <s.icon className="h-3.5 w-3.5" /> {s.t}
              </button>
            ))}
          </div>
          <div className="glass-strong flex items-end gap-2 rounded-2xl p-2">
            <Button variant="ghost" size="icon" className="h-10 w-10"><Paperclip className="h-4 w-4" /></Button>
            <Input placeholder="Ask anything about your career path..." className="h-10 border-0 bg-transparent focus-visible:ring-0" />
            <Button size="icon" className="h-10 w-10 bg-gradient-primary"><Send className="h-4 w-4" /></Button>
          </div>
          <p className="mt-2 text-center text-[11px] text-muted-foreground">SkillGap can make mistakes. Verify important info.</p>
        </div>
      </div>
    </AppShell>
  );
}