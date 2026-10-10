import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  ArrowRight,
  ArrowDown,
  Cpu,
  ShieldCheck,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  UserCheck,
  Building,
  GraduationCap,
  TrendingUp,
} from 'lucide-react';

export const AgentWorkflowVisualizer: React.FC = () => {
  const [activeLoop, setActiveLoop] = useState<'student' | 'faculty' | 'external'>('student');
  const [selectedAgent, setSelectedAgent] = useState<string>('matching');

  const agentsInfo: Record<
    string,
    { name: string; purpose: string; input: string; decision: string; action: string; icon: any; color: string }
  > = {
    matching: {
      name: 'Opportunity Matching Agent',
      purpose: 'Connects each student to high-impact campus & verified external opportunities.',
      input: 'Student profile (Dept CSE, Year III) + attendance history + current verified event stream',
      decision: 'Determine skill gaps (e.g. low competitive score) and high-affinity topics (AI/ML)',
      action: 'Generates personalized "Recommended For You" cards with explainable reasoning tags',
      icon: Sparkles,
      color: 'from-blue-500 to-indigo-600',
    },
    rescue: {
      name: 'Missed Opportunity Rescue Agent',
      purpose: 'Safeguards students against missing critical registration deadlines.',
      input: 'Student interest flag (interested = true) + registration status (registered = false) + countdown clock (< 24h)',
      decision: 'Evaluate whether deadline window is dangerously closing soon',
      action: 'Dispatches contextual countdown alerts with direct "Register Now" quick conversion button',
      icon: AlertTriangle,
      color: 'from-amber-500 to-orange-600',
    },
    engagement: {
      name: 'Engagement Intelligence Agent',
      purpose: 'Analyzes student & class-level participation health deterministically.',
      input: 'Aggregated raw metrics: Interest (20%), Registration (25%), Attendance (40%), Feedback (15%)',
      decision: 'Classify cohort standing (>70% Highly Engaged, 50-70% Needs Improvement, <50% Low Engagement)',
      action: 'Updates institutional dashboard and identifies classes requiring proactive encouragement',
      icon: TrendingUp,
      color: 'from-emerald-500 to-teal-600',
    },
    faculty_comm: {
      name: 'Faculty Communication Agent',
      purpose: 'Synthesizes professional, supportive communications for faculty coordinators.',
      input: 'Section variance metrics (CSE-C at 29% vs CSE-A at 87%) + recommended student opportunities',
      decision: 'Select appropriate communication tone (constructive guidance vs celebratory milestone)',
      action: 'Drafts actionable AI engagement message with relevant opportunities and logs dispatch',
      icon: UserCheck,
      color: 'from-purple-500 to-pink-600',
    },
    external_gov: {
      name: 'External Verification Agent',
      purpose: 'Enforces strict college governance and prevents unrestricted outside spam.',
      input: 'Corporate partner credential submission + target college authority + audience parameters',
      decision: 'Verify company standing and administer time-bound temporary posting authorization',
      action: 'Enforces posting window expiry and restricts audience targeting strictly to college criteria',
      icon: ShieldCheck,
      color: 'from-cyan-500 to-blue-600',
    },
    career_insight: {
      name: 'Career Insight Agent',
      purpose: 'Evaluates portfolio balance across technical, competitive, industry, and leadership exposure.',
      input: 'Verified completed attendance ledger across the semester',
      decision: 'Pinpoint exposure deficits (e.g. Leadership at 38/100 despite high Technical at 72/100)',
      action: 'Formulates strategic next-best-opportunity improvement roadmap',
      icon: Cpu,
      color: 'from-violet-500 to-purple-600',
    },
  };

  const currentAgent = agentsInfo[selectedAgent] || agentsInfo.matching;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" /> Agentic Architecture
          </span>
          <span className="text-xs text-slate-400">CampusPulse Autonomous Intelligence Loops</span>
        </div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">How CampusPulse Thinks</h1>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          Unlike ordinary event listing websites, CampusPulse is an active multi-agent system.
          Click between the loops and inspect agent decision pathways below.
        </p>
      </div>

      {/* Loop Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => {
            setActiveLoop('student');
            setSelectedAgent('matching');
          }}
          className={`p-4 rounded-2xl border text-left transition ${
            activeLoop === 'student'
              ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-950/40'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-850'
          }`}
        >
          <div className="flex items-center gap-2 font-bold text-sm mb-1">
            <GraduationCap className="w-4 h-4 text-blue-400" />
            <span>1. Student Opportunity Loop</span>
          </div>
          <p className="text-xs text-slate-400">
            Event Ingestion → Match → Interest → Rescue → Register → Attend → Career Growth
          </p>
        </button>

        <button
          onClick={() => {
            setActiveLoop('faculty');
            setSelectedAgent('engagement');
          }}
          className={`p-4 rounded-2xl border text-left transition ${
            activeLoop === 'faculty'
              ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-lg shadow-emerald-950/40'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-850'
          }`}
        >
          <div className="flex items-center gap-2 font-bold text-sm mb-1">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>2. Faculty Governance Loop</span>
          </div>
          <p className="text-xs text-slate-400">
            Cohort Data → Variance Analysis → Faculty Message Agent → Coordinator Guidance
          </p>
        </button>

        <button
          onClick={() => {
            setActiveLoop('external');
            setSelectedAgent('external_gov');
          }}
          className={`p-4 rounded-2xl border text-left transition ${
            activeLoop === 'external'
              ? 'bg-cyan-600/20 border-cyan-500 text-white shadow-lg shadow-cyan-950/40'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-850'
          }`}
        >
          <div className="flex items-center gap-2 font-bold text-sm mb-1">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>3. Partner Verification Loop</span>
          </div>
          <p className="text-xs text-slate-400">
            Partner Request → Authority Review → Time-Bound Posting Access → Expiry Enforcement
          </p>
        </button>
      </div>

      {/* Interactive Loop Flow Diagram */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center justify-between">
          <span>Active Loop Pipeline Visualization</span>
          <span className="text-xs text-slate-400 font-normal">Click any agent node to inspect its specification</span>
        </h3>

        {activeLoop === 'student' && (
          <div className="flex flex-col lg:flex-row items-center justify-between gap-3 overflow-x-auto pb-4">
            {/* Step 1 */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-center min-w-[140px]">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Input</div>
              <div className="text-xs font-bold text-white mt-1">New Event Ingested</div>
            </div>

            <ArrowRight className="w-4 h-4 text-slate-600 hidden lg:block" />
            <ArrowDown className="w-4 h-4 text-slate-600 lg:hidden" />

            {/* Matching Agent */}
            <button
              onClick={() => setSelectedAgent('matching')}
              className={`p-3.5 rounded-xl border text-center min-w-[160px] transition ${
                selectedAgent === 'matching'
                  ? 'bg-blue-600/30 border-blue-500 text-white ring-2 ring-blue-500/50'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="text-[10px] font-bold text-blue-400 uppercase flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3" /> Agent 1
              </div>
              <div className="text-xs font-bold mt-1">Opportunity Matcher</div>
            </button>

            <ArrowRight className="w-4 h-4 text-slate-600 hidden lg:block" />
            <ArrowDown className="w-4 h-4 text-slate-600 lg:hidden" />

            {/* Interest Check */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-center min-w-[130px]">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Student Action</div>
              <div className="text-xs font-bold text-rose-300 mt-1">Click "Interested"</div>
            </div>

            <ArrowRight className="w-4 h-4 text-slate-600 hidden lg:block" />
            <ArrowDown className="w-4 h-4 text-slate-600 lg:hidden" />

            {/* Rescue Agent */}
            <button
              onClick={() => setSelectedAgent('rescue')}
              className={`p-3.5 rounded-xl border text-center min-w-[160px] transition ${
                selectedAgent === 'rescue'
                  ? 'bg-amber-600/30 border-amber-500 text-white ring-2 ring-amber-500/50'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="text-[10px] font-bold text-amber-400 uppercase flex items-center justify-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Agent 2
              </div>
              <div className="text-xs font-bold mt-1">Opportunity Rescue</div>
            </button>

            <ArrowRight className="w-4 h-4 text-slate-600 hidden lg:block" />
            <ArrowDown className="w-4 h-4 text-slate-600 lg:hidden" />

            {/* Registration */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-center min-w-[130px]">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Conversion</div>
              <div className="text-xs font-bold text-emerald-300 mt-1">Registered & Attended</div>
            </div>

            <ArrowRight className="w-4 h-4 text-slate-600 hidden lg:block" />
            <ArrowDown className="w-4 h-4 text-slate-600 lg:hidden" />

            {/* Career Insight Agent */}
            <button
              onClick={() => setSelectedAgent('career_insight')}
              className={`p-3.5 rounded-xl border text-center min-w-[160px] transition ${
                selectedAgent === 'career_insight'
                  ? 'bg-purple-600/30 border-purple-500 text-white ring-2 ring-purple-500/50'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="text-[10px] font-bold text-purple-400 uppercase flex items-center justify-center gap-1">
                <Cpu className="w-3 h-3" /> Agent 6
              </div>
              <div className="text-xs font-bold mt-1">Career Insight Agent</div>
            </button>
          </div>
        )}

        {activeLoop === 'faculty' && (
          <div className="flex flex-col lg:flex-row items-center justify-between gap-3 overflow-x-auto pb-4">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-center min-w-[160px]">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Input</div>
              <div className="text-xs font-bold text-white mt-1">Class Attendance Logs</div>
            </div>

            <ArrowRight className="w-4 h-4 text-slate-600 hidden lg:block" />

            <button
              onClick={() => setSelectedAgent('engagement')}
              className={`p-3.5 rounded-xl border text-center min-w-[180px] transition ${
                selectedAgent === 'engagement'
                  ? 'bg-emerald-600/30 border-emerald-500 text-white ring-2 ring-emerald-500/50'
                  : 'bg-slate-950 border-slate-800 text-slate-300'
              }`}
            >
              <div className="text-[10px] font-bold text-emerald-400 uppercase flex items-center justify-center gap-1">
                <TrendingUp className="w-3 h-3" /> Agent 3
              </div>
              <div className="text-xs font-bold mt-1">Engagement Intelligence</div>
            </button>

            <ArrowRight className="w-4 h-4 text-slate-600 hidden lg:block" />

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-center min-w-[160px]">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Variance Detected</div>
              <div className="text-xs font-bold text-amber-300 mt-1">CSE-C (29% Low)</div>
            </div>

            <ArrowRight className="w-4 h-4 text-slate-600 hidden lg:block" />

            <button
              onClick={() => setSelectedAgent('faculty_comm')}
              className={`p-3.5 rounded-xl border text-center min-w-[180px] transition ${
                selectedAgent === 'faculty_comm'
                  ? 'bg-purple-600/30 border-purple-500 text-white ring-2 ring-purple-500/50'
                  : 'bg-slate-950 border-slate-800 text-slate-300'
              }`}
            >
              <div className="text-[10px] font-bold text-purple-400 uppercase flex items-center justify-center gap-1">
                <UserCheck className="w-3 h-3" /> Agent 4
              </div>
              <div className="text-xs font-bold mt-1">Faculty Comm. Agent</div>
            </button>

            <ArrowRight className="w-4 h-4 text-slate-600 hidden lg:block" />

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-center min-w-[160px]">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Outcome</div>
              <div className="text-xs font-bold text-emerald-300 mt-1">Constructive Guidance</div>
            </div>
          </div>
        )}

        {activeLoop === 'external' && (
          <div className="flex flex-col lg:flex-row items-center justify-between gap-3 overflow-x-auto pb-4">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-center min-w-[160px]">
              <div className="text-[10px] font-bold text-slate-400 uppercase">External Intake</div>
              <div className="text-xs font-bold text-white mt-1">TechNova Request</div>
            </div>

            <ArrowRight className="w-4 h-4 text-slate-600 hidden lg:block" />

            <button
              onClick={() => setSelectedAgent('external_gov')}
              className={`p-3.5 rounded-xl border text-center min-w-[180px] transition ${
                selectedAgent === 'external_gov'
                  ? 'bg-cyan-600/30 border-cyan-500 text-white ring-2 ring-cyan-500/50'
                  : 'bg-slate-950 border-slate-800 text-slate-300'
              }`}
            >
              <div className="text-[10px] font-bold text-cyan-400 uppercase flex items-center justify-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Agent 5
              </div>
              <div className="text-xs font-bold mt-1">Verification Agent</div>
            </button>

            <ArrowRight className="w-4 h-4 text-slate-600 hidden lg:block" />

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-center min-w-[160px]">
              <div className="text-[10px] font-bold text-slate-400 uppercase">College Authority</div>
              <div className="text-xs font-bold text-cyan-300 mt-1">T&P Cell Approval</div>
            </div>

            <ArrowRight className="w-4 h-4 text-slate-600 hidden lg:block" />

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-center min-w-[160px]">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Temporary Token</div>
              <div className="text-xs font-bold text-emerald-300 mt-1">Valid 1-15 Oct</div>
            </div>

            <ArrowRight className="w-4 h-4 text-slate-600 hidden lg:block" />

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-center min-w-[160px]">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Governance Gate</div>
              <div className="text-xs font-bold text-amber-300 mt-1">Automatic Expiry</div>
            </div>
          </div>
        )}
      </div>

      {/* Agent Detail Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
            <currentAgent.icon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{currentAgent.name}</h2>
            <p className="text-xs text-slate-400">{currentAgent.purpose}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
            <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wider mb-1">Input Stream</div>
            <div className="text-xs text-slate-200 leading-relaxed">{currentAgent.input}</div>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
            <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-1">Decision Engine</div>
            <div className="text-xs text-slate-200 leading-relaxed">{currentAgent.decision}</div>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
            <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1">Autonomous Action</div>
            <div className="text-xs text-slate-200 leading-relaxed">{currentAgent.action}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
