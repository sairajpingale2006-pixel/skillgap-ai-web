import { Check, X, Sparkles } from "lucide-react";

export function FloatingMatchCard({
  className = "",
  role = "AI Engineer",
  score = 72,
  skills = [
    { name: "Python", have: true },
    { name: "SQL", have: true },
    { name: "TensorFlow", have: false },
  ],
}: {
  className?: string;
  role?: string;
  score?: number;
  skills?: { name: string; have: boolean }[];
}) {
  return (
    <div className={`glass-strong w-72 rounded-2xl p-5 shadow-elegant ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-primary">
            <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Match</div>
            <div className="text-sm font-semibold">{role}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="gradient-text text-2xl font-bold tabular-nums">{score}%</div>
        </div>
      </div>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-secondary">
        <div className="h-full bg-gradient-primary" style={{ width: `${score}%` }} />
      </div>
      <ul className="mt-4 space-y-2 text-sm">
        {skills.map((s) => (
          <li key={s.name} className="flex items-center gap-2">
            {s.have ? (
              <Check className="h-4 w-4 text-primary" />
            ) : (
              <X className="h-4 w-4 text-destructive" />
            )}
            <span className={s.have ? "text-foreground" : "text-muted-foreground"}>{s.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}