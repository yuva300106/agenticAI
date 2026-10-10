import React from 'react';
import { Building2, ShieldCheck, CheckCircle2, Clock, ExternalLink } from 'lucide-react';

export const AdminPartners: React.FC = () => {
  const partners = [
    {
      name: 'TechNova Innovations',
      type: 'Company',
      status: 'Verified Partner',
      email: 'partnerships@technova.io',
      activeEvents: 1,
      totalHosted: 4,
      since: 'Jan 2025',
    },
    {
      name: 'AlphaEdge Capital Partners',
      type: 'Finance & Tech Firm',
      status: 'Verified Partner',
      email: 'recruiting@alphaedge.com',
      activeEvents: 1,
      totalHosted: 2,
      since: 'Aug 2025',
    },
    {
      name: 'NullChapter Security Guild',
      type: 'Community Organization',
      status: 'Verified Partner',
      email: 'team@nullchapter.org',
      activeEvents: 1,
      totalHosted: 5,
      since: 'Nov 2024',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Verified External Partner Directory</h1>
        <p className="text-xs text-slate-400 mt-1">
          Registered external companies, non-profits, and communities authorized to submit college opportunity requests.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {partners.map((p, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> {p.status}
              </span>
            </div>

            <div>
              <h3 className="font-bold text-white text-base">{p.name}</h3>
              <p className="text-xs text-slate-400">{p.type} • {p.email}</p>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 text-xs text-slate-300 flex justify-between">
              <span>Active Events: <strong className="text-white">{p.activeEvents}</strong></span>
              <span>Total Hosted: <strong className="text-white">{p.totalHosted}</strong></span>
            </div>

            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800 flex justify-between items-center">
              <span>Partner since {p.since}</span>
              <span className="text-emerald-400 font-semibold">Active Standing</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
