import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  UserCheck,
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  Users,
  Search,
  Filter,
  BadgeAlert,
  Send,
} from 'lucide-react';
import { FacultyAccessRequest, OrganizationAccessRequest } from '../../types';

export const AdminAccessRequests: React.FC = () => {
  const {
    currentUser,
    pendingFacultyRequests,
    pendingOrgRequests,
    approveFacultyAccess,
    rejectFacultyAccess,
    approveOrgAccess,
    rejectOrgAccess,
    addToast,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'faculty' | 'organizations'>('faculty');
  const [rejectingFacultyId, setRejectingFacultyId] = useState<string | null>(null);
  const [rejectingOrgId, setRejectingOrgId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  // Security guard check
  const isAdmin = currentUser.role === 'admin';

  if (!isAdmin) {
    return (
      <div className="p-8 text-center bg-slate-900 border border-rose-500/30 rounded-2xl">
        <AlertTriangle className="w-12 h-12 text-rose-400 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-white">Access Denied: Admin Authorization Required</h2>
        <p className="text-xs text-slate-400 mt-2">
          Only authorized institutional administrators can approve user privileges or grant coordinator roles.
        </p>
      </div>
    );
  }

  const handleApproveFaculty = async (id: string) => {
    setIsProcessing(id);
    try {
      await approveFacultyAccess(id);
    } finally {
      setIsProcessing(null);
    }
  };

  const handleRejectFaculty = async (id: string) => {
    if (!rejectionReason.trim()) {
      addToast('Please provide a reason for declining the request.', 'warning');
      return;
    }
    setIsProcessing(id);
    try {
      await rejectFacultyAccess(id, rejectionReason);
      setRejectingFacultyId(null);
      setRejectionReason('');
    } finally {
      setIsProcessing(null);
    }
  };

  const handleApproveOrg = async (id: string) => {
    setIsProcessing(id);
    try {
      await approveOrgAccess(id);
    } finally {
      setIsProcessing(null);
    }
  };

  const handleRejectOrg = async (id: string) => {
    if (!rejectionReason.trim()) {
      addToast('Please provide a reason for declining the organization.', 'warning');
      return;
    }
    setIsProcessing(id);
    try {
      await rejectOrgAccess(id, rejectionReason);
      setRejectingOrgId(null);
      setRejectionReason('');
    } finally {
      setIsProcessing(null);
    }
  };

  const pendingFacCount = pendingFacultyRequests.filter((r) => r.status === 'pending').length;
  const pendingOrgCount = pendingOrgRequests.filter((r) => r.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-500/15 text-purple-300 border border-purple-500/30 mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>HOD & Institutional Governance Portal</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Role & Organization Access Approvals
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Verify academic credentials, departmental assignments, and corporate registration proofs. Only approved requests gain privileged dashboard access.
          </p>
        </div>

        {/* Security badge */}
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-white">Database-Level RLS Active</div>
            <div className="text-[10px] text-slate-400">Strict server-side validation</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-slate-900/80 border border-slate-800 rounded-2xl max-w-md">
        <button
          onClick={() => setActiveSubTab('faculty')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition ${
            activeSubTab === 'faculty'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Faculty & Coordinators</span>
          {pendingFacCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-slate-950 font-black">
              {pendingFacCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('organizations')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition ${
            activeSubTab === 'organizations'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>External Organizations</span>
          {pendingOrgCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white font-black">
              {pendingOrgCount}
            </span>
          )}
        </button>
      </div>

      {/* Tab 1: Faculty Requests */}
      {activeSubTab === 'faculty' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              Showing <strong>{pendingFacultyRequests.length}</strong> faculty coordinator registration requests
            </span>
            <span className="text-blue-400 font-semibold text-[11px]">
              Requires HOD / Principal Sign-off
            </span>
          </div>

          {pendingFacultyRequests.length === 0 ? (
            <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 text-xs">
              No faculty access requests pending at this time.
            </div>
          ) : (
            pendingFacultyRequests.map((req) => {
              const isPending = req.status === 'pending';
              const isApproved = req.status === 'approved';
              const isRejected = req.status === 'rejected';

              return (
                <div
                  key={req.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 transition shadow-lg space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center font-bold text-sm">
                        <UserCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-white">{req.fullName}</h3>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isApproved
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : isRejected
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            {req.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">
                          {req.designation} • Dept of {req.department}
                        </p>
                      </div>
                    </div>

                    <div className="text-right text-[11px] text-slate-500">
                      <div>Employee ID: <strong className="text-slate-300">{req.employeeId}</strong></div>
                      <div>Email: <strong className="text-blue-400">{req.email}</strong></div>
                    </div>
                  </div>

                  {/* Justification & Scope */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950 p-3 rounded-xl border border-slate-850 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[10px] font-semibold uppercase">
                        Assigned Section / Club Mentorship
                      </span>
                      <strong className="text-emerald-300">{req.assignedSectionOrClub}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] font-semibold uppercase">
                        Request Purpose / Note
                      </span>
                      <p className="text-slate-300 text-[11px] italic leading-tight">
                        "{req.justification}"
                      </p>
                    </div>
                  </div>

                  {/* Rejection Note display if rejected */}
                  {isRejected && req.rejectionReason && (
                    <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>Rejection note: {req.rejectionReason}</span>
                    </div>
                  )}

                  {/* Reject Modal / Input */}
                  {rejectingFacultyId === req.id && (
                    <div className="p-3 bg-slate-950 border border-rose-500/40 rounded-xl space-y-2">
                      <label className="text-xs font-bold text-rose-300 block">
                        Reason for declining faculty coordinator request:
                      </label>
                      <input
                        type="text"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="e.g. Employee ID not found in institutional HR directory, or incorrect department."
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-rose-400"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setRejectingFacultyId(null);
                            setRejectionReason('');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleRejectFaculty(req.id)}
                          disabled={isProcessing === req.id}
                          className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow"
                        >
                          Confirm Rejection
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Actions for Pending Requests */}
                  {isPending && rejectingFacultyId !== req.id && (
                    <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-800/80">
                      <button
                        onClick={() => setRejectingFacultyId(req.id)}
                        disabled={isProcessing === req.id}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-900/40 text-slate-300 hover:text-rose-300 text-xs font-semibold transition border border-transparent hover:border-rose-500/30 flex items-center gap-1.5"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject Request</span>
                      </button>

                      <button
                        onClick={() => handleApproveFaculty(req.id)}
                        disabled={isProcessing === req.id}
                        className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{isProcessing === req.id ? 'Approving...' : 'Approve & Grant Faculty Role'}</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 2: External Organizations Requests */}
      {activeSubTab === 'organizations' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              Showing <strong>{pendingOrgRequests.length}</strong> external organization verification requests
            </span>
            <span className="text-amber-400 font-semibold text-[11px]">
              Institutional Partner Verification
            </span>
          </div>

          {pendingOrgRequests.length === 0 ? (
            <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 text-xs">
              No organization verification requests pending at this time.
            </div>
          ) : (
            pendingOrgRequests.map((req) => {
              const isPending = req.status === 'pending';
              const isApproved = req.status === 'approved';
              const isRejected = req.status === 'rejected';

              return (
                <div
                  key={req.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 transition shadow-lg space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold text-sm">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-white">{req.organizationName}</h3>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                            {req.orgType}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isApproved
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : isRejected
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            {req.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">
                          Rep: <strong className="text-slate-200">{req.representativeName}</strong> ({req.designation})
                        </p>
                      </div>
                    </div>

                    <div className="text-right text-[11px] text-slate-500">
                      <div>Work Email: <strong className="text-blue-400">{req.workEmail}</strong></div>
                      {req.website && (
                        <a
                          href={req.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-cyan-400 hover:underline flex items-center justify-end gap-1"
                        >
                          <span>{req.website}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Verification Details & Intent */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950 p-3 rounded-xl border border-slate-850 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[10px] font-semibold uppercase">
                        Verification Credentials / Registration Proof
                      </span>
                      <strong className="text-cyan-300">{req.verificationDetails}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] font-semibold uppercase">
                        Partnership Intent / Offerings
                      </span>
                      <p className="text-slate-300 text-[11px] leading-tight">
                        {req.partnershipIntent}
                      </p>
                    </div>
                  </div>

                  {/* Rejection Note if rejected */}
                  {isRejected && req.rejectionReason && (
                    <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>Rejection note: {req.rejectionReason}</span>
                    </div>
                  )}

                  {/* Reject Modal / Input */}
                  {rejectingOrgId === req.id && (
                    <div className="p-3 bg-slate-950 border border-rose-500/40 rounded-xl space-y-2">
                      <label className="text-xs font-bold text-rose-300 block">
                        Reason for declining organization verification:
                      </label>
                      <input
                        type="text"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="e.g. Could not verify corporate registration number; website is invalid."
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-rose-400"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setRejectingOrgId(null);
                            setRejectionReason('');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleRejectOrg(req.id)}
                          disabled={isProcessing === req.id}
                          className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow"
                        >
                          Confirm Rejection
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Actions for Pending Requests */}
                  {isPending && rejectingOrgId !== req.id && (
                    <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-800/80">
                      <button
                        onClick={() => setRejectingOrgId(req.id)}
                        disabled={isProcessing === req.id}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-900/40 text-slate-300 hover:text-rose-300 text-xs font-semibold transition border border-transparent hover:border-rose-500/30 flex items-center gap-1.5"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject Organization</span>
                      </button>

                      <button
                        onClick={() => handleApproveOrg(req.id)}
                        disabled={isProcessing === req.id}
                        className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/30 transition flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>
                          {isProcessing === req.id ? 'Verifying...' : 'Verify & Approve Organization'}
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
