import { createFileRoute } from '@tanstack/react-router';
import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

export const Route = createFileRoute('/ask')({
  component: AskRoute,
});

function Bubble({ who, children }: { who: "user" | "ai"; children: React.ReactNode }) {
  const isUser = who === "user";
  return (
    <div className={isUser ? "flex justify-end" : "flex justify-start"}>
      <div
        className={[
          "max-w-[85%] rounded-md px-4 py-3 text-sm leading-relaxed",
          isUser ? "bg-foreground text-background" : "border border-rule/50 bg-background/50 text-foreground",
        ].join(" ")}
      >
        {children}
      </div>
    </div>
  );
}

function AskRoute() {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([
    { role: 'ai', content: 'Hello. I am an AI assistant trained on Dr. Khare\'s CV, publications, and professional background. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: content } = useQuery({
    queryKey: ['content', 'ask_page'],
    queryFn: async () => {
      const res = await api.get('/content');
      return res.data.ask_page || {};
    }
  });

  const suggestions = content?.suggestions || [];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e?: React.FormEvent, suggestionText?: string) => {
    e?.preventDefault();
    const text = suggestionText || input;
    if (!text.trim() || isLoading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setIsLoading(true);

    try {
      const res = await api.post('/chatbot/ask', { message: text });
      setMessages(prev => [...prev, { role: 'ai', content: res.data.response }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'ai', content: 'Sorry, I encountered an error connecting to the knowledge base.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-20 md:px-10">
      <div className="mb-12 text-center">
        <h1 className="font-display text-4xl font-light tracking-tight sm:text-5xl">Ask the Assistant</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          A conversational interface grounded securely in Dr. Khare's Master CV, publications, and professional history.
        </p>
      </div>

      <div className="rounded-2xl border border-rule/50 bg-background/30 p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-3 border-b border-rule/50 pb-4">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-foreground text-background font-display font-medium">
            SK
          </span>
          <div className="min-w-0">
            <div className="font-display text-lg text-foreground">Ask Dr. Khare</div>
            <div className="text-sm text-muted-foreground">AI assistant &bull; Trained on CV data</div>
          </div>
          <span className="ml-auto inline-flex items-center gap-2 text-xs text-muted-foreground">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" /> online
          </span>
        </div>

        <div className="space-y-4 py-6 h-[50vh] overflow-y-auto pr-2" ref={scrollRef}>
          {messages.map((m, i) => (
             <Bubble key={i} who={m.role}>{m.content}</Bubble>
          ))}
          {isLoading && (
             <Bubble who="ai">
               <span className="flex gap-1 items-center">
                 <span className="h-1.5 w-1.5 bg-foreground/50 rounded-full animate-bounce" />
                 <span className="h-1.5 w-1.5 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                 <span className="h-1.5 w-1.5 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
               </span>
             </Bubble>
          )}
        </div>

        <div className="flex flex-wrap gap-2 border-t border-rule/50 pt-4">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => handleSubmit(undefined, s)}
              className="rounded-full border border-rule/50 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
            >
              {s}
            </button>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-5 flex items-center gap-3 border-t border-rule/50 pt-5"
        >
          <input
            type="text"
            placeholder="Ask a question about Dr. Khare's background..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-w-0 flex-1 bg-transparent py-2 px-4 rounded-full border border-rule/50 text-base text-foreground outline-none focus:border-foreground/50 transition-colors"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="shrink-0 rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90 disabled:opacity-50"
          >
            Ask
          </button>
        </form>
      </div>
    </div>
  );
}
