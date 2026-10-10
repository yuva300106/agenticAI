import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Heart,
  CheckCircle2,
  CalendarCheck,
  AlertOctagon,
  Clock,
  Calendar,
  Building,
  Star,
  MessageSquare,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { FeedbackModal } from '../common/FeedbackModal';
import { CampusEvent } from '../../types';

export const MyOpportunities: React.FC = () => {
  const {
    events,
    interestedEventIds,
    registeredEventIds,
    attendedEventIds,
    feedbackGiven,
    markAttended,
    cancelRegistration,
    setSelectedEventForModal,
    studentStats,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'interested' | 'registered' | 'attended' | 'missed'>(
    'interested'
  );
  const [feedbackEvent, setFeedbackEvent] = useState<CampusEvent | null>(null);

  // Derive sets
  const interestedEvents = events.filter((e) => interestedEventIds.includes(e.id));
  const registeredEvents = events.filter((e) => registeredEventIds.includes(e.id));
  const attendedEvents = events.filter((e) => attendedEventIds.includes(e.id));

  // Seeded missed events (past events where student was interested but deadline elapsed without registration)
  const missedEvents: (CampusEvent & { missedReason: string })[] = [
    {
      id: 'evt-missed-1',
      title: 'DevFest 2026 HackSprint',
      organizer: 'Google Developer Group City Chapter',
      category: 'Hackathon',
      date: '28 Sep 2026',
      time: '09:00 AM',
      deadline: '24 Sep 2026 (Expired)',
      location: 'Virtual',
      mode: 'Online',
      source: 'verified_external',
      isInternal: false,
      isVerifiedExternal: true,
      isRecommended: true,
      isClosingSoon: false,
      targetDepartment: ['CSE', 'IT'],
      targetYear: ['III'],
      targetSections: ['A'],
      skills: ['Flutter', 'Firebase', 'APIs'],
      description: 'Annual flagship regional hackathon with cash prizes and cloud credits.',
      eligibility: 'Undergraduate student developers.',
      registeredCount: 300,
      pointsWeight: { technical: 6, competitive: 7, industry: 5, leadership: 2 },
      missedReason: 'Registration deadline expired before completing team registration form.',
    },
    {
      id: 'evt-missed-2',
      title: 'Introduction to Rust for Systems Engineering',
      organizer: 'College Open Source Society',
      category: 'Workshop',
      date: '15 Sep 2026',
      time: '02:00 PM',
      deadline: '13 Sep 2026 (Expired)',
      location: 'Computing Hall 1',
      mode: 'Offline',
      source: 'internal',
      isInternal: true,
      isVerifiedExternal: false,
      isRecommended: false,
      isClosingSoon: false,
      targetDepartment: ['CSE'],
      targetYear: ['III'],
      targetSections: ['A', 'B'],
      skills: ['Rust', 'Memory Safety', 'Concurrency'],
      description: 'Hands-on intro to ownership, borrow checker, and low-level CLI tooling in Rust.',
      eligibility: 'C/C++ knowledge recommended.',
      registeredCount: 50,
      pointsWeight: { technical: 5, competitive: 1, industry: 3, leadership: 1 },
      missedReason: 'Marked interested, but missed notification before seats filled.',
    },
    {
      id: 'evt-missed-3',
      title: 'Microsoft Azure Cloud Developer Day',
      organizer: 'Microsoft Student Ambassadors',
      category: 'Seminar',
      date: '02 Sep 2026',
      time: '11:00 AM',
      deadline: '31 Aug 2026 (Expired)',
      location: 'Main Auditorium',
      mode: 'Offline',
      source: 'verified_external',
      isInternal: false,
      isVerifiedExternal: true,
      isRecommended: false,
      isClosingSoon: false,
      targetDepartment: ['All'],
      targetYear: ['II', 'III'],
      targetSections: ['All'],
      skills: ['Azure Functions', 'CosmosDB', 'Cloud Architecture'],
      description: 'Keynote and architecture breakdown with Microsoft cloud architects.',
      eligibility: 'All students.',
      registeredCount: 220,
      pointsWeight: { technical: 4, competitive: 1, industry: 6, leadership: 1 },
      missedReason: 'Conflicted with internal midterm examinations.',
    },
    {
      id: 'evt-missed-4',
      title: 'Global Tech Leadership Internship Webinar',
      organizer: 'International Student Exchange Cell',
      category: 'Industry',
      date: '20 Aug 2026',
      time: '06:00 PM',
      deadline: '18 Aug 2026 (Expired)',
      location: 'Zoom Webinar',
      mode: 'Online',
      source: 'verified_external',
      isInternal: false,
      isVerifiedExternal: true,
      isRecommended: false,
      isClosingSoon: false,
      targetDepartment: ['All'],
      targetYear: ['III', 'IV'],
      targetSections: ['All'],
      skills: ['Global Recruiting', 'Resume Crafting', 'Interviewing'],
      description: 'Guidance session on overseas summer research fellowships in Europe.',
      eligibility: 'Pre-final and final year students.',
      registeredCount: 180,
      pointsWeight: { technical: 2, competitive: 1, industry: 6, leadership: 3 },
      missedReason: 'Marked interested; no follow-up reminder was in place (pre-CampusPulse).',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">My Opportunities</h1>
        <p className="text-xs text-slate-400 mt-1">
          Track your complete opportunity lifecycle from initial interest through attendance verification and feedback.
        </p>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
        <button
          onClick={() => setActiveTab('interested')}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition ${
            activeTab === 'interested'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Heart className="w-4 h-4 text-rose-400" />
          <span>Interested ({studentStats.interestsCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('registered')}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition ${
            activeTab === 'registered'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Registered ({studentStats.registrationsCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('attended')}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition ${
            activeTab === 'attended'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <CalendarCheck className="w-4 h-4 text-emerald-400" />
          <span>Attended ({studentStats.eventsAttendedCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('missed')}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition ${
            activeTab === 'missed'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <AlertOctagon className="w-4 h-4 text-amber-400" />
          <span>Missed ({studentStats.missedCount})</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'interested' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              Opportunities you flagged as interesting. Our Rescue Agent monitors deadlines for these.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {interestedEvents.map((evt) => {
              const isRegistered = registeredEventIds.includes(evt.id);
              return (
                <div
                  key={evt.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/15 text-blue-300">
                        {evt.category}
                      </span>
                      {evt.isClosingSoon && (
                        <span className="text-[10px] text-amber-400 font-bold bg-amber-500/15 px-2 py-0.5 rounded-full animate-pulse">
                          Closing Soon
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-white mb-1">{evt.title}</h3>
                    <div className="text-xs text-slate-400 mb-3">{evt.organizer}</div>
                    <div className="text-xs text-slate-300 flex items-center gap-2 mb-4 bg-slate-950 p-2.5 rounded-xl border border-slate-850">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Registration Deadline: {evt.deadline}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                    <button
                      onClick={() => setSelectedEventForModal(evt)}
                      className="text-xs font-semibold text-slate-300 hover:text-white"
                    >
                      View Details
                    </button>
                    {isRegistered ? (
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Registered
                      </span>
                    ) : (
                      <button
                        onClick={() => setSelectedEventForModal(evt)}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow"
                      >
                        Complete Registration
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'registered' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-400">
            You are formally registered for these sessions. Mark attendance once completed to earn exposure points.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {registeredEvents.map((evt) => {
              const isAttended = attendedEventIds.includes(evt.id);
              return (
                <div
                  key={evt.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/15 text-blue-300">
                        {evt.category}
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        Seat Confirmed
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white mb-1">{evt.title}</h3>
                    <div className="text-xs text-slate-400 mb-3">{evt.organizer}</div>
                    <div className="text-xs text-slate-300 grid grid-cols-2 gap-2 mb-4 bg-slate-950 p-2.5 rounded-xl border border-slate-850">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-blue-400" />
                        <span>{evt.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{evt.time}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800 gap-2">
                    <button
                      onClick={() => cancelRegistration(evt.id)}
                      className="text-xs text-rose-400 hover:underline"
                    >
                      Cancel
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedEventForModal(evt)}
                        className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition"
                      >
                        View
                      </button>
                      {isAttended ? (
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 bg-emerald-500/15 px-2.5 py-1.5 rounded-xl border border-emerald-500/30">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Attended
                        </span>
                      ) : (
                        <button
                          onClick={() => markAttended(evt.id)}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow transition"
                        >
                          Mark as Attended
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'attended' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-400">
            Verified completed opportunities recorded on your official engagement profile.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {attendedEvents.map((evt) => {
              const hasFeedback = feedbackGiven[evt.id];
              return (
                <div
                  key={evt.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
                        Verified Attendance
                      </span>
                      <span className="text-xs text-slate-400">{evt.date}</span>
                    </div>
                    <h3 className="text-base font-bold text-white mb-1">{evt.title}</h3>
                    <div className="text-xs text-slate-400 mb-3">{evt.organizer}</div>

                    {hasFeedback ? (
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs mb-3">
                        <div className="flex items-center gap-1 text-amber-400 mb-1">
                          {[...Array(hasFeedback.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                          ))}
                          <span className="text-slate-400 ml-1 text-[11px]">Your Rating</span>
                        </div>
                        <p className="text-slate-300 italic">"{hasFeedback.comment}"</p>
                      </div>
                    ) : (
                      <div className="bg-purple-950/20 border border-purple-500/30 p-2.5 rounded-xl text-xs text-purple-200 mb-3 flex items-center justify-between">
                        <span>Feedback pending (+15% factor)</span>
                        <button
                          onClick={() => setFeedbackEvent(evt)}
                          className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-[11px] font-bold transition"
                        >
                          Give Feedback
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                    <button
                      onClick={() => setSelectedEventForModal(evt)}
                      className="text-xs font-semibold text-slate-300 hover:text-white"
                    >
                      View Details
                    </button>
                    {hasFeedback && (
                      <button
                        onClick={() => setFeedbackEvent(evt)}
                        className="text-xs text-blue-400 hover:underline flex items-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5" /> Edit Feedback
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'missed' && (
        <div className="space-y-4">
          <div className="bg-amber-950/30 border border-amber-500/30 rounded-2xl p-4 text-xs text-amber-200">
            <strong>Historical Opportunity Loss Analysis:</strong> These 4 events represent opportunities you
            indicated interest in earlier this semester but missed due to forgotten deadlines or fragmented group
            chats. CampusPulse's Missed Opportunity Rescue Agent was specifically designed to solve this problem!
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {missedEvents.map((evt) => (
              <div
                key={evt.id}
                className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between opacity-85"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-400">
                      {evt.category}
                    </span>
                    <span className="text-[10px] font-bold text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded-full">
                      Deadline Missed
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-200 mb-1">{evt.title}</h3>
                  <div className="text-xs text-slate-500 mb-3">{evt.organizer}</div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-850 text-xs text-slate-400 mb-3">
                    <span className="text-amber-400 font-medium">Why it was missed: </span>
                    {evt.missedReason}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-500">
                  <span>Expired {evt.date}</span>
                  <span className="text-blue-400">Safeguarded in current version</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {feedbackEvent && (
        <FeedbackModal event={feedbackEvent} onClose={() => setFeedbackEvent(null)} />
      )}
    </div>
  );
};
