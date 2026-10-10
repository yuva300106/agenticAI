import React from 'react';
import { X, Calculator, Check, ArrowRight } from 'lucide-react';

interface FormulaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FormulaModal: React.FC<FormulaModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-xl w-full p-6 text-white shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight text-white">How Engagement is Calculated</h3>
            <p className="text-xs text-slate-400">Deterministic, transparent institutional scoring formula</p>
          </div>
        </div>

        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 mb-5">
          <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">Core Formula</div>
          <div className="text-sm font-mono text-slate-200 bg-slate-900/90 p-3 rounded-lg border border-slate-800">
            Score = (Interest × 20%) + (Registration × 25%) + (Attendance × 40%) + (Feedback × 15%)
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/50">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Student Interest</span>
              <span className="font-bold text-amber-400">20% Weight</span>
            </div>
            <p className="text-xs text-slate-300">
              Captures awareness, curiosity, and intent to explore college opportunities.
            </p>
          </div>

          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/50">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Event Registration</span>
              <span className="font-bold text-cyan-400">25% Weight</span>
            </div>
            <p className="text-xs text-slate-300">
              Formal commitment to attend and participate in the scheduled session.
            </p>
          </div>

          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/50">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Verified Attendance</span>
              <span className="font-bold text-emerald-400">40% Weight</span>
            </div>
            <p className="text-xs text-slate-300">
              Highest weighted factor. Represents actual physical or online presence and completion.
            </p>
          </div>

          <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/50">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Student Feedback</span>
              <span className="font-bold text-purple-400">15% Weight</span>
            </div>
            <p className="text-xs text-slate-300">
              Qualitative reflection, rating, and feedback loop post-event completion.
            </p>
          </div>
        </div>

        <div className="bg-blue-950/30 border border-blue-900/50 rounded-xl p-3.5 text-xs text-slate-300 flex items-start gap-2.5">
          <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
            <Check className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-semibold text-blue-300">Institutional Governance Rule:</span> The AI Engagement Agent
            explains patterns and drafts faculty messages, but does not manipulate or invent the raw numeric score.
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
