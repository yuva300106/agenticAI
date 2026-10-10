import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  GraduationCap,
  Building,
  Award,
  BookOpen,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { currentUser, studentStats } = useApp();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-blue-600/30">
          {currentUser.name.charAt(0)}
        </div>

        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-white">{currentUser.name}</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase">
              {currentUser.role}
            </span>
          </div>
          <p className="text-xs text-slate-400">{currentUser.email}</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3 text-xs text-slate-300">
            <span>
              Dept: <strong>{currentUser.department || 'CSE'}</strong>
            </span>
            <span>
              Year: <strong>{currentUser.year || 'III'}</strong>
            </span>
            <span>
              Section: <strong>{currentUser.section || 'A'}</strong>
            </span>
            <span>
              Roll No: <strong>23CS8102</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Academic & Engagement Standing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" />
            Institutional Engagement Standing
          </h3>
          <div className="space-y-3 text-xs text-slate-300">
            <div className="flex justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-850">
              <span>Overall Engagement Index:</span>
              <strong className="text-emerald-400">{studentStats.engagementScore}% (Tier 1)</strong>
            </div>
            <div className="flex justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-850">
              <span>Career Exposure Score:</span>
              <strong className="text-blue-400">{studentStats.careerExposureScore}/100</strong>
            </div>
            <div className="flex justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-850">
              <span>Completed & Verified Events:</span>
              <strong className="text-white">{studentStats.eventsAttendedCount} Events</strong>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            Core Academic Profile
          </h3>
          <div className="space-y-3 text-xs text-slate-300">
            <div className="flex justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-850">
              <span>Cumulative CGPA:</span>
              <strong className="text-white">8.72 / 10.0</strong>
            </div>
            <div className="flex justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-850">
              <span>Academic Attendance:</span>
              <strong className="text-white">92.4%</strong>
            </div>
            <div className="flex justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-850">
              <span>Faculty Coordinator:</span>
              <strong className="text-white">Dr. Priya Rao (CSE-A)</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
