import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Brain, Target, Rocket, Zap, LineChart, ShieldCheck, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarketingNav } from "@/components/layout/MarketingNav";
import { FloatingMatchCard } from "@/components/skillgap/FloatingMatchCard";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "SkillGap — Bridge your skill gap to your dream role" },
      { name: "description", content: "AI-native career OS that maps your skills to roles, builds a roadmap, and coaches you to land the job." },
    ],
  }),
});

function Index() {
  return (
    <div className="relative min-h-screen">
      <MarketingNav />
      {/* <Hero /> */}
      <Logos />
      <Features />
      <Stats />
      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  );
}

function Hero() {
  const { enableGuest } = useAuth();
  const navigate = useNavigate();
  async function googleSignIn() {
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/dashboard" });
    if (res.error) toast.error(res.error.message ?? "Google sign-in failed");
    else if (!res.redirected) navigate({ to: "/dashboard" });
  }
  function continueAsGuest() {
    enableGuest();
    navigate({ to: "/onboarding/role" });
  }
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-bg" />
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-24 pt-20 md:grid-cols-2 md:pt-28">
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/40 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />
            Introducing SkillGap AI Career OS
          </div>
          <h1 className="mt-6 text-5xl font-semibold tracking-tight md:text-6xl lg:text-7xl">
            Bridge your <span className="gradient-text">skill gap</span> to your dream role
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            An AI-native career operating system that maps what you know, surfaces what you're missing,
            and coaches you to land the role — in weeks, not years.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90">
              <Link to="/onboarding/role">
                Start in 30 seconds <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button onClick={continueAsGuest} size="lg" variant="outline" className="border-border/60 bg-secondary/40 backdrop-blur">
              Continue as guest
            </Button>
            <Button onClick={googleSignIn} size="lg" variant="ghost" className="gap-2">
              <GoogleIcon /> Sign in with Google
            </Button>
          </div>
          <div className="mt-10 flex items-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Private by default</div>
            <div className="flex items-center gap-2"><Zap className="h-4 w-4 text-primary" /> 30s onboarding</div>
          </div>
        </div>
        <div className="relative h-[460px]">
          <div className="absolute right-0 top-0 animate-float">
            <FloatingMatchCard role="AI Engineer" score={72} />
          </div>
          <div className="absolute left-4 top-32 animate-float" style={{ animationDelay: "1.2s" }}>
            <FloatingMatchCard
              role="Frontend Dev"
              score={88}
              skills={[
                { name: "React", have: true },
                { name: "TypeScript", have: true },
                { name: "WebGL", have: false },
              ]}
            />
          </div>
          <div className="absolute bottom-0 right-8 animate-float" style={{ animationDelay: "2.4s" }}>
            <FloatingMatchCard
              role="Data Scientist"
              score={64}
              skills={[
                { name: "Pandas", have: true },
                { name: "Statistics", have: true },
                { name: "PyTorch", have: false },
              ]}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4">
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.4-1.6 4-5.5 4-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.5 14.6 2.5 12 2.5 6.8 2.5 2.5 6.8 2.5 12S6.8 21.5 12 21.5c6.9 0 9.5-4.8 9.5-7.3 0-.5 0-.9-.1-1.3H12z"/>
    </svg>
  );
}

function Logos() {
  const logos = ["openai", "stripe", "vercel", "linear", "notion", "anthropic"];
  return (
    <div className="border-y border-border/40 bg-secondary/20 py-8">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-12 gap-y-4 px-6 text-sm text-muted-foreground">
        <span className="text-xs uppercase tracking-widest">Trusted by candidates from</span>
        {logos.map((l) => (
          <span key={l} className="text-base font-semibold tracking-tight text-foreground/70">{l}</span>
        ))}
      </div>
    </div>
  );
}

