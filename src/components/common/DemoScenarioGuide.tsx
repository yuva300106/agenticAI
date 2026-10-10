import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Compass,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Clock,
  Play,
  RotateCcw,
} from 'lucide-react';

export const DemoScenarioGuide: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const {
    switchUserRole,
    setActiveTab,
    toggleInterest,
    registerForEvent,
    triggerMissedOpportunityRescue,
    approveExternalRequest,
    toggleSimulatedExpiry,
    externalRequests,
    addToast,
  } = useApp();

  const steps = [
    {
      num: 1,
      title: 'Login as Student',
      role: 'student',
      tab: 'home',
      desc: 'View Aarav Sharma personalized opportunity dashboard & exposure metrics.',
      action: () => {
        switchUserRole('student');
        setActiveTab('home');
      },
    },
    {
      num: 2,
      title: 'Click Interested on AI & ML Bootcamp',
      role: 'student',
      tab: 'home',
      desc: 'Indicate student interest without registering yet.',
      action: () => {
        switchUserRole('student');
        setActiveTab('home');
        toggleInterest('evt-01');
      },
    },
    {
      num: 3,
      title: 'Trigger Missed Opportunity Rescue',
      role: 'student',
      tab: 'home',
      desc: 'Missed Opportunity Rescue Agent fires countdown banner for interested event.',
      action: () => {
        switchUserRole('student');
        setActiveTab('home');
        triggerMissedOpportunityRescue('evt-01');
      },
    },
    {
      num: 4,
      title: 'Click "Register Now"',
      role: 'student',
      tab: 'home',
      desc: 'Converts interest into registration: "You\'re registered for AI & ML Bootcamp 🎉"',
      action: () => {
        switchUserRole('student');
        setActiveTab('home');
        registerForEvent('evt-01');
      },
    },
    {
      num: 5,
      title: 'Open My Engagement (78%)',
      role: 'student',
      tab: 'engagement',
      desc: 'View deterministic 78% engagement score and trend visualization.',
      action: () => {
        switchUserRole('student');
        setActiveTab('engagement');
      },
    },
    {
      num: 6,
      title: 'Open Career Impact (64/100)',
      role: 'student',
      tab: 'career_impact',
      desc: 'Review Career Exposure breakdown (Tech 72, Comp 48, Ind 61, Lead 38) & AI insight.',
      action: () => {
        switchUserRole('student');
        setActiveTab('career_impact');
      },
    },
    {
      num: 7,
      title: 'Open Pulse AI Assistant',
      role: 'student',
      tab: 'pulse_ai',
      desc: 'Ask "What should I participate in next?" for profile-grounded reasoning.',
      action: () => {
        switchUserRole('student');
        setActiveTab('pulse_ai');
      },
    },
    {
      num: 8,
      title: 'Switch to Faculty: Engagement Intelligence',
      role: 'faculty',
      tab: 'intelligence',
      desc: 'View institutional class metrics: CSE-A 87%, CSE-B 54%, CSE-C 29%.',
      action: () => {
        switchUserRole('faculty');
        setActiveTab('intelligence');
      },
    },
    {
      num: 9,
      title: 'Generate & Send AI Message for CSE-C',
      role: 'faculty',
      tab: 'intelligence',
      desc: 'AI generates constructive encouragement message, sends to coordinator, logs action.',
      action: () => {
        switchUserRole('faculty');
        setActiveTab('intelligence');
      },
    },
    {
      num: 10,
      title: 'Switch to External Partner: TechNova',
      role: 'external_partner',
      tab: 'partner_dashboard',
      desc: 'Verified Partner gateway. Request permission from Training & Placement Coordinator.',
      action: () => {
        switchUserRole('external_partner');
        setActiveTab('request_permission');
      },
    },
    {
      num: 11,
      title: 'Switch to Admin: Approve Request',
      role: 'admin',
      tab: 'admin_requests',
      desc: 'Admin grants temporary posting access (valid 1 Oct to 15 Oct).',
      action: () => {
        switchUserRole('admin');
        setActiveTab('admin_requests');
        approveExternalRequest('req-technova-01');
      },
    },
    {
      num: 12,
      title: 'External Partner: Create Approved Event',
      role: 'external_partner',
      tab: 'create_event',
      desc: 'TechNova publishes "Autonomous AI Agents Hackathon" with college-selected audience.',
      action: () => {
        switchUserRole('external_partner');
        setActiveTab('create_event');
      },
    },
    {
      num: 13,
      title: 'Verify Event in Student Discovery',
      role: 'student',
      tab: 'discover',
      desc: 'Vetted external event is instantly visible to approved student cohort.',
      action: () => {
        switchUserRole('student');
        setActiveTab('discover');
      },
    },
    {
      num: 14,
      title: 'Demonstrate Permission Expiry',
      role: 'external_partner',
      tab: 'create_event',
      desc: 'Simulate expired posting window: creation is blocked with formal notice.',
      action: () => {
        switchUserRole('external_partner');
        toggleSimulatedExpiry('req-technova-01');
        setActiveTab('create_event');
      },
    },
  ];

  const handleExecuteStep = (stepObj: typeof steps[0]) => {
    setCurrentStep(stepObj.num);
    stepObj.action();
    addToast(`Executing Demo Step ${stepObj.num}: ${stepObj.title}`, 'info');
  };

  return (
    <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border-b border-blue-500/30 text-white transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-300 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5" /> Hackathon Live Demo Tour
            </span>
            <span className="hidden sm:inline-block text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-200 border border-blue-500/30 font-medium">
              Step {currentStep} of 14
            </span>
          </div>
          <span className="hidden md:inline text-xs text-slate-300 font-medium truncate max-w-sm">
            : {steps[currentStep - 1]?.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick next / prev buttons */}
          <button
            onClick={() => {
              const next = currentStep < 14 ? currentStep + 1 : 1;
              handleExecuteStep(steps[next - 1]);
            }}
            className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow transition"
          >
            <span>Next Step ({currentStep < 14 ? currentStep + 1 : 1})</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition"
          >
            <span>{isOpen ? 'Collapse' : 'All 14 Steps'}</span>
            {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expanded drawer showing all 14 steps */}
      {isOpen && (
        <div className="max-w-7xl mx-auto px-4 py-3 border-t border-slate-800/80 bg-slate-950/70 backdrop-blur-md">
          <div className="text-xs text-slate-400 mb-2 font-medium">
            Jump to any exact live demo scenario required by the hackathon brief:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {steps.map((s) => (
              <button
                key={s.num}
                onClick={() => handleExecuteStep(s)}
                className={`text-left p-2.5 rounded-xl border text-xs transition flex flex-col justify-between ${
                  currentStep === s.num
                    ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-900/30 ring-1 ring-blue-500'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                      currentStep === s.num
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    STEP {s.num}
                  </span>
                  <span className="text-[10px] uppercase font-semibold text-slate-400">
                    {s.role.replace('_', ' ')}
                  </span>
                </div>
                <div className="font-semibold text-slate-200 mb-0.5 line-clamp-1">{s.title}</div>
                <div className="text-[11px] text-slate-400 line-clamp-1">{s.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
