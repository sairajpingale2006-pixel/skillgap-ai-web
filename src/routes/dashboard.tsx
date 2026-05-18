import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { getState, type SkillGapState } from "@/lib/skillgap-store";
import { Sparkles, ArrowRight, Target, MessageSquare, TrendingUp, BookOpen, FileText } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
  head: () => ({ meta: [{ title: "Dashboard — SkillGap" }] }),
});

function Dashboard() {
  const { user, isGuest } = useAuth();
  const [state, setLocal] = useState<SkillGapState>({ skills: [] });
  useEffect(() => {
    setLocal(getState());
    const h = () => setLocal(getState());
    window.addEventListener("skillgap:state", h);
    return () => window.removeEventListener("skillgap:state", h);
  }, []);

  const name = user?.user_metadata?.full_name || user?.email?.split("@")[0] || (isGuest ? "Guest" : "there");
  const hasResult = !!state.lastAnalysis;

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-primary">Dashboard</div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Hi, {name} 👋</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {hasResult ? `You're ${state.lastAnalysis!.score}% to ${state.roleTitle ?? "your target role"}.` : "Let's set up your career roadmap."}
            </p>
          </div>
          <Button asChild className="bg-gradient-primary text-primary-foreground shadow-glow">
            <Link to="/onboarding/role">{hasResult ? "New analysis" : "Start onboarding"} <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Tile to="/results" icon={Target} title="My match" desc={hasResult ? `${state.lastAnalysis!.score}% match — view full breakdown` : "Run your first analysis"} />
          <Tile to="/coach" icon={MessageSquare} title="AI Coach" desc="Ask anything. Get a precise next step." />
          <Tile to="/progress" icon={TrendingUp} title="Progress" desc="Track skills, streaks and badges." />
          <Tile to="/onboarding/upload" icon={FileText} title="Resume Analysis" desc="Upload and score your resume." />
          <Tile to="/onboarding/skills" icon={BookOpen} title="Update skills" desc="Add new skills as you learn them." />
          <Tile to="/onboarding/role" icon={Sparkles} title="Change target role" desc="Re-aim at a different role." />
        </div>
      </div>
    </AppShell>
  );
}

function Tile({ to, icon: Icon, title, desc }: { to: string; icon: any; title: string; desc: string }) {
  return (
    <Link to={to} className="group glass rounded-2xl p-6 transition-all hover:-translate-y-0.5 hover:border-primary/40">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
        <Icon className="h-4 w-4 text-primary-foreground" />
      </div>
      <h3 className="mt-4 text-base font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
      <ArrowRight className="mt-4 h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
    </Link>
  );
}