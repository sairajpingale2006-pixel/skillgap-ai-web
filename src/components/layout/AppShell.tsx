import { Link, useLocation } from "@tanstack/react-router";
import { Sparkles, LayoutDashboard, MessageSquare, TrendingUp, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/results", label: "Results", icon: LayoutDashboard },
  { to: "/coach", label: "AI Coach", icon: MessageSquare },
  { to: "/progress", label: "Progress", icon: TrendingUp },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-border/60 bg-sidebar/60 backdrop-blur-xl md:flex">
        <Link to="/" className="flex items-center gap-2 px-6 py-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight">SkillGap</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">AI Career OS</div>
          </div>
        </Link>
        <nav className="flex flex-col gap-1 px-3">
          {nav.map((item) => {
            const active = pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  active
                    ? "bg-secondary text-foreground shadow-card"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                )}
              >
                <Icon className={cn("h-4 w-4 transition-colors", active && "text-primary")} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto p-4">
          <div className="glass rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-gradient-primary" />
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">Guest user</div>
                <div className="truncate text-xs text-muted-foreground">Free plan</div>
              </div>
              <Settings className="ml-auto h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>
      </aside>
      <main className="md:pl-64">{children}</main>
    </div>
  );
}