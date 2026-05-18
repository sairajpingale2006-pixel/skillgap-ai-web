import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight, Check, X, Sparkles, BookOpen, Rocket,
  PlayCircle, FileText, Github, Trophy, Brain,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { getState, type SkillGapState } from "@/lib/skillgap-store";

export const Route = createFileRoute("/results")({
  component: ResultsPage,
  head: () => ({ meta: [{ title: "Your match — SkillGap" }] }),
});

function ResultsPage() {
  const [state, setLocal] = useState<SkillGapState | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const s = getState();
    setLocal(s);
    if (!s.lastAnalysis) navigate({ to: "/onboarding/role" });
  }, [navigate]);

  if (!state?.lastAnalysis) {
    return (
      <AppShell>
        <div className="grid min-h-screen place-items-center px-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">No analysis yet.</p>
            <Button asChild className="mt-4 bg-gradient-primary text-primary-foreground">
              <Link to="/onboarding/role">Start onboarding</Link>
            </Button>
          </div>
        </div>
      </AppShell>
    );
  }

  const a = state.lastAnalysis;
  const roadmap = buildRoadmap(a.missing);

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="animate-fade-up">
            <div className="text-xs uppercase tracking-[0.22em] text-primary">Your match</div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">{state.roleTitle ?? "Your role"}</h1>
            <p className="mt-1 text-sm text-muted-foreground">Based on {a.totalRequired} required skills</p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" className="border-border/60 bg-secondary/40">
              <Link to="/onboarding/skills">Update skills</Link>
            </Button>
            <Button asChild className="bg-gradient-primary text-primary-foreground shadow-glow">
              <Link to="/coach">Open AI Coach <Sparkles className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <MatchScore score={a.score} matched={a.matched.length} total={a.totalRequired} />
          <Strengths items={a.matched} />
          <Gaps items={a.missing} />
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <Roadmap weeks={roadmap} title={state.roleTitle ?? "your role"} />
          <RightRail missing={a.missing} />
        </div>
      </div>
    </AppShell>
  );
}

function buildRoadmap(missing: { name: string; priority: string }[]) {
  const ordered = [...missing].sort((a, b) => (a.priority === b.priority ? 0 : a.priority === "High" ? -1 : 1));
  const picks = ordered.slice(0, 4);
  const labels = ["Weeks 1–2", "Weeks 3–4", "Weeks 5–6", "Weeks 7–9"];
  const tags = ["Foundation", "Frameworks", "Applied", "Portfolio"];
  return picks.map((p, i) => ({
    week: labels[i] ?? `Week ${i + 1}`,
    title: `Learn ${p.name}`,
    desc: `Build fundamentals in ${p.name}, then ship one project to lock it in.`,
    tag: tags[i] ?? "Practice",
  }));
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("glass rounded-2xl p-6", className)}>{children}</div>;
}

function MatchScore({ score, matched, total }: { score: number; matched: number; total: number }) {
  const r = 56;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  return (
    <Card className="lg:col-span-1">
      <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Match score</div>
      <div className="mt-4 flex items-center gap-6">
        <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
          <circle cx="70" cy="70" r={r} stroke="oklch(0.27 0.025 265)" strokeWidth="10" fill="none" />
          <circle cx="70" cy="70" r={r} stroke="url(#g)" strokeWidth="10" fill="none"
            strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" />
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="oklch(0.78 0.17 165)" />
              <stop offset="100%" stopColor="oklch(0.72 0.18 290)" />
            </linearGradient>
          </defs>
        </svg>
        <div>
          <div className="gradient-text text-5xl font-bold tabular-nums">{score}%</div>
          <div className="mt-1 text-sm text-muted-foreground">{matched} of {total} skills</div>
        </div>
      </div>
    </Card>
  );
}

