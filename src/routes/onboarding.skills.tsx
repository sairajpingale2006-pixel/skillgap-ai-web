import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { OnboardingShell } from "@/components/skillgap/Stepper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Check, ArrowRight, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { getSkills, type CatalogSkill } from "@/lib/catalog.functions";
import { getState, setState } from "@/lib/skillgap-store";

export const Route = createFileRoute("/onboarding/skills")({
  component: SkillsPage,
  head: () => ({ meta: [{ title: "Pick skills — SkillGap" }] }),
});

const categoryLabels: Record<string, string> = {
  languages: "Languages",
  frontend: "Frontend",
  backend: "Backend",
  ai: "AI / ML",
  database: "Database",
  devops: "DevOps",
  design: "Design",
  soft: "Soft skills",
};

function SkillsPage() {
  const fetchSkills = useServerFn(getSkills);
  const { data: skills, isLoading } = useQuery({ queryKey: ["skills"], queryFn: () => fetchSkills() });
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const s = getState();
    setPicked(new Set(s.skills));
  }, []);

  const groups = useMemo(() => {
    if (!skills) return [] as { name: string; key: string; skills: CatalogSkill[] }[];
    const map = new Map<string, CatalogSkill[]>();
    for (const s of skills) {
      const list = map.get(s.category) ?? [];
      list.push(s); map.set(s.category, list);
    }
    return Array.from(map.entries()).map(([k, v]) => ({ key: k, name: categoryLabels[k] ?? k, skills: v }));
  }, [skills]);

  const filtered = useMemo(() => {
    if (!q) return groups;
    return groups
      .map((g) => ({ ...g, skills: g.skills.filter((s) => s.name.toLowerCase().includes(q.toLowerCase())) }))
      .filter((g) => g.skills.length);
  }, [q, groups]);

  function toggle(s: string) {
    setPicked((prev) => {
      const n = new Set(prev);
      if (n.has(s)) n.delete(s); else n.add(s);
      return n;
    });
  }

  function onContinue() {
    setState({ skills: Array.from(picked) });
    navigate({ to: "/analyzing" });
  }

  return (
    <OnboardingShell step={2} eyebrow="Skills" title="Pick what you know" subtitle="Click everything that applies. Search to add anything not listed.">
      <div className="mx-auto max-w-4xl">
        <div className="glass sticky top-4 z-10 flex items-center gap-3 rounded-2xl p-3">
          <Search className="ml-2 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search skills..." className="border-0 bg-transparent focus-visible:ring-0" />
          <span className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">{picked.size} selected</span>
        </div>
        {isLoading ? (
          <div className="grid place-items-center py-20"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : (
          <div className="mt-8 space-y-8">
            {filtered.map((g) => (
              <div key={g.key}>
                <h3 className="mb-3 text-xs uppercase tracking-[0.22em] text-muted-foreground">{g.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {g.skills.map((s) => {
                    const on = picked.has(s.name);
                    return (
                      <button key={s.id} onClick={() => toggle(s.name)} className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition-all",
                        on
                          ? "border-primary/60 bg-gradient-primary text-primary-foreground shadow-glow"
                          : "border-border/60 bg-card/40 text-foreground hover:border-border hover:bg-card",
                      )}>
                        {on && <Check className="h-3.5 w-3.5" />} {s.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-12 flex items-center justify-between">
          <Button variant="ghost" asChild><Link to="/onboarding/method">← Back</Link></Button>
          <Button onClick={onContinue} disabled={picked.size === 0} className="bg-gradient-primary text-primary-foreground shadow-glow">
            Analyze <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </OnboardingShell>
  );
}
