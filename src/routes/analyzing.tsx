import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Brain, Search, Target, Sparkles, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useServerFn } from "@tanstack/react-start";
import { useAuth } from "@/hooks/use-auth";
import { runAnalysis, runAnalysisPublic } from "@/lib/analysis.functions";
import { getState, setState } from "@/lib/skillgap-store";
import { toast } from "sonner";

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
  const { user } = useAuth();
  const callAuth = useServerFn(runAnalysis);
  const callPublic = useServerFn(runAnalysisPublic);
  const [i, setI] = useState(0);
  const ran = useRef(false);

  useEffect(() => {
    const t = setInterval(() => setI((x) => Math.min(x + 1, steps.length)), 700);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    const s = getState();
    if (!s.roleId || !s.skills.length) {
      toast.error("Choose a role and at least one skill first.");
      navigate({ to: "/onboarding/role" });
      return;
    }
    (async () => {
      try {
        const fn = user ? callAuth : callPublic;
        const res = await fn({ data: { roleId: s.roleId!, skills: s.skills } });
        setState({
          lastAnalysis: {
            score: res.score,
            matched: res.matched,
            missing: res.missing,
            totalRequired: res.totalRequired,
            createdAt: new Date().toISOString(),
          },
        });
        setTimeout(() => navigate({ to: "/results" }), 1200);
      } catch (e: any) {
        toast.error(e?.message ?? "Analysis failed");
        navigate({ to: "/onboarding/skills" });
      }
    })();
  }, [user, callAuth, callPublic, navigate]);

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
                active ? "border-primary/60 bg-card shadow-glow" : "border-border/40 bg-card/30",
              )}>
                <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg",
                  done ? "bg-gradient-primary" : active ? "bg-secondary" : "bg-secondary/50")}>
                  {done ? <Check className="h-4 w-4 text-primary-foreground" /> : <Icon className={cn("h-4 w-4", active ? "text-primary" : "text-muted-foreground")} />}
                </div>
                <span className={cn("text-sm", done ? "text-foreground" : active ? "text-foreground" : "text-muted-foreground")}>{s.label}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
