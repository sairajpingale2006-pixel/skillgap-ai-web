import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function Stepper({ step, total = 3, labels }: { step: number; total?: number; labels?: string[] }) {
  return (
    <div className="mx-auto flex max-w-xl items-center gap-3">
      {Array.from({ length: total }).map((_, i) => {
        const n = i + 1;
        const done = n < step;
        const active = n === step;
        return (
          <div key={n} className="flex flex-1 items-center gap-3">
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-all",
                done && "border-primary bg-primary text-primary-foreground",
                active && "border-primary bg-gradient-primary text-primary-foreground shadow-glow",
                !done && !active && "border-border bg-secondary text-muted-foreground",
              )}
            >
              {done ? <Check className="h-4 w-4" /> : n}
            </div>
            {labels?.[i] && (
              <span className={cn("hidden text-sm md:inline", active ? "text-foreground" : "text-muted-foreground")}>
                {labels[i]}
              </span>
            )}
            {n < total && <div className={cn("h-px flex-1", done ? "bg-primary" : "bg-border")} />}
          </div>
        );
      })}
    </div>
  );
}

export function OnboardingShell({
  step,
  eyebrow,
  title,
  subtitle,
  children,
}: {
  step: number;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border/40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <a href="/" className="text-sm font-semibold tracking-tight">SkillGap</a>
          <span className="text-xs text-muted-foreground">Step {step} of 3</span>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-6 py-10">
        <Stepper step={step} labels={["Role", "Profile", "Analyze"]} />
        <div className="mt-12 text-center animate-fade-up">
          {eyebrow && <div className="text-xs uppercase tracking-[0.22em] text-primary">{eyebrow}</div>}
          <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">{title}</h1>
          {subtitle && <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="mt-12">{children}</div>
      </div>
    </div>
  );
}