import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Brain, Code2, Server, Layers, BarChart3, Sparkles, Wrench, TrendingUp, ArrowRight, Smartphone, Loader2 } from "lucide-react";
import { OnboardingShell } from "@/components/skillgap/Stepper";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { getRoles, type CatalogRole } from "@/lib/catalog.functions";
import { getState, setState } from "@/lib/skillgap-store";

export const Route = createFileRoute("/onboarding/role")({
  component: RolePage,
  head: () => ({ meta: [{ title: "Choose your role — SkillGap" }] }),
});

const iconFor: Record<string, any> = {
  "ai-engineer": Brain,
  "ml-engineer": Brain,
  "frontend-engineer": Code2,
  "backend-engineer": Server,
  "fullstack-engineer": Layers,
  "data-scientist": BarChart3,
  "devops-engineer": Wrench,
  "mobile-engineer": Smartphone,
};

function RolePage() {
  const fetchRoles = useServerFn(getRoles);
  const { data: roles, isLoading } = useQuery({ queryKey: ["roles"], queryFn: () => fetchRoles() });
  const [selected, setSelected] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const s = getState();
    if (s.roleId) setSelected(s.roleId);
  }, []);

  function onContinue() {
    if (!selected || !roles) return;
    const role = roles.find((r) => r.id === selected);
    if (!role) return;
    setState({ roleId: role.id, roleSlug: role.slug, roleTitle: role.title });
    navigate({ to: "/onboarding/method" });
  }

  return (
    <OnboardingShell
      step={1}
      eyebrow="Step 1"
      title="Who do you want to become?"
      subtitle="Pick a target role. We'll model the exact skills, projects, and trajectory to get you there."
    >
      {isLoading ? (
        <div className="grid place-items-center py-20"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(roles ?? []).map((r: CatalogRole) => {
            const Icon = iconFor[r.slug] ?? Sparkles;
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
                  {r.growth_pct != null && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-secondary/80 px-2 py-1 text-[10px] font-medium text-primary">
                      <TrendingUp className="h-3 w-3" /> +{r.growth_pct}% YoY
                    </span>
                  )}
                </div>
                <h3 className="mt-5 text-lg font-semibold">{r.title}</h3>
                <div className="mt-1 text-sm text-muted-foreground">{r.salary_range ?? "Competitive"}</div>
                {r.description && (
                  <p className="mt-3 line-clamp-2 text-xs text-muted-foreground">{r.description}</p>
                )}
                {r.demand_level && (
                  <div className="mt-4">
                    <span className="rounded-md border border-border/60 bg-secondary/40 px-2 py-0.5 text-[11px] text-muted-foreground">
                      Demand: {r.demand_level}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
      <div className="mt-10 flex justify-center">
        <Button onClick={onContinue} size="lg" disabled={!selected} className="bg-gradient-primary text-primary-foreground shadow-glow">
          Continue <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </OnboardingShell>
  );
}
