import { createFileRoute, Link } from "@tanstack/react-router";
import { OnboardingShell } from "@/components/skillgap/Stepper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Send, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/onboarding/chat")({
  component: ChatPage,
  head: () => ({ meta: [{ title: "Talk to AI — SkillGap" }] }),
});

const conversation = [
  { role: "ai", text: "Hi! I'm your SkillGap coach. What's the most impressive thing you've built recently?" },
  { role: "user", text: "A RAG chatbot for internal docs using LangChain and Postgres + pgvector." },
  { role: "ai", text: "Nice. Did you handle evaluation and retrieval tuning yourself, or was that shared with the team?" },
];

function ChatPage() {
  return (
    <OnboardingShell step={2} eyebrow="Conversation" title="Tell me about you" subtitle="A 3-question chat. The more specific, the better the roadmap.">
      <div className="mx-auto max-w-2xl">
        <div className="glass rounded-3xl p-6">
          <div className="space-y-4">
            {conversation.map((m, i) => (
              <div key={i} className={m.role === "ai" ? "flex gap-3" : "flex justify-end"}>
                {m.role === "ai" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-primary">
                    <Sparkles className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
                <div className={m.role === "ai"
                  ? "max-w-[80%] rounded-2xl rounded-tl-sm bg-secondary/60 px-4 py-3 text-sm"
                  : "max-w-[80%] rounded-2xl rounded-tr-sm bg-gradient-primary px-4 py-3 text-sm text-primary-foreground"
                }>{m.text}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-2 border-t border-border/40 pt-4">
            <Input placeholder="Type your answer..." className="h-11 bg-background/50" />
            <Button size="icon" className="h-11 w-11 bg-gradient-primary"><Send className="h-4 w-4" /></Button>
          </div>
        </div>
        <div className="mt-8 flex items-center justify-between">
          <Button variant="ghost" asChild><Link to="/onboarding/method">← Back</Link></Button>
          <Button asChild className="bg-gradient-primary text-primary-foreground shadow-glow">
            <Link to="/analyzing">Finish <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </OnboardingShell>
  );
}