function Strengths({ items }: { items: { name: string; priority: string }[] }) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Strengths</div>
        <Trophy className="h-4 w-4 text-primary" />
      </div>
      {items.length === 0 ? (
        <p className="mt-5 text-sm text-muted-foreground">No matches yet — add more skills.</p>
      ) : (
        <ul className="mt-5 space-y-3">
          {items.slice(0, 8).map((s) => (
            <li key={s.name} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-primary" />{s.name}</span>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">{s.priority}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function Gaps({ items }: { items: { name: string; priority: string }[] }) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Missing skills</div>
        <Brain className="h-4 w-4 text-accent" />
      </div>
      {items.length === 0 ? (
        <p className="mt-5 text-sm text-muted-foreground">🎉 You've got everything required!</p>
      ) : (
        <ul className="mt-5 space-y-3">
          {items.slice(0, 8).map((g) => (
            <li key={g.name} className="flex items-center justify-between rounded-xl border border-border/60 bg-card/40 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/15">
                  <X className="h-4 w-4 text-destructive" />
                </div>
                <div className="text-sm font-medium">{g.name}</div>
              </div>
              <span className={cn(
                "rounded-full px-2 py-0.5 text-[11px]",
                g.priority === "High" && "bg-destructive/15 text-destructive",
                g.priority === "Med" && "bg-amber-500/15 text-amber-400",
                g.priority === "Low" && "bg-secondary text-muted-foreground",
              )}>{g.priority}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function Roadmap({ weeks, title }: { weeks: { week: string; title: string; desc: string; tag: string }[]; title: string }) {
  return (
    <Card className="lg:col-span-2">
      <div>
        <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Roadmap</div>
        <h3 className="mt-1 text-lg font-semibold">Plan to {title}</h3>
      </div>
      {weeks.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">No gaps to close — try a more ambitious role!</p>
      ) : (
        <ol className="mt-6 relative space-y-6 border-l border-border/60 pl-6">
          {weeks.map((w, i) => (
            <li key={w.title} className="relative">
              <span className="absolute -left-[31px] top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-primary text-[10px] font-bold text-primary-foreground shadow-glow">
                {i + 1}
              </span>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground">{w.week}</span>
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-primary">{w.tag}</span>
              </div>
              <div className="mt-1 text-base font-medium">{w.title}</div>
              <p className="mt-1 text-sm text-muted-foreground">{w.desc}</p>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}

function RightRail({ missing }: { missing: { name: string; priority: string }[] }) {
  const top = missing[0]?.name;
  const projects = top
    ? [
        { t: `Beginner: ${top} sandbox`, d: `Follow a tutorial and ship the result publicly.` },
        { t: `Intermediate: build with ${top}`, d: `Ship a small app that uses ${top} end-to-end.` },
        { t: `Advanced: ${top} in production`, d: `Add tests, deploy, and write a postmortem.` },
      ]
    : [
        { t: "Polish a portfolio project", d: "Pick your best repo and add tests + README." },
        { t: "Open-source contribution", d: "Find a good-first-issue and ship a PR." },
      ];
  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center justify-between">
          <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Suggested projects</div>
          <Rocket className="h-4 w-4 text-primary" />
        </div>
        <ul className="mt-4 space-y-3">
          {projects.map((p) => (
            <li key={p.t} className="group flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-card/40 p-3 transition-colors hover:border-primary/40">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-secondary"><Github className="h-4 w-4 text-primary" /></div>
                <div>
                  <div className="text-sm font-medium">{p.t}</div>
                  <div className="text-xs text-muted-foreground">{p.d}</div>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Resources</div>
          <BookOpen className="h-4 w-4 text-primary" />
        </div>
        <ul className="mt-4 space-y-3">
          {missing.slice(0, 3).map((m) => (
            <li key={m.name} className="group flex items-center gap-3 rounded-xl border border-border/60 bg-card/40 p-3 transition-colors hover:border-primary/40">
              <PlayCircle className="h-4 w-4 text-primary" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">Learn {m.name}</div>
                <div className="text-xs text-muted-foreground">Docs, tutorials, and a starter project</div>
              </div>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </li>
          ))}
        </ul>
      </Card>

      <Card className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-primary opacity-25 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-primary">
            <Sparkles className="h-3.5 w-3.5" /> AI coach
          </div>
          <p className="mt-3 text-sm">
            {top ? `Start with ${top} this week — it's your highest-impact gap.` : "You're in great shape. Let's pick your next stretch role."}
          </p>
          <Button asChild size="sm" className="mt-4 bg-gradient-primary text-primary-foreground">
            <Link to="/coach">Talk to coach</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
