import { createFileRoute, Link } from "@tanstack/react-router";
import { Brain, Code2, Server, Layers, BarChart3, Sparkles, Wrench, TrendingUp, ArrowRight } from "lucide-react";
import { OnboardingShell } from "@/components/skillgap/Stepper";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding/role")({
  component: RolePage,
  head: () => ({ meta: [{ title: "Choose your role — SkillGap" }] }),
});

const roles = [
  { id: "ai", title: "AI Engineer", icon: Brain, salary: "$140k – $260k", growth: "+38% YoY", tags: ["LLMs", "Python", "PyTorch"] },
  { id: "fe", title: "Frontend Developer", icon: Code2, salary: "$95k – $180k", growth: "+12% YoY", tags: ["React", "TS", "CSS"] },
  { id: "be", title: "Backend Developer", icon: Server, salary: "$110k – $200k", growth: "+15% YoY", tags: ["Go", "APIs", "SQL"] },
  { id: "fs", title: "Full Stack Developer", icon: Layers, salary: "$100k – $190k", growth: "+18% YoY", tags: ["Next.js", "Node", "DB"] },
  { id: "ds", title: "Data Scientist", icon: BarChart3, salary: "$120k – $220k", growth: "+22% YoY", tags: ["Stats", "Pandas", "ML"] },
  { id: "pe", title: "Prompt Engineer", icon: Sparkles, salary: "$130k – $240k", growth: "+64% YoY", tags: ["LLMs", "Eval", "RAG"] },
  { id: "do", title: "DevOps Engineer", icon: Wrench, salary: "$120k – $210k", growth: "+19% YoY", tags: ["K8s", "AWS", "CI/CD"] },
];

function RolePage() {
  const [selected, setSelected] = useState<string | null>("ai");
  return (
    <OnboardingShell
      step={1}
      eyebrow="Step 1"
      title="Who do you want to become?"
      subtitle="Pick a target role. We'll model the exact skills, projects, and trajectory to get you there."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {roles.map((r) => {
          const Icon = r.icon;
          const active = selected === r.id;
          return (
            <button
              key={r.id}
              onClick={() => setSelected(r.id)}
              className={cn(
                "group relative overflow-hidden rounded-2xl border p-6 text-left transition-all",
                active
                  ? "border-primary/60 bg-card shadow-glow"
                  : "border-border/60 bg-card/40 hover:border-border hover:bg-card/70",
              )}
            >
              {active && <div className="pointer-events-none absolute inset-0 bg-gradient-primary opacity-[0.06]" />}
              <div className="flex items-start justify-between">
                <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", active ? "bg-gradient-primary" : "bg-secondary")}>
                  <Icon className={cn("h-5 w-5", active ? "text-primary-foreground" : "text-primary")} />
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-secondary/80 px-2 py-1 text-[10px] font-medium text-primary">
                  <TrendingUp className="h-3 w-3" /> {r.growth}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-semibold">{r.title}</h3>
              <div className="mt-1 text-sm text-muted-foreground">{r.salary}</div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {r.tags.map((t) => (
                  <span key={t} className="rounded-md border border-border/60 bg-secondary/40 px-2 py-0.5 text-[11px] text-muted-foreground">
                    {t}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>
      <div className="mt-10 flex justify-center">
        <Button asChild size="lg" disabled={!selected} className="bg-gradient-primary text-primary-foreground shadow-glow">
          <Link to="/onboarding/method">
            Continue <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </OnboardingShell>
  );
}