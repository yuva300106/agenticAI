import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  Award,
  Sparkles,
  Info,
  ShieldCheck,
  ArrowRight,
  Code2,
  Trophy,
  Briefcase,
  Users,
  Compass,
  CheckCircle2,
} from 'lucide-react';

export const CareerImpact: React.FC = () => {
  const { studentStats, events, setSelectedEventForModal } = useApp();
  const [showLogicModal, setShowLogicModal] = useState(false);

  const roadmapItems = [
    {
      title: 'GDSC Campus Tech Lead Sprint',
      category: 'Club Event & Leadership',
      expectedArea: 'Leadership Exposure (+7 pts)',
      eventId: 'evt-06',
      whyItMatters:
        'Your Leadership Exposure is currently your lowest dimension (38/100). Taking up student coordinator roles demonstrates soft skills and cross-functional project management.',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    },
    {
      title: 'Cybersecurity Capture The Flag (CTF)',
      category: 'Competition',
      expectedArea: 'Competitive Experience (+7 pts)',
      eventId: 'evt-03',
      whyItMatters:
        'You have attended 6 workshops but only 2 competitions. Competitive coding & CTFs benchmark your skills against national peers under real-time constraints.',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    {
      title: 'Autonomous AI Agents Hackathon',
      category: 'Verified Partner Hackathon',
      expectedArea: 'Industry Exposure (+7 pts)',
      eventId: 'evt-05',
      whyItMatters:
        'Direct corporate partnership with TechNova Innovations. Fast-tracks pre-placement interviews and exposes you to production multi-agent deployment.',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Career Exposure Score</h1>
          <p className="text-xs text-slate-400 mt-1">
            How your extracurricular and technical participation is shaping your professional profile readiness.
          </p>
        </div>

        <button
          onClick={() => setShowLogicModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold border border-slate-800 transition self-start sm:self-auto"
        >
          <Info className="w-3.5 h-3.5 text-blue-400" />
          <span>Scoring Logic & Weights</span>
        </button>
      </div>

      {/* Main Score & Breakdown Grid */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950/30 to-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">
              Overall Opportunity Impact
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black text-white">
                {studentStats.careerExposureScore}
              </span>
              <span className="text-slate-400 text-lg font-bold">/100</span>
              <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Well-Rounded Profile
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1.5 max-w-lg">
              Calculated across 4 core exposure pillars: Technical Mastery, Competitive Stamina, Industry Alignment,
              and Student Leadership.
            </p>
          </div>

          {/* AI Synthesis Callout */}
          <div className="bg-slate-950/80 border border-blue-500/40 p-4 rounded-xl max-w-md text-xs text-slate-300 relative">
            <div className="flex items-center gap-1.5 text-blue-400 font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Career Insight Agent</span>
            </div>
            <p className="leading-relaxed">
              "You have strong technical exposure (72/100) through workshops and projects, but comparatively lower
              leadership exposure (38/100). Participating in a club-organized event or taking a coordination role could
              strengthen this area."
            </p>
          </div>
        </div>

        {/* 4 Pillars Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          {/* Technical Exposure */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="flex items-center gap-1.5 text-blue-400 font-bold">
                <Code2 className="w-4 h-4" /> Technical Exposure
              </span>
              <span className="text-sm font-black text-white">{studentStats.technical}/100</span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden mb-2">
              <div
                style={{ width: `${studentStats.technical}%` }}
                className="h-full bg-blue-500 rounded-full"
              />
            </div>
            <div className="text-[11px] text-slate-400">
              Strongest pillar. 6 workshops in deep learning, distributed systems, and PyTorch.
            </div>
          </div>

          {/* Competitive Experience */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Trophy className="w-4 h-4" /> Competitive Exp.
              </span>
              <span className="text-sm font-black text-white">{studentStats.competitive}/100</span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden mb-2">
              <div
                style={{ width: `${studentStats.competitive}%` }}
                className="h-full bg-amber-500 rounded-full"
              />
            </div>
            <div className="text-[11px] text-slate-400">
              Needs momentum. Participated in 2 competitive events this semester.
            </div>
          </div>

          {/* Industry Exposure */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <Briefcase className="w-4 h-4" /> Industry Exposure
              </span>
              <span className="text-sm font-black text-white">{studentStats.industry}/100</span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden mb-2">
              <div
                style={{ width: `${studentStats.industry}%` }}
                className="h-full bg-emerald-500 rounded-full"
              />
            </div>
            <div className="text-[11px] text-slate-400">
              Solid foundation. Attended senior Google Cloud architect session and FinTech talk.
            </div>
          </div>

          {/* Leadership Exposure */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="flex items-center gap-1.5 text-purple-400 font-bold">
                <Users className="w-4 h-4" /> Leadership Exposure
              </span>
              <span className="text-sm font-black text-white">{studentStats.leadership}/100</span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden mb-2">
              <div
                style={{ width: `${studentStats.leadership}%` }}
                className="h-full bg-purple-500 rounded-full"
              />
            </div>
            <div className="text-[11px] text-slate-400">
              Prime growth area. Student coordinator and peer mentoring roles recommended.
            </div>
          </div>
        </div>
      </div>

      {/* Improvement Roadmap */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-blue-400" />
              Strategic Improvement Roadmap
            </h2>
            <p className="text-xs text-slate-400">
              Targeted opportunities that close your specific exposure gaps before graduation placement season.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {roadmapItems.map((item, idx) => {
            const matchedEvt = events.find((e) => e.id === item.eventId);
            return (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${item.badgeColor}`}>
                      {item.expectedArea}
                    </span>
                    <span className="text-[10px] text-slate-400">{item.category}</span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>

                  <div className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800 mb-4 leading-relaxed">
                    <div className="font-semibold text-slate-400 text-[11px] uppercase tracking-wider mb-1">
                      Why it matters for you
                    </div>
                    {item.whyItMatters}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800">
                  <button
                    onClick={() => {
                      if (matchedEvt) setSelectedEventForModal(matchedEvt);
                    }}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow"
                  >
                    <span>View Opportunity Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scoring Logic Modal */}
      {showLogicModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 text-white shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-2">Transparent Exposure Scoring Rules</h3>
            <p className="text-xs text-slate-400 mb-4">
              Career Exposure scores are derived through deterministic event point weights, not subjective estimations:
            </p>

            <div className="space-y-2.5 text-xs text-slate-300 mb-6">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span>Technical Workshop Attended</span>
                <span className="font-bold text-blue-400">+4 to +8 points (Technical)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span>Hackathon Participation</span>
                <span className="font-bold text-amber-400">+6 to +8 points (Competitive)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span>Coding Competition / CTF</span>
                <span className="font-bold text-amber-400">+5 to +7 points (Competitive)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span>Industry Session / Tech Talk</span>
                <span className="font-bold text-emerald-400">+4 to +8 points (Industry)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span>Leadership / Organizing / Volunteering</span>
                <span className="font-bold text-purple-400">+7 to +8 points (Leadership)</span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowLogicModal(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
