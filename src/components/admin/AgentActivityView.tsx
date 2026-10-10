import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Cpu,
  Sparkles,
  AlertTriangle,
  TrendingUp,
  UserCheck,
  ShieldCheck,
  Bot,
  Filter,
  Search,
} from 'lucide-react';
import { AgentActivityLogItem } from '../../types';

export const AgentActivityView: React.FC = () => {
  const { agentLogs } = useApp();
  const [selectedAgentFilter, setSelectedAgentFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const agentsList = [
    'All',
    'Opportunity Matching Agent',
    'Missed Opportunity Rescue Agent',
    'Engagement Intelligence Agent',
    'Faculty Communication Agent',
    'External Verification Agent',
    'Career Insight Agent',
  ];

  const filteredLogs = agentLogs.filter((log) => {
    if (selectedAgentFilter !== 'All' && log.agentName !== selectedAgentFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        log.action.toLowerCase().includes(q) ||
        log.detail.toLowerCase().includes(q) ||
        log.agentName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getAgentBadgeColor = (agentName: string) => {
    switch (agentName) {
      case 'Opportunity Matching Agent':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'Missed Opportunity Rescue Agent':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'Engagement Intelligence Agent':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'Faculty Communication Agent':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'External Verification Agent':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      case 'Career Insight Agent':
        return 'bg-violet-500/20 text-violet-300 border-violet-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5" /> Agentic Activity Stream
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">AI Agent Audit Activity Log</h1>
        <p className="text-xs text-slate-400 mt-1">
          Real-time record of autonomous decisions, student opportunity matching events, countdown alerts, and institutional dispatches.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedAgentFilter}
            onChange={(e) => setSelectedAgentFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 w-full sm:w-auto"
          >
            {agentsList.map((agent) => (
              <option key={agent} value={agent}>
                {agent}
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search action logs..."
            className="w-full bg-slate-950 border border-slate-800 text-xs text-white pl-9 pr-3 py-2 rounded-xl"
          />
        </div>
      </div>

      {/* Log Feed */}
      <div className="space-y-3">
        {filteredLogs.map((log) => (
          <div
            key={log.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-4 hover:border-slate-750 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-start gap-3">
              <span
                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider shrink-0 border ${getAgentBadgeColor(
                  log.agentName
                )}`}
              >
                {log.agentName}
              </span>
              <div>
                <h3 className="font-bold text-white text-sm leading-tight">{log.action}</h3>
                <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">{log.detail}</p>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 shrink-0 self-end sm:self-center">
              {log.timestamp}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
