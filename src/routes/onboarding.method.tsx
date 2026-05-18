import { createFileRoute, Link } from "@tanstack/react-router";
import { FileUp, ListChecks, MessageSquare, ArrowRight } from "lucide-react";
import { OnboardingShell } from "@/components/skillgap/Stepper";

export const Route = createFileRoute("/onboarding/method")({
  component: MethodPage,
  head: () => ({ meta: [{ title: "Choose method — SkillGap" }] }),
});

const methods = [
  { to: "/onboarding/upload" as const, icon: FileUp, title: "Upload Resume", desc: "Drop your PDF or paste a link. We'll extract your skills automatically.", time: "~10s", accent: "from-emerald-400/30 to-cyan-400/20" },
  { to: "/onboarding/skills" as const, icon: ListChecks, title: "Pick Skills", desc: "Tap through categorized chips. No boring forms, just click what you know.", time: "~1 min", accent: "from-violet-400/30 to-fuchsia-400/20" },
  { to: "/onboarding/chat" as const, icon: MessageSquare, title: "Talk to AI", desc: "A 3-question conversation that maps your experience precisely.", time: "~2 min", accent: "from-amber-400/30 to-rose-400/20" },
];

function MethodPage() {
  return (
    <OnboardingShell step={2} eyebrow="Step 2" title="How should we understand you?" subtitle="Pick whichever feels right. You can always add more later.">
      <div className="grid gap-6 md:grid-cols-3">
        {methods.map((m) => {
          const Icon = m.icon;
          return (
            <Link key={m.to} to={m.to} className="group relative overflow-hidden rounded-3xl border border-border/60 bg-card/50 p-8 transition-all hover:-translate-y-1 hover:border-primary/60 hover:shadow-glow">
              <div className={`pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br ${m.accent} blur-3xl opacity-60`} />
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow">
                  <Icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="mt-6 text-xl font-semibold">{m.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{m.desc}</p>
                <div className="mt-8 flex items-center justify-between">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">{m.time}</span>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    Choose <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </OnboardingShell>
  );
}