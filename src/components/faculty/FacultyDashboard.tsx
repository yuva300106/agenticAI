import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  MessageSquareQuote,
  Layers,
  GraduationCap,
} from 'lucide-react';

export const FacultyDashboard: React.FC = () => {
  const { classes, setActiveTab } = useApp();

  const assignedClassesCount = classes.length;
  const avgEngagement = Math.round(
    classes.reduce((sum, c) => sum + c.engagementScore, 0) / classes.length
  );
  const highlyEngagedCount = classes.filter((c) => c.engagementScore >= 70).length;
  const needsAttentionCount = classes.filter((c) => c.engagementScore < 70).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Faculty Engagement Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time cohort opportunity tracking, section participation health, and AI intervention dispatch.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('intelligence')}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-blue-600/25 self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Launch Engagement Agent</span>
        </button>
      </div>

      {/* Top Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="text-xs text-slate-400 mb-1 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-blue-400" /> Assigned Classes
          </div>
          <div className="text-2xl font-black text-white">{assignedClassesCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">CSE Department (Year III)</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="text-xs text-slate-400 mb-1 flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5 text-cyan-400" /> Average Engagement
          </div>
          <div className="text-2xl font-black text-white">{avgEngagement}%</div>
          <div className="text-[11px] text-cyan-400 mt-1">Cohort Aggregate Index</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="text-xs text-slate-400 mb-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Highly Engaged
          </div>
          <div className="text-2xl font-black text-white">{highlyEngagedCount}</div>
          <div className="text-[11px] text-emerald-400 mt-1">&gt; 70% Milestone (CSE-A)</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="text-xs text-slate-400 mb-1 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Needs Attention
          </div>
          <div className="text-2xl font-black text-white">{needsAttentionCount}</div>
          <div className="text-[11px] text-amber-400 mt-1">CSE-B & CSE-C flagged</div>
        </div>
      </div>

      {/* Class Engagement Overview */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-white">Class Engagement Overview</h2>
            <p className="text-xs text-slate-400">Current status across assigned third-year CSE sections</p>
          </div>
          <button
            onClick={() => setActiveTab('intelligence')}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <span>Full Intelligence View</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {classes.map((cls) => {
            const isHigh = cls.engagementScore >= 70;
            const isLow = cls.engagementScore < 50;

            return (
              <div
                key={cls.id}
                className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-base text-white">{cls.name}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-bold border ${
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

                  <div className="text-xs text-slate-400 mb-3 font-medium">
                    Status: <span className="text-slate-200">{cls.status}</span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-400 mb-4 bg-slate-900 p-2.5 rounded-lg border border-slate-850">
                    <div className="flex justify-between">
                      <span>Interest Rate:</span>
                      <span className="text-slate-200 font-medium">{cls.interestRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Registration Rate:</span>
                      <span className="text-slate-200 font-medium">{cls.registrationRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Attendance Rate:</span>
                      <span className="text-slate-200 font-medium">{cls.attendanceRate}%</span>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 flex items-center justify-between pt-2 border-t border-slate-850">
                  <span>Coord: {cls.facultyCoordinator}</span>
                  <button
                    onClick={() => setActiveTab('intelligence')}
                    className="text-blue-400 hover:underline font-semibold"
                  >
                    Manage
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Insights Panel */}
      <div className="bg-gradient-to-br from-blue-950/40 via-slate-900 to-indigo-950/40 border border-blue-500/30 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold text-white">AI Cohort Insights</h2>
          </div>
          <span className="text-xs text-blue-300 font-medium">Updated 10m ago</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-xs">
            <div className="font-bold text-emerald-400 mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> High Performer
            </div>
            <p className="text-slate-300 leading-relaxed">
              "CSE-A shows consistently high participation across technical workshops and hackathon prep sprints. 87%
              engagement leads the entire college."
            </p>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-xs">
            <div className="font-bold text-amber-400 mb-1 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" /> Drop-Off Pattern
            </div>
            <p className="text-slate-300 leading-relaxed">
              "CSE-C has low registration-to-attendance conversion (only 25% attendance despite 41% interest). Additional
              peer encouragement recommended."
            </p>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-xs">
            <div className="font-bold text-cyan-400 mb-1 flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5" /> Event Preference
            </div>
            <p className="text-slate-300 leading-relaxed">
              "Workshop participation is currently 2.8x higher than competition participation across all sections.
              Promote beginner-friendly hackathon tracks."
            </p>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={() => setActiveTab('intelligence')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow"
          >
            Generate Engagement Messages Now
          </button>
        </div>
      </div>
    </div>
  );
};
