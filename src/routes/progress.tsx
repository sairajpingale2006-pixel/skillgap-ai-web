import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Flame, Trophy, Target, TrendingUp, Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/progress")({
  component: ProgressPage,
  head: () => ({ meta: [{ title: "Progress — SkillGap" }] }),
});

function ProgressPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="animate-fade-up">
            <div className="text-xs uppercase tracking-[0.22em] text-primary">Progress</div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">You're on track</h1>
            <p className="mt-1 text-sm text-muted-foreground">Week 3 of 9 • Keep the streak going</p>
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-4">
          <Stat icon={Flame} label="Day streak" value="14" delta="+1 today" />
          <Stat icon={TrendingUp} label="Match growth" value="+18%" delta="last 30 days" />
          <Stat icon={Trophy} label="Milestones" value="6/14" delta="2 this week" />
          <Stat icon={Target} label="Weekly focus" value="TensorFlow" delta="3 sessions left" />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="glass rounded-2xl p-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Match score over time</div>
                <h3 className="mt-1 text-lg font-semibold">+18% in 30 days</h3>
              </div>
              <div className="flex gap-1 text-xs">
                {["7d", "30d", "90d", "All"].map((r, i) => (
                  <button key={r} className={cn(
                    "rounded-md px-2 py-1",
                    i === 1 ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}>{r}</button>
                ))}
              </div>
            </div>
            <Sparkline />
          </div>
          <Heatmap />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Milestones />
          <SkillProgress />
        </div>
      </div>
    </AppShell>
  );
}

function Stat({ icon: Icon, label, value, delta }: { icon: any; label: string; value: string; delta: string }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{label}</div>
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="mt-3 text-3xl font-semibold tabular-nums">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{delta}</div>
    </div>
  );
}

function Sparkline() {
  const pts = [22, 28, 30, 36, 40, 42, 45, 48, 52, 55, 58, 62, 64, 67, 70, 72];
  const max = Math.max(...pts);
  const min = Math.min(...pts);
  const w = 600, h = 180, pad = 8;
  const xs = (i: number) => pad + (i * (w - pad * 2)) / (pts.length - 1);
  const ys = (v: number) => h - pad - ((v - min) / (max - min)) * (h - pad * 2);
  const path = pts.map((v, i) => `${i ? "L" : "M"}${xs(i)} ${ys(v)}`).join(" ");
  const area = `${path} L${xs(pts.length - 1)} ${h} L${xs(0)} ${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-6 h-44 w-full">
      <defs>
        <linearGradient id="sp" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.78 0.17 165)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="oklch(0.78 0.17 165)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ln" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="oklch(0.78 0.17 165)" />
          <stop offset="100%" stopColor="oklch(0.72 0.18 290)" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#sp)" />
      <path d={path} fill="none" stroke="url(#ln)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Heatmap() {
  const cells = Array.from({ length: 49 }).map(() => Math.floor(Math.random() * 5));
  return (
    <div className="glass rounded-2xl p-6">
      <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Activity</div>
      <h3 className="mt-1 text-lg font-semibold">Last 7 weeks</h3>
      <div className="mt-5 grid grid-cols-7 gap-1.5">
        {cells.map((v, i) => (
          <div key={i} className="aspect-square rounded-sm" style={{
            background: v === 0 ? "oklch(0.27 0.025 265)" : `oklch(0.78 0.17 165 / ${0.2 + v * 0.18})`,
          }} />
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>Less</span>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map((v) => (
            <div key={v} className="h-3 w-3 rounded-sm" style={{ background: v === 0 ? "oklch(0.27 0.025 265)" : `oklch(0.78 0.17 165 / ${0.2 + v * 0.18})` }} />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
}

function Milestones() {
  const items = [
    { done: true, t: "Completed neural net fundamentals", d: "Week 2" },
    { done: true, t: "Shipped MNIST classifier", d: "Week 2" },
    { done: true, t: "Built first PyTorch model", d: "Week 3" },
    { done: false, t: "Vector DB & RAG project", d: "Week 5" },
    { done: false, t: "Capstone LLM agent", d: "Week 9" },
  ];
  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Milestones</div>
          <h3 className="mt-1 text-lg font-semibold">3 of 5 complete</h3>
        </div>
        <Trophy className="h-4 w-4 text-primary" />
      </div>
      <ol className="mt-5 space-y-3">
        {items.map((m) => (
          <li key={m.t} className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/40 p-3">
            <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", m.done ? "bg-gradient-primary" : "bg-secondary")}>
              {m.done ? <Check className="h-4 w-4 text-primary-foreground" /> : <Circle className="h-4 w-4 text-muted-foreground" />}
            </div>
            <div className="flex-1">
              <div className={cn("text-sm font-medium", m.done && "line-through opacity-60")}>{m.t}</div>
              <div className="text-xs text-muted-foreground">{m.d}</div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function SkillProgress() {
  const items = [
    { name: "PyTorch", from: 0, to: 45 },
    { name: "TensorFlow", from: 0, to: 28 },
    { name: "RAG", from: 15, to: 62 },
    { name: "MLOps", from: 5, to: 22 },
    { name: "Eval", from: 0, to: 18 },
  ];
  return (
    <div className="glass rounded-2xl p-6">
      <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Skill movement</div>
      <h3 className="mt-1 text-lg font-semibold">Trained this month</h3>
      <ul className="mt-5 space-y-5">
        {items.map((s) => (
          <li key={s.name}>
            <div className="flex items-center justify-between text-sm">
              <span>{s.name}</span>
              <span className="tabular-nums text-primary">+{s.to - s.from}%</span>
            </div>
            <div className="relative mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
              <div className="absolute inset-y-0 bg-muted-foreground/30" style={{ width: `${s.from}%` }} />
              <div className="absolute inset-y-0 bg-gradient-primary" style={{ left: `${s.from}%`, width: `${s.to - s.from}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}