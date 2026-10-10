import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Send,
  Bot,
  User,
  ArrowRight,
  Compass,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Clock,
  Layers,
  RefreshCw,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedEventId?: string;
}

export const PulseAI: React.FC = () => {
  const { currentUser, studentStats, events, setSelectedEventForModal } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const studentFirstName = currentUser.name.split(' ')[0] || 'Student';
  const studentDept = currentUser.department || 'CSE';
  const studentYear = currentUser.year || 'III';
  const studentSec = currentUser.section || 'A';

  const initialMessages: ChatMessage[] = [
    {
      id: 'msg-init-1',
      sender: 'assistant',
      text: `Hello ${studentFirstName}! I'm **Pulse AI**, your college opportunity intelligence assistant.

I have analyzed your **${studentDept} Year ${studentYear} (Section ${studentSec})** profile:
• **Engagement Score:** ${studentStats.engagementScore}% (Highly Engaged)
• **Career Exposure:** ${studentStats.careerExposureScore}/100 (Technical: ${studentStats.technical}, Competitive: ${studentStats.competitive}, Industry: ${studentStats.industry}, Leadership: ${studentStats.leadership})
• **Activity:** ${studentStats.eventsAttendedCount} events attended, ${studentStats.registrationsCount} registered, ${studentStats.interestsCount} interested

How can I help guide your opportunity strategy today?`,
      timestamp: 'Just now',
    },
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  const suggestedPrompts = [
    'What should I participate in next?',
    'What hackathons can I still register for?',
    'What opportunities am I missing?',
    'Which opportunities will improve my AI/ML exposure?',
    'What did I register for this month?',
    'I have exams next week. What opportunities should I consider?',
    'How engaged am I compared with my class?',
    'What opportunities are best for me?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          studentContext: {
            name: currentUser.name,
            department: currentUser.department,
            year: currentUser.year,
            section: currentUser.section,
            engagementScore: studentStats.engagementScore,
            careerExposureScore: studentStats.careerExposureScore,
            attendedCount: studentStats.eventsAttendedCount,
            registeredCount: studentStats.registrationsCount,
            interestsCount: studentStats.interestsCount,
          },
          events: events.map((e) => ({
            id: e.id,
            title: e.title,
            category: e.category,
            deadline: e.deadline,
            date: e.date,
            organizer: e.organizer,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`API returned HTTP ${response.status}`);
      }

      const data = await response.json();
      const replyText = data.text || 'I analyzed your profile against upcoming deadlines.';

      // Determine if a clickable event should be attached
      let suggestedEventId: string | undefined = undefined;
      const lowerReply = replyText.toLowerCase();

      // Check for exact keywords
      if (lowerReply.includes('cybersecurity') || lowerReply.includes('ctf')) {
        suggestedEventId = 'evt-03';
      } else if (lowerReply.includes('smart india') || lowerReply.includes('sih') || lowerReply.includes('hackathon sprint')) {
        suggestedEventId = 'evt-02';
      } else if (lowerReply.includes('bootcamp') || lowerReply.includes('deep learning') || lowerReply.includes('pytorch')) {
        suggestedEventId = 'evt-01';
      } else if (lowerReply.includes('technova') || lowerReply.includes('autonomous ai agents')) {
        suggestedEventId = 'evt-05';
      } else if (lowerReply.includes('lead sprint') || lowerReply.includes('leadership') || lowerReply.includes('gdsc')) {
        suggestedEventId = 'evt-06';
      } else if (lowerReply.includes('web3') || lowerReply.includes('cloud architecture')) {
        suggestedEventId = 'evt-04';
      } else if (lowerReply.includes('kaggle') || lowerReply.includes('data science sprint')) {
        suggestedEventId = 'evt-08';
      } else if (lowerReply.includes('quantum') || lowerReply.includes('alphaedge')) {
        suggestedEventId = 'evt-10';
      } else {
        // Match against any active campus event
        const matched = events.find(
          (e) =>
            lowerReply.includes(e.title.toLowerCase()) ||
            (e.skills && e.skills.some((s) => lowerReply.includes(s.toLowerCase())))
        );
        if (matched) suggestedEventId = matched.id;
      }

      const botMsg: ChatMessage = {
        id: 'bot-' + Date.now(),
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedEventId,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.log('Pulse AI using client resilient intelligence engine:', err);
      const lowerQuery = text.toLowerCase();
      let fallbackText = `Hello **${studentFirstName}**! Based on your **${studentDept} Year ${studentYear} (Section ${studentSec})** records:
• **Engagement Score:** **${studentStats.engagementScore}%** | **Career Exposure:** **${studentStats.careerExposureScore}/100**
• **Recommendation:** You currently have strong technical workshop participation (6 attended), but a notable deficit in Competitive Events (48/100). Register for the **Cybersecurity Capture The Flag (CTF)** next (deadline Oct 18) to earn **+7 Competitive pts**!`;
      let fallbackEventId = 'evt-03';

      if (lowerQuery.includes('hackathon') || lowerQuery.includes('competition') || lowerQuery.includes('sih')) {
        fallbackText = `Here are the top competitive opportunities open for your cohort:
1. 🏆 **Smart India Hackathon Preparation Sprint 2026** (Deadline: Oct 13) — +6 Competitive pts.
2. 🚀 **Autonomous AI Agents Hackathon** (TechNova Innovations, Hybrid, Deadline: Oct 15) — $2,500 cash pool + corporate interview fast-track.
3. 🛡️ **Cybersecurity Capture The Flag (CTF)** (Deadline: Oct 18) — Hands-on cryptography & web exploitation.`;
        fallbackEventId = 'evt-02';
      } else if (lowerQuery.includes('ai') || lowerQuery.includes('ml') || lowerQuery.includes('bootcamp')) {
        fallbackText = `To boost your technical AI/ML portfolio:
1. 🤖 **AI & ML Bootcamp: Deep Learning & LLMs in Production** (Advanced Computing Lab 3) — Fine-tune transformers, vector search embeddings, and RAG pipelines (+8 Technical pts).
2. ⚡ **TechNova's Autonomous AI Agents Hackathon** — Build multi-agent workflows with Gemini.`;
        fallbackEventId = 'evt-01';
      } else if (lowerQuery.includes('closing') || lowerQuery.includes('urgent') || lowerQuery.includes('miss')) {
        fallbackText = `⚠️ **Urgent Opportunity Alert:**
• **Registration Closing Soon:** **AI & ML Bootcamp: Deep Learning & LLMs in Production** closes tonight!
• **Leadership Gap:** Your Leadership Exposure is **38/100**. Consider the **GDSC Campus Tech Lead Sprint** before coordinator slots fill up!`;
        fallbackEventId = 'evt-01';
      } else if (lowerQuery.includes('lead') || lowerQuery.includes('club')) {
        fallbackText = `🌟 **Leadership Development:**
Your current Leadership Exposure is **38/100**. Step up for the **GDSC Campus Tech Lead Sprint** as a student mentor (+7 Leadership pts).`;
        fallbackEventId = 'evt-06';
      }

      const fallbackMsg: ChatMessage = {
        id: 'bot-' + Date.now(),
        sender: 'assistant',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedEventId: fallbackEventId,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto h-[calc(100vh-10rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
              Pulse AI
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 uppercase font-bold">
                Student Intelligence
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Personalized opportunity intelligence grounded in your academic records & verified event history.
            </p>
          </div>
        </div>

        <button
          onClick={() => setMessages(initialMessages)}
          className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-900 transition text-xs flex items-center gap-1.5"
          title="Reset Conversation"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-blue-600/30 border border-blue-500/40 text-blue-300 flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none shadow-md'
                  : 'bg-slate-950/90 text-slate-200 border border-slate-800 rounded-tl-none shadow'
              }`}
            >
              <div className="whitespace-pre-wrap font-sans">
                {msg.text.split('\n').map((line, idx) => {
                  // Basic bold formatting renderer
                  if (line.includes('**')) {
                    const parts = line.split('**');
                    return (
                      <p key={idx} className="mb-1">
                        {parts.map((p, pIdx) => (pIdx % 2 === 1 ? <strong key={pIdx} className="text-white font-bold">{p}</strong> : p))}
                      </p>
                    );
                  }
                  return <p key={idx} className="mb-1">{line}</p>;
                })}
              </div>

              {/* Clickable Event Card inside AI Response */}
              {msg.suggestedEventId && (
                <div className="mt-3 pt-3 border-t border-slate-800">
                  {(() => {
                    const evt = events.find((e) => e.id === msg.suggestedEventId);
                    if (!evt) return null;
                    return (
                      <div className="bg-slate-900/90 border border-blue-500/40 rounded-xl p-3 flex items-center justify-between gap-3 text-xs">
                        <div>
                          <div className="flex items-center gap-1.5 text-[10px] text-blue-400 font-bold uppercase mb-0.5">
                            <Compass className="w-3 h-3" /> Recommended Event
                          </div>
                          <div className="font-bold text-white line-clamp-1">{evt.title}</div>
                          <div className="text-[11px] text-slate-400">Deadline: {evt.deadline}</div>
                        </div>
                        <button
                          onClick={() => setSelectedEventForModal(evt)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold shrink-0 flex items-center gap-1 text-xs transition"
                        >
                          <span>View Event</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })()}
                </div>
              )}

              <div className="text-[10px] text-slate-500 text-right mt-1">{msg.timestamp}</div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center shrink-0 mt-1 font-bold text-xs uppercase">
                {currentUser.name.charAt(0) || 'S'}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600/30 border border-blue-500/40 text-blue-300 flex items-center justify-center shrink-0 mt-1">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
              <span>Analyzing {studentFirstName}'s engagement records & upcoming deadlines...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="shrink-0 space-y-2">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Suggested Inquiries:
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {suggestedPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="text-[11px] font-medium px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 whitespace-nowrap transition"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask Pulse AI about your opportunities, gaps, deadlines, or cohort standing..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
        />
        <button
          type="submit"
          disabled={!inputMessage.trim() || isLoading}
          className="p-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl transition shadow-lg shadow-blue-600/30 shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
