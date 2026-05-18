import { createFileRoute, Link } from "@tanstack/react-router";
import { UploadCloud, FileText, Link2 } from "lucide-react";
import { OnboardingShell } from "@/components/skillgap/Stepper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/onboarding/upload")({
  component: UploadPage,
  head: () => ({ meta: [{ title: "Upload resume — SkillGap" }] }),
});

function UploadPage() {
  return (
    <OnboardingShell step={2} eyebrow="Resume" title="Upload your resume" subtitle="PDF, DOCX, or paste a URL — we'll handle the rest.">
      <div className="mx-auto max-w-2xl">
        <label className="group flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border/70 bg-card/40 px-8 py-16 text-center transition-all hover:border-primary/60 hover:bg-card">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary group-hover:bg-gradient-primary">
            <UploadCloud className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
          </div>
          <div className="mt-5 text-base font-medium">Drop your resume here</div>
          <div className="mt-1 text-sm text-muted-foreground">or click to browse • Max 10MB</div>
          <input type="file" className="hidden" />
        </label>
        <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
          <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
        </div>
        <div className="glass rounded-2xl p-5">
          <label className="text-sm font-medium">Paste a LinkedIn or portfolio URL</label>
          <div className="mt-3 flex gap-2">
            <div className="relative flex-1">
              <Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="https://linkedin.com/in/your-handle" className="h-11 bg-background/50 pl-9" />
            </div>
            <Button className="h-11">Import</Button>
          </div>
        </div>
        <div className="mt-8 flex items-center justify-between">
          <Button variant="ghost" asChild><Link to="/onboarding/method">← Back</Link></Button>
          <Button asChild className="bg-gradient-primary text-primary-foreground shadow-glow">
            <Link to="/analyzing">Analyze my profile <FileText className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </OnboardingShell>
  );
}