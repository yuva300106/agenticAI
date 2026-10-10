import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  PlusCircle,
  Clock,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Building,
  Calendar,
  MapPin,
  ShieldCheck,
  Send,
  Users,
} from 'lucide-react';

export const ExternalCreateEvent: React.FC = () => {
  const {
    currentUser,
    externalRequests,
    createExternalEvent,
    toggleSimulatedExpiry,
    setActiveTab,
  } = useApp();

  const partnerReq = externalRequests.find(
    (r) => r.organizationName === (currentUser.organization || 'TechNova Innovations') && r.status === 'Approved'
  );

  const isExpired = partnerReq?.isExpired ?? false;
  const isApproved = partnerReq?.status === 'Approved';

  const [eventData, setEventData] = useState({
    title: partnerReq?.eventTitle || 'Autonomous AI Agents Hackathon: Multi-Agent Systems',
    date: partnerReq?.eventDate || '24 Oct 2026',
    time: '08:00 AM - 08:00 PM',
    deadline: partnerReq?.registrationDeadline || '22 Oct 2026',
    location: 'TechNova Campus Hub & Virtual Portal',
    mode: 'Hybrid' as const,
    category: partnerReq?.eventCategory || 'Hackathon',
    maxSeats: 80,
    skills: 'LangGraph, Multi-Agent Systems, PyTorch, Tool Calling',
    description:
      partnerReq?.eventDescription ||
      'Build autonomous software workflows utilizing multi-agent coordination. Top 3 teams win pre-placement interview fast-tracks and cash prizes worth ₹1,50,000.',
  });

  const [isCreated, setIsCreated] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerReq) return;

    const success = createExternalEvent(
      {
        title: eventData.title,
        date: eventData.date,
        time: eventData.time,
        deadline: eventData.deadline,
        location: eventData.location,
        mode: eventData.mode,
        category: eventData.category,
        maxSeats: Number(eventData.maxSeats),
        skills: eventData.skills.split(',').map((s) => s.trim()),
        description: eventData.description,
      },
      partnerReq.id
    );

    if (success) {
      setIsCreated(true);
    }
  };

  if (!isApproved) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-3">
        <Lock className="w-10 h-10 text-amber-400 mx-auto" />
        <h2 className="text-lg font-bold text-white">Posting Authorization Required</h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          You currently do not have an approved permission grant from college authorities. Please submit a permission
          request first.
        </p>
        <button
          onClick={() => setActiveTab('request_permission')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition"
        >
          Submit Permission Request
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Create Approved Event</h1>
        <p className="text-xs text-slate-400 mt-1">
          Publish your vetted event under the college's approved authorization window.
        </p>
      </div>

      {/* Permission Window Status Bar (HACKATHON STEPS 12 & 14) */}
      <div
        className={`p-4 rounded-2xl border transition-all ${
          isExpired
            ? 'bg-rose-950/40 border-rose-500/60 text-rose-200'
            : 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {isExpired ? (
              <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/30">
                <Lock className="w-5 h-5" />
              </div>
            ) : (
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            )}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider">
                {isExpired ? 'Posting Access: EXPIRED' : 'Posting Access: ACTIVE'}
              </div>
              <div className="text-[11px] text-slate-300">
                Window: <strong>{partnerReq.validFrom} – {partnerReq.validUntil}</strong>
              </div>
            </div>
          </div>

          <button
            onClick={() => toggleSimulatedExpiry(partnerReq.id)}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-lg text-xs font-semibold border border-slate-750 transition self-start sm:self-auto"
          >
            {isExpired ? 'Toggle Active State' : 'Simulate Expiry (Step 14)'}
          </button>
        </div>

        {/* Expired alert message required by prompt */}
        {isExpired && (
          <div className="mt-3 pt-3 border-t border-rose-900/60 text-xs font-medium text-rose-300">
            ⚠️ Posting access has expired for this event. You may submit a new permission request for another opportunity.
          </div>
        )}
      </div>

      {/* College Audience Control Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2.5">
          <Users className="w-4 h-4 text-cyan-400 shrink-0" />
          <div>
            <span className="font-bold text-white">Audience selected by College: </span>
            <span className="text-cyan-300 font-semibold">
              Department: {partnerReq.targetDepartment}, Year: {partnerReq.targetYear}, Sections: {partnerReq.targetSections}
            </span>
          </div>
        </div>
        <span className="text-[11px] text-slate-400 hidden sm:inline">Authority Controlled</span>
      </div>

      {isCreated ? (
        <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-8 text-center space-y-3 animate-fade-in">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Event Published Successfully!</h2>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            "{eventData.title}" is now published and visible to the approved student audience in Discover Opportunities.
          </p>
          <div className="pt-2 flex justify-center gap-2">
            <button
              onClick={() => setActiveTab('discover')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition"
            >
              Verify in Student Catalog (Step 13)
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <fieldset disabled={isExpired} className={isExpired ? 'opacity-50 pointer-events-none' : ''}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Event Title</label>
                <input
                  type="text"
                  value={eventData.title}
                  onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Event Date</label>
                <input
                  type="text"
                  value={eventData.date}
                  onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Registration Deadline</label>
                <input
                  type="text"
                  value={eventData.deadline}
                  onChange={(e) => setEventData({ ...eventData, deadline: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Venue / Mode</label>
                <input
                  type="text"
                  value={eventData.location}
                  onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Max Student Seats</label>
                <input
                  type="number"
                  value={eventData.maxSeats}
                  onChange={(e) => setEventData({ ...eventData, maxSeats: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Skills Covered (comma separated)</label>
                <input
                  type="text"
                  value={eventData.skills}
                  onChange={(e) => setEventData({ ...eventData, skills: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Description</label>
                <textarea
                  rows={3}
                  value={eventData.description}
                  onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                  required
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={isExpired}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-blue-600/30 flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Publish Approved Event</span>
              </button>
            </div>
          </fieldset>
        </form>
      )}
    </div>
  );
};
