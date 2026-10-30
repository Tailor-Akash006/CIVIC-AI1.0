import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  RotateCcw, 
  ChevronDown, 
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  FilePlus,
  Compass,
  MessageSquare
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'welcome',
    role: 'assistant',
    text: `Hello! I'm **CIVICMIND AI Assistant**, powered by Gemini.

I can help you report civic issues, explain how our AI calculates priority scores (0–100), explain duplicate cluster merging, or help you track municipal repairs.

Select a quick topic below or type any question:`,
    timestamp: 'Just now'
  }
];

const SUGGESTED_QUESTIONS = [
  "How to report a pothole or road damage?",
  "How is AI priority score calculated?",
  "How does duplicate clustering work?",
  "What are the emergency repair SLAs?",
  "How can I track my complaint status?"
];

export const CivicAiBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  const handleSendMessage = async (userText: string) => {
    if (!userText.trim() || isLoading) return;

    const query = userText.trim();
    setInputValue('');
    setHasInteracted(true);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setIsLoading(true);

    try {
      const historyPayload = nextMessages
        .filter(m => m.id !== 'welcome')
        .map(m => ({ role: m.role, text: m.text }));

      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: historyPayload
        })
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const data = await res.json();
      const botReply = data.reply || "I'm having trouble retrieving details right now. Please try again.";

      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          text: botReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      console.warn('AI Assistant error, falling back to local domain handler:', err);
      // Client-side fallback if server route is unreachable
      let fallbackText = "I'm having trouble connecting to the backend right now. You can report civic problems directly via the **Report Issue** page or inspect reports in the **Citizen Portal**.";
      
      const q = query.toLowerCase();
      if (q.includes('pothole') || q.includes('report') || q.includes('road')) {
        fallbackText = "To report a defect: navigate to **/report**, fill in the issue category, describe the defect, pick the location on our interactive map, and upload an optional photo. Our AI assigns an instant tracking ID!";
      } else if (q.includes('priority') || q.includes('score')) {
        fallbackText = "AI Priority scores range from 0 to 100 based on: Public Safety Hazards (40%), Facility Proximity (25%), Corroborating Reports (20%), and Infrastructure Vulnerability (15%). Scores above 85 trigger critical 4-hour SLAs.";
      } else if (q.includes('duplicate')) {
        fallbackText = "Duplicate clustering automatically detects complaints reported within 250m with semantic similarity. City dispatchers can merge duplicate reports into a unified ticket with one click.";
      }

      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          text: fallbackText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages(INITIAL_MESSAGES);
    setHasInteracted(false);
  };

  // Helper to format basic markdown-style text (bold, headers, bullets)
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return (
      <div className="space-y-1.5 text-xs">
        {lines.map((line, idx) => {
          if (!line.trim()) return <div key={idx} className="h-1" />;

          // Header
          if (line.startsWith('### ')) {
            return (
              <h4 key={idx} className="font-bold text-slate-900 text-xs mt-1.5 mb-0.5">
                {line.replace('### ', '')}
              </h4>
            );
          }

          // Bullet point
          if (line.startsWith('- ') || line.startsWith('* ')) {
            const content = line.substring(2);
            return (
              <div key={idx} className="flex items-start gap-1.5 pl-1">
                <span className="text-blue-500 font-bold shrink-0">•</span>
                <span dangerouslySetInnerHTML={{ __html: formatBoldAndCode(content) }} />
              </div>
            );
          }

          // Numbered list
          const matchNum = line.match(/^(\d+)\.\s+(.*)/);
          if (matchNum) {
            return (
              <div key={idx} className="flex items-start gap-1.5 pl-1">
                <span className="text-blue-600 font-mono font-semibold shrink-0">{matchNum[1]}.</span>
                <span dangerouslySetInnerHTML={{ __html: formatBoldAndCode(matchNum[2]) }} />
              </div>
            );
          }

          return (
            <p key={idx} dangerouslySetInnerHTML={{ __html: formatBoldAndCode(line) }} />
          );
        })}
      </div>
    );
  };

  const formatBoldAndCode = (str: string) => {
    return str
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>')
      .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-200/60 font-mono text-[11px] text-blue-700">$1</code>');
  };

  return (
    <aside aria-label="CIVICMIND AI Assistant" className="fixed bottom-6 right-6 z-50">
      {/* Expanded Apple VisionOS Chat Window */}
      {isOpen && (
        <div 
          role="dialog"
          aria-modal="true"
          aria-labelledby="civic-assistant-title"
          className="w-[92vw] sm:w-[410px] h-[540px] max-h-[85vh] glass-panel rounded-3xl border border-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.22)] backdrop-blur-3xl bg-white/90 flex flex-col overflow-hidden mb-3 animate-in fade-in zoom-in-95 duration-200"
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-200/60 bg-white/70 backdrop-blur-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 id="civic-assistant-title" className="text-sm font-bold text-slate-900 tracking-tight">CIVICMIND AI</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <p className="text-[10px] text-slate-500">Gemini 3.8 Flash · Civic Copilot</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleResetChat}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100/70 transition-colors cursor-pointer"
                title="Reset conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100/70 transition-colors cursor-pointer"
                title="Minimize assistant"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Action Navigation Bar */}
          <div className="px-3 py-2 bg-slate-100/70 border-b border-slate-200/50 flex items-center gap-2 overflow-x-auto text-[11px]">
            <span className="text-slate-400 shrink-0 font-medium">Jump to:</span>
            <button
              type="button"
              onClick={() => { setIsOpen(false); navigate('/report'); }}
              className="px-2.5 py-1 rounded-full bg-white hover:bg-blue-50 text-blue-600 font-semibold border border-slate-200/60 flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
            >
              <FilePlus className="w-3 h-3" />
              <span>Report Issue</span>
            </button>
            <button
              type="button"
              onClick={() => { setIsOpen(false); navigate('/citizen'); }}
              className="px-2.5 py-1 rounded-full bg-white hover:bg-slate-50 text-slate-700 font-medium border border-slate-200/60 flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
            >
              <Compass className="w-3 h-3" />
              <span>Track Reports</span>
            </button>
            <button
              type="button"
              onClick={() => { setIsOpen(false); navigate('/intelligence'); }}
              className="px-2.5 py-1 rounded-full bg-white hover:bg-slate-50 text-purple-700 font-medium border border-purple-200/60 flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              <span>AI GIS Grid</span>
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl shadow-xs ${
                    m.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-xs'
                      : 'bg-white/80 border border-white/90 text-slate-800 rounded-bl-xs backdrop-blur-md'
                  }`}
                >
                  {m.role === 'user' ? (
                    <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                  ) : (
                    renderFormattedText(m.text)
                  )}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">
                  {m.timestamp}
                </span>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start gap-2">
                <div className="p-3.5 rounded-2xl rounded-bl-xs bg-white/80 border border-white/90 backdrop-blur-md flex items-center gap-2 text-slate-500">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]" />
                  </div>
                  <span className="text-xs font-medium">Analyzing civic query...</span>
                </div>
              </div>
            )}

            {/* Quick Suggestion Chips (shown initially or after questions) */}
            {!isLoading && (
              <div className="pt-2 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">
                  Suggested Prompts:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(q)}
                      className="text-left text-[11px] px-2.5 py-1.5 rounded-xl bg-white/70 hover:bg-white text-slate-700 hover:text-blue-600 border border-slate-200/60 shadow-2xs transition-all cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="p-3 bg-white/80 backdrop-blur-xl border-t border-slate-200/60 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask anything about reports, SLAs, or priority..."
              className="flex-1 px-3.5 py-2 text-xs bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-slate-200/80 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-slate-800 placeholder-slate-400 transition-all"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="p-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 transition-all shadow-[0_2px_8px_rgba(37,99,235,0.3)] cursor-pointer shrink-0"
              title="Send message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Launcher Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="glass-panel apple-card-hover rounded-full px-4 py-3 border border-white/90 shadow-[0_8px_30px_rgba(37,99,235,0.25)] flex items-center gap-2.5 backdrop-blur-2xl bg-white/85 text-slate-800 hover:text-blue-600 transition-all cursor-pointer group"
        title={isOpen ? "Close AI Assistant" : "Open CIVICMIND AI Assistant"}
      >
        <div className="relative">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-xs group-hover:scale-110 transition-transform">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-white animate-pulse" />
        </div>

        <div className="text-left hidden sm:block">
          <div className="text-xs font-bold leading-tight flex items-center gap-1">
            <span>AI Assistant</span>
          </div>
          <div className="text-[10px] text-slate-500 leading-none">
            {isOpen ? 'Click to minimize' : 'Ask for help'}
          </div>
        </div>

        {isOpen && (
          <X className="w-4 h-4 text-slate-400 group-hover:text-slate-600 ml-1" />
        )}
      </button>
    </aside>
  );
};
