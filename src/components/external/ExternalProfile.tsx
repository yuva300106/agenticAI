import React from 'react';
import { useApp } from '../../context/AppContext';
import { Building2, ShieldCheck, Mail, Phone, Globe, MapPin, CheckCircle2 } from 'lucide-react';

export const ExternalProfile: React.FC = () => {
  const { currentUser } = useApp();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-cyan-600/30">
          TN
        </div>
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-white">TechNova Innovations</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified College Partner
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Autonomous Software Agents & Enterprise AI Solutions • Bangalore, India
          </p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider text-xs">Partner Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850">
            <span className="text-slate-500 block mb-0.5">Primary Contact:</span>
            <strong>Vikram Mehta (Director of Campus Alliances)</strong>
          </div>
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850">
            <span className="text-slate-500 block mb-0.5">Official Partnership Email:</span>
            <strong>partnerships@technova.io</strong>
          </div>
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850">
            <span className="text-slate-500 block mb-0.5">Corporate Website:</span>
            <strong className="text-blue-400">https://technova.io</strong>
          </div>
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850">
            <span className="text-slate-500 block mb-0.5">College Verification Level:</span>
            <strong className="text-emerald-400">Tier-1 Corporate Recruiting Sponsor</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
