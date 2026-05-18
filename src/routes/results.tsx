import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight, Check, X, Sparkles, Calendar, BookOpen, Rocket,
  PlayCircle, FileText, Github, Trophy, TrendingUp, Brain,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/results")({
  component: ResultsPage,
  head: () => ({ meta: [{ title: "Your match — SkillGap" }] }),
});

function ResultsPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-6 py-10">
        <PageHeader />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <MatchScore />
          <Strengths />
          <Gaps />
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <Roadmap />
          <RightRail />
        </div>
      </div>
    </AppShell>
  );
}

function PageHeader() {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="animate-fade-up">
        <div className="text-xs uppercase tracking-[0.22em] text-primary">Your match</div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">AI Engineer</h1>
        <p className="mt-1 text-sm text-muted-foreground">Updated just now • Based on 14 signals</p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" className="border-border/60 bg-secondary/40">Export PDF</Button>
        <Button asChild className="bg-gradient-primary text-primary-foreground shadow-glow">
          <Link to="/coach">Open AI Coach <Sparkles className="ml-1 h-4 w-4" /></Link>
        </Button>
      </div>
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("glass rounded-2xl p-6", className)}>{children}</div>;
}

function MatchScore() {
  const score = 72;
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
          <div className="mt-1 text-sm text-muted-foreground">Strong baseline</div>
          <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-[11px] text-primary">
            <TrendingUp className="h-3 w-3" /> +6 since last week
          </div>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-3 gap-3 text-center">
        {[
          { l: "Skills", v: "18/25" },
          { l: "Projects", v: "3" },
          { l: "Weeks", v: "9" },
        ].map((s) => (
          <div key={s.l} className="rounded-xl border border-border/60 bg-card/40 px-3 py-3">
            <div className="text-lg font-semibold">{s.v}</div>
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{s.l}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function Strengths() {
  const items = [
    { name: "Python", level: 92 },
    { name: "SQL", level: 86 },
    { name: "REST APIs", level: 80 },
    { name: "Pandas", level: 74 },
    { name: "Git workflow", level: 88 },
  ];
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Strengths</div>
        <Trophy className="h-4 w-4 text-primary" />
      </div>
      <ul className="mt-5 space-y-4">
        {items.map((s) => (
          <li key={s.name}>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-primary" />{s.name}</span>
              <span className="tabular-nums text-muted-foreground">{s.level}%</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
              <div className="h-full bg-gradient-primary" style={{ width: `${s.level}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function Gaps() {
  const items = [
    { name: "TensorFlow", priority: "High", effort: "3 wks" },
    { name: "Vector DBs", priority: "High", effort: "1 wk" },
    { name: "MLOps", priority: "Med", effort: "2 wks" },
    { name: "Distributed training", priority: "Low", effort: "4 wks" },
  ];
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Missing skills</div>
        <Brain className="h-4 w-4 text-accent" />
      </div>
      <ul className="mt-5 space-y-3">
        {items.map((g) => (
          <li key={g.name} className="flex items-center justify-between rounded-xl border border-border/60 bg-card/40 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/15">
                <X className="h-4 w-4 text-destructive" />
              </div>
              <div>
                <div className="text-sm font-medium">{g.name}</div>
                <div className="text-xs text-muted-foreground">~{g.effort}</div>
              </div>
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
    </Card>
  );
}

function Roadmap() {
  const weeks = [
    { week: "Weeks 1–2", title: "Neural networks fundamentals", desc: "Backprop, optimizers, regularization. Ship: MNIST classifier from scratch.", tag: "Foundation" },
    { week: "Weeks 3–4", title: "PyTorch & TensorFlow", desc: "Build the same model in both. Understand the trade-offs.", tag: "Frameworks" },
    { week: "Weeks 5–6", title: "Vector DBs & RAG", desc: "Embeddings, pgvector, hybrid search. Ship: doc Q&A app.", tag: "Applied" },
    { week: "Weeks 7–9", title: "Capstone: LLM agent", desc: "Tool-using agent with eval harness. Deploy to production.", tag: "Portfolio" },
  ];
  return (
    <Card className="lg:col-span-2">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Roadmap</div>
          <h3 className="mt-1 text-lg font-semibold">9-week plan to AI Engineer</h3>
        </div>
        <Button variant="ghost" size="sm" className="gap-1">
          <Calendar className="h-4 w-4" /> Sync to calendar
        </Button>
      </div>
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
    </Card>
  );
}

function RightRail() {
  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center justify-between">
          <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Suggested projects</div>
          <Rocket className="h-4 w-4 text-primary" />
        </div>
        <ul className="mt-4 space-y-3">
          {[
            { t: "RAG over your own notes", d: "Embeddings + pgvector + Next.js" },
            { t: "LLM eval harness", d: "Score model outputs with rubrics" },
            { t: "Fine-tune a small model", d: "LoRA on a 7B base model" },
          ].map((p) => (
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
          {[
            { i: PlayCircle, t: "Karpathy: Neural Networks Zero to Hero", k: "Course • 12h" },
            { i: FileText, t: "Attention is All You Need", k: "Paper • 15 min" },
            { i: PlayCircle, t: "Stanford CS25: Transformers", k: "Lectures" },
          ].map((r) => (
            <li key={r.t} className="group flex items-center gap-3 rounded-xl border border-border/60 bg-card/40 p-3 transition-colors hover:border-primary/40">
              <r.i className="h-4 w-4 text-primary" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{r.t}</div>
                <div className="text-xs text-muted-foreground">{r.k}</div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
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
            "Start with vector DBs this week — it unblocks the next 3 projects."
          </p>
          <Button asChild size="sm" className="mt-4 bg-gradient-primary text-primary-foreground">
            <Link to="/coach">Talk to coach</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}