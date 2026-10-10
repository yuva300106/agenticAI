import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Flame,
  Clock,
  Calendar,
  CheckCircle2,
  Heart,
  Share2,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Award,
  Layers,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { CampusEvent } from '../../types';

export const StudentHome: React.FC = () => {
  const {
    currentUser,
    events,
    interestedEventIds,
    registeredEventIds,
    studentStats,
    toggleInterest,
    registerForEvent,
    setSelectedEventForModal,
    setActiveTab,
    addToast,
    triggerMissedOpportunityRescue,
  } = useApp();

  const handleShare = (event: CampusEvent) => {
    navigator.clipboard?.writeText(window.location.href);
    addToast(`Link to "${event.title}" copied!`, 'info');
  };

  // Find if student is interested in AI & ML Bootcamp but hasn't registered
  const aiBootcamp = events.find((e) => e.id === 'evt-01');
  const isInterestedInBootcamp = interestedEventIds.includes('evt-01');
  const isRegisteredForBootcamp = registeredEventIds.includes('evt-01');
  const showMissedOpportunityAlert = isInterestedInBootcamp && !isRegisteredForBootcamp;

  // Filter recommended events
  const recommendedEvents = events.filter((e) => e.isRecommended).slice(0, 4);

  // Closing soon events
  const closingSoonEvents = events.filter((e) => e.isClosingSoon);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Good evening, {currentUser.name.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Here are opportunities selected for you based on your academic track and verified skill gaps.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('pulse_ai')}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/25 transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask Pulse AI</span>
          </button>
        </div>
      </div>

      {/* Missed Opportunity Rescue Banner (CRITICAL FOR HACKATHON DEMO STEPS 2-4) */}
      {showMissedOpportunityAlert && aiBootcamp && (
        <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 border-2 border-amber-500/60 rounded-2xl p-5 text-white shadow-2xl relative animate-slide-up">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/40">
                <AlertTriangle className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Missed Opportunity Rescue Agent
                  </span>
                  <span className="text-xs text-amber-400 font-semibold">Registration Closes Soon</span>
                </div>
                <h3 className="text-base font-bold text-white mb-1">
                  ⚠️ You were interested in {aiBootcamp.title}, but you haven't registered yet.
                </h3>
                <p className="text-xs text-slate-300">
                  Registration closes in <strong className="text-amber-300">6 hours</strong> (10 Oct 2026, 06:00 PM). Don't miss it!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
              <button
                onClick={() => setSelectedEventForModal(aiBootcamp)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
              >
                View Details
              </button>
              <button
                onClick={() => registerForEvent(aiBootcamp.id)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition shadow-lg shadow-amber-500/30 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Register Now</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div
          onClick={() => setActiveTab('engagement')}
          className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 rounded-2xl p-4 transition cursor-pointer group hover:border-blue-500/40"
        >
          <div className="text-xs text-slate-400 font-medium mb-1">Engagement Score</div>
          <div className="text-2xl font-black text-white flex items-baseline gap-1">
            <span>{studentStats.engagementScore}%</span>
            <span className="text-[10px] font-bold text-emerald-400">Tier 1</span>
          </div>
          <div className="text-[11px] text-emerald-400/90 mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Highly Engaged
          </div>
        </div>

        <div
          onClick={() => setActiveTab('career_impact')}
          className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 rounded-2xl p-4 transition cursor-pointer group hover:border-purple-500/40"
        >
          <div className="text-xs text-slate-400 font-medium mb-1">Career Exposure</div>
          <div className="text-2xl font-black text-white flex items-baseline gap-1">
            <span>{studentStats.careerExposureScore}</span>
            <span className="text-xs text-slate-400 font-normal">/100</span>
          </div>
          <div className="text-[11px] text-purple-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Tech: 72 • Comp: 48
          </div>
        </div>

        <div
          onClick={() => setActiveTab('my_opportunities')}
          className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 rounded-2xl p-4 transition cursor-pointer group hover:border-cyan-500/40"
        >
          <div className="text-xs text-slate-400 font-medium mb-1">Events Attended</div>
          <div className="text-2xl font-black text-white">
            {studentStats.eventsAttendedCount}
          </div>
          <div className="text-[11px] text-cyan-400 mt-1">Verified on transcript</div>
        </div>

        <div
          onClick={() => setActiveTab('my_opportunities')}
          className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 rounded-2xl p-4 transition cursor-pointer group hover:border-blue-500/40"
        >
          <div className="text-xs text-slate-400 font-medium mb-1">Registrations</div>
          <div className="text-2xl font-black text-white">
            {studentStats.registrationsCount}
          </div>
          <div className="text-[11px] text-blue-400 mt-1">Active commitments</div>
        </div>

        <div
          onClick={() => setActiveTab('my_opportunities')}
          className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 rounded-2xl p-4 transition cursor-pointer group hover:border-rose-500/40 col-span-2 sm:col-span-1"
        >
          <div className="text-xs text-slate-400 font-medium mb-1">Interests Stored</div>
          <div className="text-2xl font-black text-white">
            {studentStats.interestsCount}
          </div>
          <div className="text-[11px] text-rose-400 mt-1">Tracked by Rescue Agent</div>
        </div>
      </div>

      {/* Recommended For You Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              Recommended For You
            </h2>
            <p className="text-xs text-slate-400">
              Matched by Opportunity Matching Agent using your CSE track, attendance history, and skill gaps.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('discover')}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <span>View All ({events.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendedEvents.map((evt) => {
            const isInterested = interestedEventIds.includes(evt.id);
            const isRegistered = registeredEventIds.includes(evt.id);

            return (
              <div
                key={evt.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-blue-950/30 group"
              >
                <div>
                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2 mb-2.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/25">
                      {evt.category}
                    </span>
                    {evt.isInternal ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> INTERNAL
                      </span>
                    ) : evt.isVerifiedExternal ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/25 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> VERIFIED EXTERNAL
                      </span>
                    ) : null}
                    {evt.isClosingSoon && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/25 animate-pulse">
                        CLOSING SOON
                      </span>
                    )}
                  </div>

                  {/* Title & Organizer */}
                  <h3
                    onClick={() => setSelectedEventForModal(evt)}
                    className="text-base font-bold text-white mb-1.5 group-hover:text-blue-300 transition cursor-pointer"
                  >
                    {evt.title}
                  </h3>
                  <div className="text-xs text-slate-400 mb-3 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-500" />
                    <span>{evt.organizer}</span>
                  </div>

                  {/* Why recommended explanation */}
                  {evt.whyRecommended && (
                    <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 mb-4 text-xs text-slate-300">
                      <div className="font-semibold text-blue-400 text-[11px] flex items-center gap-1 mb-0.5">
                        <Sparkles className="w-3 h-3" /> Recommended because:
                      </div>
                      <p className="text-[11px] leading-relaxed text-slate-300">"{evt.whyRecommended}"</p>
                    </div>
                  )}

                  {/* Key metadata */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 mb-4 bg-slate-850 p-2.5 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-blue-400" />
                      <span>{evt.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-amber-300/90 truncate">Closes: {evt.deadline.split(',')[0]}</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-800/80">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setSelectedEventForModal(evt)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => toggleInterest(evt.id)}
                      className={`p-1.5 rounded-xl border transition ${
                        isInterested
                          ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                      title={isInterested ? 'Interested' : 'Mark Interested'}
                    >
                      <Heart className={`w-4 h-4 ${isInterested ? 'fill-rose-400 text-rose-400' : ''}`} />
                    </button>
                    <button
                      onClick={() => handleShare(evt)}
                      className="p-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition"
                      title="Share"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    {isRegistered ? (
                      <span className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Registered
                      </span>
                    ) : (
                      <button
                        onClick={() => registerForEvent(evt.id)}
                        className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/25 transition"
                      >
                        Register
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Agentic Alert & Upcoming Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-2">
        <div className="bg-gradient-to-br from-slate-900 to-blue-950/40 border border-blue-500/30 rounded-2xl p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              Missed Opportunity Intelligence in Action
            </h3>
            <span className="text-[11px] text-blue-300 font-medium">Automatic Safeguard</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            CampusPulse's <strong>Missed Opportunity Rescue Agent</strong> automatically monitors all events you mark as
            <strong> Interested</strong>. If the registration deadline approaches within 24 hours and you haven't registered,
            the system fires high-priority rescue notifications to prevent valuable career exposures from slipping away.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <button
              onClick={() => triggerMissedOpportunityRescue('evt-01')}
              className="px-3.5 py-1.5 bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 border border-blue-500/40 rounded-xl font-semibold transition"
            >
              Simulate Rescue Alert for AI & ML Bootcamp
            </button>
            <button
              onClick={() => setActiveTab('workflow')}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition"
            >
              Inspect Agent Workflow
            </button>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              Next Exposure Growth
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            Your <strong>Leadership Exposure</strong> is currently 38/100.
          </p>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 mb-3">
            <div className="font-semibold text-amber-300 mb-0.5">Recommended Bridge Event:</div>
            <div>GDSC Campus Tech Lead Sprint (Volunteering & Student Mentorship)</div>
          </div>
          <button
            onClick={() => {
              const evt = events.find((e) => e.id === 'evt-06');
              if (evt) setSelectedEventForModal(evt);
            }}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition"
          >
            Explore Leadership Event
          </button>
        </div>
      </div>
    </div>
  );
};
