import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  Award,
  Sparkles,
  Info,
  Calendar,
  CheckCircle2,
  Heart,
  Clock,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { FormulaModal } from '../common/FormulaModal';

export const StudentEngagement: React.FC = () => {
  const { studentStats, currentUser } = useApp();
  const [isFormulaOpen, setIsFormulaOpen] = useState(false);

  // Month-by-month participation trend over the semester
  const semesterTrend = [
    { month: 'Jun', attended: 1, registered: 2, score: 45 },
    { month: 'Jul', attended: 2, registered: 3, score: 58 },
    { month: 'Aug', attended: 3, registered: 4, score: 68 },
    { month: 'Sep', attended: 4, registered: 4, score: 75 },
    { month: 'Oct (Current)', attended: 2, registered: 3, score: 78 },
  ];

  // Category distribution
  const categoriesBreakdown = [
    { name: 'Workshops', count: 6, max: 8, color: 'bg-blue-500', text: 'text-blue-400' },
    { name: 'Club Events', count: 5, max: 8, color: 'bg-cyan-500', text: 'text-cyan-400' },
    { name: 'Seminars', count: 4, max: 8, color: 'bg-emerald-500', text: 'text-emerald-400' },
    { name: 'Hackathons', count: 3, max: 8, color: 'bg-purple-500', text: 'text-purple-400' },
    { name: 'Competitions', count: 2, max: 8, color: 'bg-amber-500', text: 'text-amber-400' },
    { name: 'Internships', count: 1, max: 4, color: 'bg-rose-500', text: 'text-rose-400' },
  ];

  const getStatusBadge = (score: number) => {
    if (score > 70) {
      return {
        label: 'Highly Engaged',
        color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
        desc: '> 70% Milestone: Top 15% in cohort',
      };
    } else if (score >= 50) {
      return {
        label: 'Engaged — Room to Improve',
        color: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
        desc: '50–70% Target Band',
      };
    } else {
      return {
        label: 'Low Engagement',
        color: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
        desc: '< 50%: Institutional support flagged',
      };
    }
  };

  const status = getStatusBadge(studentStats.engagementScore);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Your CampusPulse Profile</h1>
          <p className="text-xs text-slate-400 mt-1">
            Institutional Engagement Index tracking overall attendance conversion and qualitative contributions.
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

      {/* Main Score Hero Card */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Circular Gauge Representation */}
          <div className="flex items-center gap-5">
            <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-slate-800"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-emerald-400"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - studentStats.engagementScore / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-white">{studentStats.engagementScore}%</span>
                <span className="text-[10px] font-semibold text-slate-400">INDEX</span>
              </div>
            </div>

            <div>
              <div className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold border ${status.color} mb-1.5`}>
                {status.label}
              </div>
              <div className="text-xs text-slate-400 font-medium">{status.desc}</div>
              <div className="text-[11px] text-slate-500 mt-1">Section CSE-A Average: 87%</div>
            </div>
          </div>

          {/* Threshold Legend */}
          <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 text-xs">
            <div className="font-semibold text-slate-300 text-[11px] uppercase tracking-wider mb-2">
              Cohort Classification Thresholds
            </div>
            <div className="flex items-center justify-between text-emerald-400 font-medium">
              <span>&gt; 70%</span>
              <span className="text-slate-300">Highly Engaged (Tier 1)</span>
            </div>
            <div className="flex items-center justify-between text-amber-400 font-medium">
              <span>50% – 70%</span>
              <span className="text-slate-300">Engaged — Room to Improve</span>
            </div>
            <div className="flex items-center justify-between text-rose-400 font-medium">
              <span>&lt; 50%</span>
              <span className="text-slate-300">Low Engagement (Intervention)</span>
            </div>
          </div>

          {/* AI-Generated Insight Box */}
          <div className="bg-blue-950/30 border border-blue-500/30 p-4 rounded-xl text-xs text-slate-200">
            <div className="flex items-center gap-1.5 font-bold text-blue-300 text-[11px] uppercase tracking-wider mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>AI Engagement Synthesis</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-300">
              "Your participation shows strong technical engagement, especially in AI/ML and workshops. Your next
              growth opportunity is leadership and competitive events."
            </p>
          </div>
        </div>
      </div>

      {/* Numerical Metrics Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <div className="text-xs text-slate-400 mb-1">Events Interested In</div>
          <div className="text-xl font-bold text-white">{studentStats.interestsCount}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">20% Weight Factor</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <div className="text-xs text-slate-400 mb-1">Events Registered</div>
          <div className="text-xl font-bold text-white">{studentStats.registrationsCount}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">25% Weight Factor</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <div className="text-xs text-slate-400 mb-1">Events Attended</div>
          <div className="text-xl font-bold text-white">{studentStats.eventsAttendedCount}</div>
          <div className="text-[10px] text-emerald-400 mt-0.5">40% Weight Factor (Highest)</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <div className="text-xs text-slate-400 mb-1">Feedback Given</div>
          <div className="text-xl font-bold text-white">1</div>
          <div className="text-[10px] text-purple-400 mt-0.5">15% Weight Factor</div>
        </div>
      </div>

      {/* Two Column Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Semester Participation Trend Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Participation Trend Over Semester
              </h3>
              <p className="text-[11px] text-slate-400">Monthly progression of verified event participation</p>
            </div>
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-0.5">
              +33% Growth <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* SVG Bar Chart Visualization */}
          <div className="h-52 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-slate-800">
            {semesterTrend.map((item, idx) => {
              const heightPercent = (item.score / 100) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="text-[10px] font-bold text-slate-400 group-hover:text-emerald-400 transition">
                    {item.score}%
                  </div>
                  <div className="w-full max-w-[42px] bg-slate-800 rounded-t-lg relative flex flex-col justify-end overflow-hidden h-full">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full bg-gradient-to-t from-emerald-600 to-teal-400 rounded-t-lg transition-all duration-500 group-hover:brightness-125"
                    />
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium text-center truncate w-full">
                    {item.month}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-3">
            <span>Baseline: Jun 2026 (45%)</span>
            <span>Current: Oct 2026 (78% Tier 1)</span>
          </div>
        </div>

        {/* Category Distribution Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-400" />
                Category Distribution
              </h3>
              <p className="text-[11px] text-slate-400">Total events attended and registered by domain</p>
            </div>
            <span className="text-xs text-slate-400">Total: 21</span>
          </div>

          <div className="space-y-3.5">
            {categoriesBreakdown.map((cat) => {
              const fillPct = (cat.count / cat.max) * 100;
              return (
                <div key={cat.name}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">{cat.name}</span>
                    <span className={`font-bold ${cat.text}`}>{cat.count} events</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      style={{ width: `${fillPct}%` }}
                      className={`h-full ${cat.color} rounded-full transition-all duration-500`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
            <span>Primary Focus: <strong>Technical Workshops (6)</strong></span>
            <span className="text-amber-400">Opportunity Gap: <strong>Competitions (2)</strong></span>
          </div>
        </div>
      </div>

      {/* Formula Modal */}
      <FormulaModal isOpen={isFormulaOpen} onClose={() => setIsFormulaOpen(false)} />
    </div>
  );
};
