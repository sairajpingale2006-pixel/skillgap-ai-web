import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Brain, Search, Target, Sparkles, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/analyzing")({
  component: Analyzing,
  head: () => ({ meta: [{ title: "Analyzing — SkillGap" }] }),
});

const steps = [
  { icon: Search, label: "Parsing your profile" },
  { icon: Brain, label: "Building skill graph" },
  { icon: Target, label: "Matching against role" },
  { icon: Sparkles, label: "Drafting your roadmap" },
];

function Analyzing() {
  const navigate = useNavigate();
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => x + 1), 900);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    if (i >= steps.length) {
      const t = setTimeout(() => navigate({ to: "/results" }), 600);
      return () => clearTimeout(t);
    }
  }, [i, navigate]);

  return (
    <div className="grid min-h-screen place-items-center px-6">
      <div className="w-full max-w-md text-center">
        <div className="relative mx-auto h-24 w-24">
          <div className="absolute inset-0 animate-pulse-glow rounded-full bg-gradient-primary opacity-70" />
          <div className="absolute inset-2 flex items-center justify-center rounded-full bg-background">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h1 className="mt-8 text-2xl font-semibold tracking-tight">Analyzing your profile</h1>
        <p className="mt-2 text-sm text-muted-foreground">This usually takes a few seconds.</p>
        <ul className="mt-10 space-y-3 text-left">
          {steps.map((s, idx) => {
            const done = idx < i;
            const active = idx === i;
            const Icon = s.icon;
            return (
              <li key={s.label} className={cn(
                "flex items-center gap-3 rounded-xl border px-4 py-3 transition-all",
                active ? "border-primary/60 bg-card shadow-glow" : "border-border/60 bg-card/40",
                done && "opacity-60",
              )}>
                <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", done || active ? "bg-gradient-primary" : "bg-secondary")}>
                  {done ? <Check className="h-4 w-4 text-primary-foreground" /> : <Icon className={cn("h-4 w-4", active ? "text-primary-foreground" : "text-muted-foreground")} />}
                </div>
                <span className="text-sm">{s.label}</span>
                {active && <span className="ml-auto text-xs text-muted-foreground">working…</span>}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}