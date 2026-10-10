import React from 'react';
import { useApp } from '../../context/AppContext';
import { MessageSquareQuote, CheckCircle2, Clock, Bot, Send } from 'lucide-react';

export const FacultyMessages: React.FC = () => {
  const { classes, setActiveTab } = useApp();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <MessageSquareQuote className="w-5 h-5 text-blue-400" />
            Faculty Communication Dispatches
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            History of AI Engagement Agent messages dispatched to class coordinators.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('intelligence')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow"
        >
          Draft New Intervention
        </button>
      </div>

      <div className="space-y-4">
        {classes.map((cls) => (
          <div
            key={cls.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-850">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base">{cls.name}</span>
                <span className="text-xs text-slate-400">
                  Coordinator: <strong className="text-slate-200">{cls.facultyCoordinator}</strong>
                </span>
              </div>
              <span className="text-xs text-slate-500">
                {cls.messageTimestamp || 'Dispatched via Agent'}
              </span>
            </div>

            {cls.lastMessageSent ? (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
                {cls.lastMessageSent}
              </div>
            ) : (
              <div className="text-xs text-slate-500 italic p-3 bg-slate-950 rounded-xl">
                No intervention dispatched yet this week.
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Recorded in Institutional Audit Trail</span>
              </div>
              <button
                onClick={() => setActiveTab('intelligence')}
                className="text-blue-400 hover:underline font-medium"
              >
                Regenerate Message
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
