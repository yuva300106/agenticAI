import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Clock,
  ShieldCheck,
  Building2,
  UserCheck,
  AlertTriangle,
  LogOut,
  RefreshCw,
  Mail,
  Building,
  CheckCircle2,
  XCircle,
  ExternalLink,
} from 'lucide-react';

export const PendingApprovalView: React.FC = () => {
  const { currentUser, signOutUser, refreshProfile, addToast, switchUserRole, setActiveTab } = useApp();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshProfile();
      addToast('Status refreshed from database.', 'info');
    } catch {
      addToast('Could not refresh status.', 'error');
    } finally {
      setIsRefreshing(false);
    }
  };

  const isRejected = currentUser.status === 'rejected';
  const isFaculty = currentUser.role === 'faculty';
  const isPartner = currentUser.role === 'external_partner';

  return (
    <div className="min-h-screen bg-[#070b14] text-white flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-xl w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 backdrop-blur-xl">
        {/* Top Icon Badge */}
        <div className="flex items-center justify-center mb-6">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
              isRejected
                ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                : 'bg-amber-500/15 text-amber-400 border border-amber-500/30 animate-pulse'
            }`}
          >
            {isRejected ? (
              <XCircle className="w-8 h-8" />
            ) : isFaculty ? (
              <UserCheck className="w-8 h-8" />
            ) : (
              <Building2 className="w-8 h-8" />
            )}
          </div>
        </div>

        {/* Heading */}
        <div className="text-center space-y-2 mb-6">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
              isRejected
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>
              {isRejected
                ? 'Access Request Declined'
                : isFaculty
                ? 'Faculty Verification Pending'
                : 'Organization Verification Pending'}
            </span>
          </span>

          <h2 className="text-2xl font-black text-white">
            {isRejected
              ? 'Institutional Access Not Approved'
              : 'Awaiting Administrator Approval'}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
            {isRejected
              ? `Your registration request was reviewed and could not be approved at this time.`
              : isFaculty
              ? `Your Faculty / Club Coordinator account request has been registered and is pending approval from the Head of Department (HOD) or Campus Administrator.`
              : `Your external organization profile has been submitted and is pending verification by the College Placement & Administration Office.`}
          </p>
        </div>

        {/* Rejection reason callout if rejected */}
        {isRejected && currentUser.rejectionReason && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-200 text-xs flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-rose-300 mb-0.5">Administrator Note:</div>
              <p>{currentUser.rejectionReason}</p>
            </div>
          </div>
        )}

        {/* Request details summary card */}
        <div className="bg-slate-950/80 rounded-2xl border border-slate-800 p-4 space-y-3 mb-6 text-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-850 flex items-center justify-between">
            <span>Submitted Profile Details</span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                isRejected ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
              }`}
            >
              {currentUser.status?.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-slate-300">
            <div>
              <span className="text-slate-500 block text-[10px]">Registered Name</span>
              <strong className="text-white">{currentUser.name}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Official Email</span>
              <strong className="text-white truncate block">{currentUser.email}</strong>
            </div>

            {isFaculty ? (
              <>
                <div>
                  <span className="text-slate-500 block text-[10px]">Department</span>
                  <span className="text-blue-300 font-semibold">{currentUser.department || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Assigned Section / Club</span>
                  <span className="text-emerald-300 font-semibold">{currentUser.assignedSection || 'N/A'}</span>
                </div>
              </>
            ) : (
              <>
                <div>
                  <span className="text-slate-500 block text-[10px]">Organization</span>
                  <span className="text-blue-300 font-semibold">{currentUser.organization || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Organization Type</span>
                  <span className="text-emerald-300 font-semibold">{currentUser.orgType || 'Company'}</span>
                </div>
              </>
            )}
          </div>

          {!isRejected && (
            <div className="pt-2 border-t border-slate-850 text-[11px] text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>
                Row Level Security (RLS) protects institutional data until approval is granted.
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {!isRejected && (
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Checking Status...' : 'Check Approval Status'}</span>
            </button>
          )}

          <div className="flex gap-2">
            <button
              onClick={signOutUser}
              className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>

            <button
              onClick={() => {
                switchUserRole('admin');
                setActiveTab('admin_access_requests');
              }}
              className="flex-1 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              title="Quickly test the Admin approval flow in demo mode"
            >
              <span>Test Admin Approval</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
