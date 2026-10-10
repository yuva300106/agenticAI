import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileCheck2,
  CheckCircle2,
  XCircle,
  Clock,
  Building,
  Calendar,
  Users,
  ShieldCheck,
  Eye,
  AlertTriangle,
  Lock,
} from 'lucide-react';
import { ExternalPermissionRequest } from '../../types';

export const AdminExternalRequests: React.FC = () => {
  const {
    externalRequests,
    approveExternalRequest,
    rejectExternalRequest,
    toggleSimulatedExpiry,
    addToast,
  } = useApp();

  const [selectedReqForModal, setSelectedReqForModal] = useState<ExternalPermissionRequest | null>(
    null
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          External Organization Requests
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Review, approve, or reject third-party corporate opportunity requests and configure time-bound posting windows.
        </p>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {externalRequests.map((req) => {
          const isPending = req.status === 'Pending Approval';
          const isApproved = req.status === 'Approved';

          return (
            <div
              key={req.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-750 transition-all shadow-md"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-base text-white">{req.organizationName}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                      {req.organizationType}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                        req.status === 'Approved'
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : req.status === 'Rejected'
                          ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                          : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      {req.status}
                    </span>
                    {isApproved && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        Temporary Event Posting Access
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-slate-200">{req.eventTitle}</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-850">
                    <div>
                      <span className="text-slate-500">Requested Authority:</span>{' '}
                      <strong className="text-slate-200">{req.authorityTarget}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Audience:</span>{' '}
                      <strong className="text-cyan-300">{req.targetDepartment} Year {req.targetYear}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Event Date:</span>{' '}
                      <strong className="text-slate-200">{req.eventDate}</strong>
                    </div>
                  </div>

                  {/* Temporary Permission Window Details (HACKATHON STEP 11) */}
                  {isApproved && (
                    <div className="bg-emerald-950/30 border border-emerald-500/30 p-3 rounded-xl text-xs text-emerald-200 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>
                          <strong>Permission Granted:</strong> Valid From <strong>{req.validFrom}</strong> Until{' '}
                          <strong>{req.validUntil}</strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            req.isExpired ? 'bg-rose-500/30 text-rose-300' : 'bg-emerald-500/30 text-emerald-300'
                          }`}
                        >
                          {req.isExpired ? 'Posting Access: EXPIRED' : 'Posting Access: ACTIVE'}
                        </span>
                        <button
                          onClick={() => toggleSimulatedExpiry(req.id)}
                          className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded text-[11px] font-semibold border border-slate-700 transition"
                        >
                          {req.isExpired ? 'Unexpire' : 'Simulate Expiry'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 lg:flex-col lg:items-end justify-end shrink-0">
                  <button
                    onClick={() => setSelectedReqForModal(req)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Details</span>
                  </button>

                  {isPending && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => rejectExternalRequest(req.id)}
                        className="px-3.5 py-1.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-semibold transition"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => approveExternalRequest(req.id)}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-emerald-600/30 flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve Request</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Details Modal */}
      {selectedReqForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 text-white shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-1">
              {selectedReqForModal.organizationName}
            </h3>
            <p className="text-xs text-slate-400 mb-4">{selectedReqForModal.eventTitle}</p>

            <div className="space-y-3 text-xs text-slate-300 mb-6 bg-slate-950 p-4 rounded-xl border border-slate-850">
              <div>
                <span className="text-slate-500">Contact Person:</span> {selectedReqForModal.contactPerson} ({selectedReqForModal.officialEmail})
              </div>
              <div>
                <span className="text-slate-500">Authority Targeted:</span> {selectedReqForModal.authorityTarget}
              </div>
              <div>
                <span className="text-slate-500">Event Description:</span>
                <p className="mt-1 text-slate-200">{selectedReqForModal.eventDescription}</p>
              </div>
              <div>
                <span className="text-slate-500">Reason for Request:</span>
                <p className="mt-1 text-slate-200">{selectedReqForModal.reasonForRequest}</p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div>
                {selectedReqForModal.status === 'Pending Approval' && (
                  <button
                    onClick={() => {
                      approveExternalRequest(selectedReqForModal.id);
                      setSelectedReqForModal(null);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow"
                  >
                    Grant Temporary Permission
                  </button>
                )}
              </div>
              <button
                onClick={() => setSelectedReqForModal(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
