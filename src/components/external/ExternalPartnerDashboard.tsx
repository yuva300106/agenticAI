import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  PlusCircle,
  FileCheck2,
  Lock,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export const ExternalPartnerDashboard: React.FC = () => {
  const {
    currentUser,
    externalRequests,
    setActiveTab,
    toggleSimulatedExpiry,
  } = useApp();

  const partnerRequests = externalRequests.filter(
    (r) => r.organizationName === (currentUser.organization || 'TechNova Innovations')
  );

  const activeApprovedReq = partnerRequests.find((r) => r.status === 'Approved');
  const isPostingActive = activeApprovedReq && !activeApprovedReq.isExpired;

  return (
    <div className="space-y-6">
      {/* Partner Identity Card */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-cyan-500/20">
              TN
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-black text-white">{currentUser.organization || 'TechNova Innovations'}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Partner
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Organization Type: <strong>Company</strong> • Official Partner ID: <strong>TN-CAMPUS-2026</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('request_permission')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-blue-600/30 flex items-center gap-1.5"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Request New Permission</span>
            </button>
          </div>
        </div>
      </div>

      {/* Temporary Posting Permission Status Banner (HACKATHON STEPS 10-14) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              Temporary Event Posting Access
            </h2>
            <p className="text-xs text-slate-400">
              Institutional governance requires time-bound authorization tokens for external event creation.
            </p>
          </div>

          {activeApprovedReq ? (
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider border flex items-center gap-1.5 ${
                  isPostingActive
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                    : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                }`}
              >
                {isPostingActive ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Posting Access: ACTIVE
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" /> Posting Access: EXPIRED
                  </>
                )}
              </span>

              {/* Demo Toggle to Simulate Expiry */}
              <button
                onClick={() => toggleSimulatedExpiry(activeApprovedReq.id)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700 transition"
                title="Test expiry state for hackathon demo"
              >
                {activeApprovedReq.isExpired ? 'Reset to Active' : 'Simulate Expiry (Demo)'}
              </button>
            </div>
          ) : (
            <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
              Status: Pending Approval
            </span>
          )}
        </div>

        {activeApprovedReq ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850">
              <span className="text-slate-400">Approved Event:</span>
              <div className="font-bold text-white mt-1">{activeApprovedReq.eventTitle}</div>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850">
              <span className="text-slate-400">Authorized Window:</span>
              <div className="font-bold text-slate-200 mt-1">
                {activeApprovedReq.validFrom} – {activeApprovedReq.validUntil}
              </div>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850">
              <span className="text-slate-400">Audience Selected by College:</span>
              <div className="font-bold text-cyan-300 mt-1">
                {activeApprovedReq.targetDepartment} Year {activeApprovedReq.targetYear} (Sec {activeApprovedReq.targetSections})
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-slate-950 rounded-xl text-xs text-slate-400 text-center">
            Your permission request for "Autonomous AI Agents Hackathon" is currently pending review by the Training & Placement Coordinator.
          </div>
        )}

        {/* Action Link */}
        <div className="mt-4 pt-3 flex justify-end">
          <button
            onClick={() => setActiveTab('create_event')}
            className="flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300"
          >
            <span>Proceed to Event Creation Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Security Privacy Notice */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-start gap-3 text-xs text-slate-300">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-white">Student Privacy Safeguard:</span> External organizations are prohibited
          from accessing personally identifiable student records (PII). Student registrations are brokered confidentially
          via CampusPulse institutional tokens.
        </div>
      </div>
    </div>
  );
};
