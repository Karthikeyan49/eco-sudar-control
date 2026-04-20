import { useEffect, useRef, useState, type FormEvent } from "react";
import { MessageCircle, Send, Sparkles, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatContext } from "@/contexts/ChatContext";
import { toast } from "sonner";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const GREETING: Msg = {
  role: "assistant",
  content:
    "Hi! I'm the **Eco Sudar assistant**. Ask me anything about what you're seeing on this page — orders, expenses, employees, reports… I'll answer using your live data.\n\n_AI replies will activate once Lovable Cloud is enabled._",
};

/**
 * Floating chat panel mounted globally inside DashboardLayout.
 * Frontend skeleton — wire to the `chat-assistant` edge function once
 * Lovable Cloud is enabled to stream real responses.
 */
export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const { current } = useChatContext();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const send = async (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: text }]);
    setBusy(true);

    // TODO: when Lovable Cloud is enabled, replace this stub with a streaming
    // fetch to `${VITE_SUPABASE_URL}/functions/v1/chat-assistant` that sends
    // { messages, context: current } and renders SSE deltas token-by-token.
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            `I'd answer this using **${current?.page ?? "the current page"}** data, but the AI backend isn't connected yet.\n\n` +
            `**To enable:** turn on **Lovable Cloud** — the chatbot will then read live page context (currently: ${
              current?.summary ?? "no context registered"
            }) and answer with the Lovable AI Gateway.`,
        },
      ]);
      setBusy(false);
    }, 600);
  };

  return (
    <>
      {/* Floating launcher */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open Eco Sudar assistant"
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[min(400px,calc(100vw-2rem))] h-[min(600px,calc(100vh-3rem))] bg-card border rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b bg-primary text-primary-foreground">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <div>
                <p className="font-semibold text-sm leading-tight">Ask Eco Sudar</p>
                <p className="text-[11px] text-primary-foreground/80 leading-tight">
                  {current?.page ? `Context: ${current.page}` : "No page context"}
                </p>
              </div>
            </div>
            <Button size="icon" variant="ghost" className="h-8 w-8 text-primary-foreground hover:bg-white/10" onClick={() => setOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {busy && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl rounded-bl-sm px-3 py-2 text-sm text-muted-foreground flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin" /> Thinking…
                </div>
              </div>
            )}
          </div>

          <form onSubmit={send} className="border-t p-3 flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about this page…"
              disabled={busy}
            />
            <Button type="submit" size="icon" disabled={busy || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
