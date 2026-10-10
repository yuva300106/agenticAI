import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Compass,
  CalendarCheck,
  BarChart3,
  Building2,
  FileCheck2,
  Cpu,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const AdminOverview: React.FC = () => {
  const {
    externalRequests,
    classes,
    agentLogs,
    setActiveTab,
    pendingFacultyRequests,
    pendingOrgRequests,
  } = useApp();

  const pendingRequestsCount = externalRequests.filter((r) => r.status === 'Pending Approval').length;
  const pendingApprovalsCount =
    pendingFacultyRequests.filter((r) => r.status === 'pending').length +
    pendingOrgRequests.filter((r) => r.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">System Overview</h1>
          <p className="text-xs text-slate-400 mt-1">
            Central institutional intelligence across student engagement, partner compliance, and autonomous agent loops.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('admin_access_requests')}
            className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-purple-600/25"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Role Approvals ({pendingApprovalsCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('admin_requests')}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition shadow-lg shadow-amber-500/25"
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>External Event Requests ({pendingRequestsCount})</span>
          </button>
        </div>
      </div>

      {/* 6 Key Admin Metric Cards (from Section 22) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="text-xs text-slate-400 mb-1 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-blue-400" /> Total Students
          </div>
          <div className="text-2xl font-black text-white">2,840</div>
          <div className="text-[10px] text-slate-500 mt-1">Across 8 departments</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="text-xs text-slate-400 mb-1 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-cyan-400" /> Active Opps
          </div>
          <div className="text-2xl font-black text-white">42</div>
          <div className="text-[10px] text-cyan-400 mt-1">Internal + Verified</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="text-xs text-slate-400 mb-1 flex items-center gap-1.5">
            <CalendarCheck className="w-3.5 h-3.5 text-emerald-400" /> Registrations
          </div>
          <div className="text-2xl font-black text-white">1,284</div>
          <div className="text-[10px] text-emerald-400 mt-1">This month</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="text-xs text-slate-400 mb-1 flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5 text-indigo-400" /> Avg Engagement
          </div>
          <div className="text-2xl font-black text-white">63%</div>
          <div className="text-[10px] text-indigo-400 mt-1">Institutional Index</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="text-xs text-slate-400 mb-1 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-purple-400" /> Verified Partners
          </div>
          <div className="text-2xl font-black text-white">18</div>
          <div className="text-[10px] text-purple-400 mt-1">Vetted corporate orgs</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="text-xs text-slate-400 mb-1 flex items-center gap-1.5">
            <FileCheck2 className="w-3.5 h-3.5 text-amber-400" /> Pending Requests
          </div>
          <div className="text-2xl font-black text-amber-400">{pendingRequestsCount || 4}</div>
          <div className="text-[10px] text-amber-300 mt-1">Awaiting approval</div>
        </div>
      </div>

      {/* Two Column Grid: Class Engagement vs External Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Class Engagement Health */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-400" />
                Class Engagement Health
              </h3>
              <p className="text-[11px] text-slate-400">Institutional comparison and variance</p>
            </div>
            <button
              onClick={() => setActiveTab('intelligence')}
              className="text-xs font-semibold text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>Manage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {classes.map((cls) => (
              <div
                key={cls.id}
                className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-sm text-white">{cls.name}</div>
                  <div className="text-xs text-slate-400">
                    Coordinator: {cls.facultyCoordinator} ({cls.studentCount} students)
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-base font-black text-white">{cls.engagementScore}%</div>
                  <div
                    className={`text-[10px] font-bold ${
                      cls.engagementScore >= 70
                        ? 'text-emerald-400'
                        : cls.engagementScore < 50
                        ? 'text-rose-400'
                        : 'text-amber-400'
                    }`}
                  >
                    {cls.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* External Organization Requests */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-amber-400" />
                External Partner Requests
              </h3>
              <p className="text-[11px] text-slate-400">Time-bound event posting approval gate</p>
            </div>
            <button
              onClick={() => setActiveTab('admin_requests')}
              className="text-xs font-semibold text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>Review All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {externalRequests.map((req) => (
              <div
                key={req.id}
                className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-sm text-white">{req.organizationName}</div>
                  <div className="text-xs text-slate-300 font-medium">{req.eventTitle}</div>
                  <div className="text-[11px] text-slate-500">
                    Authority: {req.authorityTarget}
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-bold border ${
                      req.status === 'Approved'
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        : req.status === 'Rejected'
                        ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                        : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                    }`}
                  >
                    {req.status}
                  </span>
                  {req.validUntil && (
                    <div className="text-[10px] text-slate-400 mt-1">Until {req.validUntil.split(' ')[0]}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Agent Activity Stream (Section 23) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">Live AI Agent Activity</h2>
          </div>
          <button
            onClick={() => setActiveTab('agent_logs')}
            className="text-xs font-semibold text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>View Full Log ({agentLogs.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {agentLogs.slice(0, 5).map((log) => (
            <div
              key={log.id}
              className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div className="flex items-start gap-2.5">
                <span
                  className={`mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                    log.type === 'success'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : log.type === 'warning'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-blue-500/20 text-blue-300'
                  }`}
                >
                  {log.agentName}
                </span>
                <div>
                  <div className="font-semibold text-white">{log.action}</div>
                  <div className="text-slate-400 text-[11px]">{log.detail}</div>
                </div>
              </div>
              <span className="text-[11px] text-slate-500 shrink-0 self-end sm:self-center">
                {log.timestamp}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
