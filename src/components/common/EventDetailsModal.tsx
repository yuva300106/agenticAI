import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Heart,
  Share2,
  Sparkles,
  Building,
  Users,
  ShieldCheck,
  Award,
} from 'lucide-react';

export const EventDetailsModal: React.FC = () => {
  const {
    selectedEventForModal,
    setSelectedEventForModal,
    interestedEventIds,
    registeredEventIds,
    toggleInterest,
    registerForEvent,
    cancelRegistration,
    addToast,
  } = useApp();

  if (!selectedEventForModal) return null;

  const event = selectedEventForModal;
  const isInterested = interestedEventIds.includes(event.id);
  const isRegistered = registeredEventIds.includes(event.id);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    addToast('Opportunity link copied to clipboard!', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full p-6 text-white shadow-2xl relative my-8">
        <button
          onClick={() => setSelectedEventForModal(null)}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            {event.category}
          </span>
          {event.isInternal ? (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> INTERNAL
            </span>
          ) : event.isVerifiedExternal ? (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> VERIFIED EXTERNAL
            </span>
          ) : null}
          {event.isClosingSoon && (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
              CLOSING SOON
            </span>
          )}
          {event.isRecommended && (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> RECOMMENDED
            </span>
          )}
        </div>

        <h2 className="text-2xl font-bold text-white mb-2 leading-tight">{event.title}</h2>

        <div className="flex items-center gap-2 text-sm text-slate-300 mb-5">
          <Building className="w-4 h-4 text-slate-400 shrink-0" />
          <span>Organized by <strong className="text-white">{event.organizer}</strong></span>
        </div>

        {/* AI Match Reason Banner */}
        {event.whyRecommended && (
          <div className="bg-gradient-to-r from-blue-950/60 to-indigo-950/60 border border-blue-500/40 rounded-xl p-3.5 mb-5 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-blue-300 uppercase tracking-wider mb-0.5">
                Why this is recommended for you
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">{event.whyRecommended}</p>
            </div>
          </div>
        )}

        {/* Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/40">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
              <Calendar className="w-3.5 h-3.5 text-blue-400" /> Date
            </div>
            <div className="text-sm font-semibold text-white">{event.date}</div>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/40">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" /> Deadline
            </div>
            <div className="text-sm font-semibold text-amber-300">{event.deadline}</div>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/40 col-span-2 sm:col-span-1">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Venue / Mode
            </div>
            <div className="text-sm font-semibold text-white truncate" title={event.location}>
              {event.location}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Description</h4>
          <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-3.5 rounded-xl border border-slate-800">
            {event.description}
          </p>
        </div>

        {/* Target Audience & Eligibility */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/40">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-cyan-400" /> Target Audience
            </div>
            <div className="text-xs text-slate-300">
              {event.eligibility}
            </div>
          </div>

          <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/40">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-purple-400" /> Career Exposure Gain
            </div>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {event.pointsWeight.technical > 0 && (
                <span className="text-[11px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-medium">
                  Technical +{event.pointsWeight.technical}
                </span>
              )}
              {event.pointsWeight.competitive > 0 && (
                <span className="text-[11px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-medium">
                  Competitive +{event.pointsWeight.competitive}
                </span>
              )}
              {event.pointsWeight.leadership > 0 && (
                <span className="text-[11px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-medium">
                  Leadership +{event.pointsWeight.leadership}
                </span>
              )}
              {event.pointsWeight.industry > 0 && (
                <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-medium">
                  Industry +{event.pointsWeight.industry}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Skills Tag */}
        <div className="mb-6">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Skills Covered</div>
          <div className="flex flex-wrap gap-1.5">
            {event.skills.map((skill, idx) => (
              <span
                key={idx}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Actions Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleInterest(event.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold border transition ${
                isInterested
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${isInterested ? 'fill-rose-400 text-rose-400' : ''}`} />
              {isInterested ? 'Interested' : 'Mark Interested'}
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition"
              title="Share event link"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {isRegistered ? (
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-2 rounded-xl border border-emerald-500/30">
                  <CheckCircle2 className="w-4 h-4" /> Registered
                </span>
                <button
                  onClick={() => cancelRegistration(event.id)}
                  className="px-3 py-2 text-xs text-rose-400 hover:text-rose-300 hover:underline transition"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => registerForEvent(event.id)}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-600/30 transition flex items-center gap-2"
              >
                Register Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
