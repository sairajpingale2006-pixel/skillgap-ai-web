import { createFileRoute, Link } from "@tanstack/react-router";
import { OnboardingShell } from "@/components/skillgap/Stepper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Check, ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding/skills")({
  component: SkillsPage,
  head: () => ({ meta: [{ title: "Pick skills — SkillGap" }] }),
});

const groups: { name: string; skills: string[] }[] = [
  { name: "Languages", skills: ["Python", "TypeScript", "JavaScript", "Go", "Rust", "Java", "C++", "SQL", "Bash"] },
  { name: "Frontend", skills: ["React", "Next.js", "Vue", "Svelte", "Tailwind", "Framer Motion", "WebGL", "Three.js"] },
  { name: "Backend", skills: ["Node.js", "FastAPI", "Django", "Express", "GraphQL", "REST", "gRPC", "Redis"] },
  { name: "AI", skills: ["PyTorch", "TensorFlow", "LangChain", "RAG", "Embeddings", "OpenAI API", "Prompting", "Eval"] },
  { name: "Database", skills: ["Postgres", "MongoDB", "Supabase", "Pinecone", "ClickHouse", "DynamoDB", "Prisma"] },
  { name: "Infra", skills: ["Docker", "Kubernetes", "AWS", "GCP", "Vercel", "Terraform", "GitHub Actions"] },
];

function SkillsPage() {
  const [picked, setPicked] = useState<Set<string>>(new Set(["Python", "SQL", "React"]));
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    if (!q) return groups;
    return groups
      .map((g) => ({ ...g, skills: g.skills.filter((s) => s.toLowerCase().includes(q.toLowerCase())) }))
      .filter((g) => g.skills.length);
  }, [q]);

  function toggle(s: string) {
    setPicked((prev) => {
      const n = new Set(prev);
      if (n.has(s)) n.delete(s); else n.add(s);
      return n;
    });
  }

  return (
    <OnboardingShell step={2} eyebrow="Skills" title="Pick what you know" subtitle="Click everything that applies. Search to add anything not listed.">
      <div className="mx-auto max-w-4xl">
        <div className="glass sticky top-4 z-10 flex items-center gap-3 rounded-2xl p-3">
          <Search className="ml-2 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search skills..." className="border-0 bg-transparent focus-visible:ring-0" />
          <span className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">{picked.size} selected</span>
        </div>
        <div className="mt-8 space-y-8">
          {filtered.map((g) => (
            <div key={g.name}>
              <h3 className="mb-3 text-xs uppercase tracking-[0.22em] text-muted-foreground">{g.name}</h3>
              <div className="flex flex-wrap gap-2">
                {g.skills.map((s) => {
                  const on = picked.has(s);
                  return (
                    <button key={s} onClick={() => toggle(s)} className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition-all",
                      on
                        ? "border-primary/60 bg-gradient-primary text-primary-foreground shadow-glow"
                        : "border-border/60 bg-card/40 text-foreground hover:border-border hover:bg-card",
                    )}>
                      {on && <Check className="h-3.5 w-3.5" />} {s}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 flex items-center justify-between">
          <Button variant="ghost" asChild><Link to="/onboarding/method">← Back</Link></Button>
          <Button asChild className="bg-gradient-primary text-primary-foreground shadow-glow">
            <Link to="/analyzing">Analyze <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </OnboardingShell>
  );
}