function Features() {
  const items = [
    { icon: Brain, title: "AI skill graph", desc: "We parse your resume, GitHub, and chat to build a living skill graph." },
    { icon: Target, title: "Role-fit scoring", desc: "Real-time match scores against thousands of live role profiles." },
    { icon: Rocket, title: "Personal roadmap", desc: "Week-by-week plan with projects, resources, and milestones." },
    { icon: Sparkles, title: "AI coach", desc: "A second-brain that answers, reviews work, and unblocks you 24/7." },
    { icon: LineChart, title: "Progress OS", desc: "Streaks, momentum, and visible deltas on every skill you train." },
    { icon: ShieldCheck, title: "Private by default", desc: "Your data never trains a public model. Export or delete anytime." },
  ];
  return (
    <section id="features" className="mx-auto max-w-7xl px-6 py-28">
      <SectionHeader eyebrow="Features" title="Everything you need to close the gap" />
      <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-border/60 bg-border/60 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((f) => (
          <div key={f.title} className="group relative bg-card/60 p-8 transition-colors hover:bg-card">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary group-hover:bg-gradient-primary">
              <f.icon className="h-5 w-5 text-primary group-hover:text-primary-foreground" />
            </div>
            <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Stats() {
  const stats = [
    { v: "92%", l: "of users land interviews within 6 weeks" },
    { v: "3.2x", l: "faster skill ramp vs. self-study" },
    { v: "180+", l: "roles modelled across the stack" },
    { v: "24/7", l: "AI coaching, no scheduling" },
  ];
  return (
    <section id="stats" className="mx-auto max-w-7xl px-6 py-20">
      <div className="grid gap-px overflow-hidden rounded-3xl border border-border/60 bg-border/60 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.l} className="bg-card/60 p-8 text-center">
            <div className="gradient-text text-4xl font-bold tabular-nums">{s.v}</div>
            <div className="mt-2 text-sm text-muted-foreground">{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  const t = [
    { q: "Felt like having a staff engineer mentor on call. Landed an AI Engineer offer in 5 weeks.", a: "Priya S.", r: "AI Engineer @ Series B" },
    { q: "The roadmap killed my decision fatigue. I just opened it every morning and shipped.", a: "Marcus L.", r: "Full Stack Developer" },
    { q: "Match scores are eerily accurate. It told me exactly what was missing.", a: "Hana K.", r: "Data Scientist" },
  ];
  return (
    <section id="testimonials" className="mx-auto max-w-7xl px-6 py-28">
      <SectionHeader eyebrow="Testimonials" title="Loved by ambitious engineers" />
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {t.map((x) => (
          <figure key={x.a} className="glass rounded-2xl p-8">
            <blockquote className="text-base leading-relaxed">"{x.q}"</blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-gradient-primary" />
              <div>
                <div className="text-sm font-medium">{x.a}</div>
                <div className="text-xs text-muted-foreground">{x.r}</div>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function FAQ() {
  const items = [
    { q: "How long does onboarding take?", a: "About 30 seconds. Pick a role, drop your resume or chat, and we'll do the rest." },
    { q: "Is my data private?", a: "Yes. Your data is never used to train public models and you can export or delete it anytime." },
    { q: "Which roles are supported?", a: "180+ roles across AI, web, data, infra, and product — with new templates added weekly." },
    { q: "Do I need to pay to try it?", a: "No. The full onboarding and a baseline roadmap are free forever." },
  ];
  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 py-28">
      <SectionHeader eyebrow="FAQ" title="Questions, answered" align="center" />
      <Accordion type="single" collapsible className="mt-10">
        {items.map((i, idx) => (
          <AccordionItem key={i.q} value={`i-${idx}`} className="border-border/60">
            <AccordionTrigger className="text-left text-base">
              <span className="flex items-center gap-3">
                <ChevronDown className="hidden" />
                {i.q}
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{i.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-12 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-semibold">SkillGap</span>
          <span className="ml-3 text-xs text-muted-foreground">© {new Date().getFullYear()} SkillGap Labs</span>
        </div>
        <nav className="flex flex-wrap gap-6 text-sm text-muted-foreground">
          <a href="#" className="hover:text-foreground">Privacy</a>
          <a href="#" className="hover:text-foreground">Terms</a>
          <a href="#" className="hover:text-foreground">Changelog</a>
          <a href="#" className="hover:text-foreground">Contact</a>
        </nav>
      </div>
    </footer>
  );
}

function SectionHeader({ eyebrow, title, align = "left" }: { eyebrow: string; title: string; align?: "left" | "center" }) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      <div className="text-xs uppercase tracking-[0.22em] text-primary">{eyebrow}</div>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
    </div>
  );
}
