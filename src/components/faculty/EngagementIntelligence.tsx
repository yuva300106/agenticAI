import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  Sparkles,
  Info,
  Send,
  CheckCircle2,
  AlertTriangle,
  Bot,
  Layers,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  RefreshCw,
  Clock,
} from 'lucide-react';
import { FormulaModal } from '../common/FormulaModal';
import { ClassEngagement } from '../../types';

export const EngagementIntelligence: React.FC = () => {
  const { classes, sendFacultyMessage, addToast } = useApp();

  const [selectedClassId, setSelectedClassId] = useState<string>('cls-cse-c');
  const [isFormulaOpen, setIsFormulaOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState<string>('');
  const [isSent, setIsSent] = useState(false);
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('CSE');
  const [selectedYearFilter, setSelectedYearFilter] = useState('III');

  const selectedClass = classes.find((c) => c.id === selectedClassId) || classes[0];

  const handleGenerateAIMessage = async (cls: ClassEngagement) => {
    setIsGenerating(true);
    setIsSent(false);

    try {
      const response = await fetch('/api/gemini/faculty-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          className: cls.name,
          score: cls.engagementScore,
          status: cls.status,
          attendanceRate: cls.attendanceRate,
          topOpportunities: 'AI & ML Practical Bootcamp, Smart India Hackathon Sprint, Industry Tech Talk',
        }),
      });

      const data = await response.json();
      setGeneratedMessage(data.message);
      addToast(`AI Message generated for ${cls.name}`, 'info');
    } catch (e) {
      // Fallback
      if (cls.engagementScore < 50) {
        setGeneratedMessage(
          `📢 Student Engagement Attention Required — ${cls.name}\n\n${cls.name} currently has ${cls.engagementScore}% engagement, which indicates that additional encouragement may be helpful.\n\nWe request your support in guiding students and encouraging greater participation in upcoming opportunities.\n\nCampusPulse has identified several relevant opportunities that may be useful for your students:\n• Hands-on AI & ML Practical Bootcamp\n• Beginner-friendly Smart India Hackathon Orientation\n• Industry Tech Speaker Session (Virtual)`
        );
      } else {
        setGeneratedMessage(
          `🎉 Excellent Student Engagement — ${cls.name}\n\nYour students demonstrated ${cls.engagementScore}% engagement across recent opportunities.\n\nThank you for encouraging participation and helping students make the most of campus opportunities.\n\nKeep up the great work!`
        );
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendMessage = () => {
    if (!generatedMessage) return;
    sendFacultyMessage(selectedClass.id, generatedMessage);
    setIsSent(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Engagement Intelligence
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase font-bold">
              Institutional AI
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Comparative section engagement analytics and AI Faculty Engagement Agent intervention portal.
          </p>
        </div>

        <button
          onClick={() => setIsFormulaOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold border border-slate-800 transition self-start sm:self-auto"
        >
          <Info className="w-3.5 h-3.5 text-blue-400" />
          <span>How is this calculated?</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Department:</span>
            <select
              value={selectedDeptFilter}
              onChange={(e) => setSelectedDeptFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1 text-xs"
            >
              <option value="CSE">CSE</option>
              <option value="IT">IT</option>
              <option value="ECE">ECE</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Year:</span>
            <select
              value={selectedYearFilter}
              onChange={(e) => setSelectedYearFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1 text-xs"
            >
              <option value="III">III Year</option>
              <option value="II">II Year</option>
              <option value="IV">IV Year</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-400">
          Evaluated against <strong>3 active sections</strong> (203 students total)
        </div>
      </div>

      {/* Class Comparison Cards & Chart */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {classes.map((cls) => {
          const isSelected = selectedClassId === cls.id;
          const isHigh = cls.engagementScore >= 70;
          const isLow = cls.engagementScore < 50;

          return (
            <div
              key={cls.id}
              onClick={() => {
                setSelectedClassId(cls.id);
                setGeneratedMessage('');
                setIsSent(false);
              }}
              className={`p-5 rounded-2xl border transition-all cursor-pointer relative ${
                isSelected
                  ? 'bg-slate-900 border-blue-500 shadow-xl shadow-blue-950/30 ring-1 ring-blue-500'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg text-white">{cls.name}</span>
                  <span className="text-xs text-slate-400">({cls.studentCount} students)</span>
                </div>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-black border ${
                    isHigh
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      : isLow
                      ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                      : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                  }`}
                >
                  {cls.engagementScore}%
                </span>
              </div>

              <div className="text-xs text-slate-300 font-semibold mb-3">
                {cls.status}
              </div>

              {/* Progress bar visual */}
              <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden mb-4 border border-slate-800">
                <div
                  style={{ width: `${cls.engagementScore}%` }}
                  className={`h-full rounded-full transition-all duration-500 ${
                    isHigh ? 'bg-emerald-500' : isLow ? 'bg-rose-500' : 'bg-amber-500'
                  }`}
                />
              </div>

              {/* 4 Factor Micro Grid */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 mb-3 bg-slate-950/60 p-2.5 rounded-xl border border-slate-850">
                <div>Interest (20%): <strong className="text-slate-200">{cls.interestRate}%</strong></div>
                <div>Register (25%): <strong className="text-slate-200">{cls.registrationRate}%</strong></div>
                <div>Attendance (40%): <strong className="text-slate-200">{cls.attendanceRate}%</strong></div>
                <div>Feedback (15%): <strong className="text-slate-200">{cls.feedbackRate}%</strong></div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                <span className="truncate">Coord: {cls.facultyCoordinator}</span>
                {cls.lastMessageSent && (
                  <span className="text-emerald-400 font-medium">✓ Message Sent</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* AI FACULTY ENGAGEMENT AGENT WORKFLOW (HACKATHON STEP 9) */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border-2 border-indigo-500/40 rounded-2xl p-6 shadow-2xl relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center border border-indigo-500/30">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                Autonomous Intervention Agent
              </div>
              <h2 className="text-lg font-bold text-white">
                AI Faculty Engagement Agent: {selectedClass.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleGenerateAIMessage(selectedClass)}
              disabled={isGenerating}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-indigo-600/30"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isGenerating ? 'Synthesizing...' : `Generate AI Message for ${selectedClass.name}`}</span>
            </button>
          </div>
        </div>

        {/* Message preview area */}
        {generatedMessage ? (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2 pb-2 border-b border-slate-850">
                <span className="font-semibold text-indigo-300 flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5 text-indigo-400" />
                  Generated Professional Communication
                </span>
                <span className="text-[11px] text-slate-500">
                  Target: {selectedClass.facultyCoordinator} ({selectedClass.name})
                </span>
              </div>
              <div className="whitespace-pre-wrap text-xs sm:text-sm text-slate-200 font-sans leading-relaxed">
                {generatedMessage}
              </div>
            </div>

            {/* Action buttons & status check */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-4 text-xs">
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> AI message generated
                </span>
                {isSent ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Sent to faculty coordinator
                  </span>
                ) : (
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Ready for coordinator dispatch
                  </span>
                )}
                {isSent && (
                  <span className="text-blue-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Action logged
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleGenerateAIMessage(selectedClass)}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
                >
                  Regenerate
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={isSent}
                  className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold transition shadow ${
                    isSent
                      ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 cursor-default'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSent ? 'Dispatched to Faculty' : 'Send to Faculty Coordinator'}</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-950/60 border border-dashed border-slate-800 rounded-xl p-8 text-center text-slate-400 space-y-2">
            <p className="text-xs max-w-md mx-auto">
              Select a class above and click <strong>"Generate AI Message"</strong> to let the Engagement Agent
              synthesize an institutional communication tailored to their participation metrics.
            </p>
            <div className="text-[11px] text-slate-500">
              Recommended for demo: Test <strong>CSE-C (29% Low Engagement)</strong> to view constructive guidance, or <strong>CSE-A (87%)</strong> to view celebratory recognition.
            </div>
          </div>
        )}
      </div>

      {/* Formula Modal */}
      <FormulaModal isOpen={isFormulaOpen} onClose={() => setIsFormulaOpen(false)} />
    </div>
  );
};
