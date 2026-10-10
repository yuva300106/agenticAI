import React from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, Users, Clock, ShieldCheck, PlusCircle } from 'lucide-react';

export const ExternalMyEvents: React.FC = () => {
  const { events, setActiveTab } = useApp();

  const partnerEvents = events.filter((e) => e.isVerifiedExternal);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">My Approved Posted Events</h1>
          <p className="text-xs text-slate-400 mt-1">
            Events approved by college authorities and currently visible to targeted student cohorts.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('create_event')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Event</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {partnerEvents.map((evt) => (
          <div key={evt.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/15 text-blue-300">
                {evt.category}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> College Approved
              </span>
            </div>

            <h3 className="font-bold text-white text-base">{evt.title}</h3>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 bg-slate-950 p-2.5 rounded-xl border border-slate-850">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                <span>{evt.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                <span>{evt.registeredCount} / {evt.maxSeats} Registered</span>
              </div>
            </div>

            <div className="text-[11px] text-cyan-300 bg-cyan-950/20 border border-cyan-500/20 p-2 rounded-lg">
              {evt.eligibility}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
