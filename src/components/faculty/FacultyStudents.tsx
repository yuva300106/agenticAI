import React from 'react';
import { useApp } from '../../context/AppContext';
import { Users2, Search, CheckCircle2, Award, Clock } from 'lucide-react';

export const FacultyStudents: React.FC = () => {
  const { classes } = useApp();

  // Mock list of students across CSE sections
  const students = [
    { id: 'std-1', name: 'Aarav Sharma', roll: '23CS8102', section: 'CSE-A', score: 78, tier: 'Highly Engaged', attended: 12 },
    { id: 'std-2', name: 'Ananya Verma', roll: '23CS8105', section: 'CSE-A', score: 91, tier: 'Highly Engaged', attended: 15 },
    { id: 'std-3', name: 'Rohan Iyer', roll: '23CS8110', section: 'CSE-A', score: 84, tier: 'Highly Engaged', attended: 13 },
    { id: 'std-4', name: 'Kavya Nair', roll: '23CS8118', section: 'CSE-B', score: 62, tier: 'Engaged', attended: 9 },
    { id: 'std-5', name: 'Devendra Patel', roll: '23CS8124', section: 'CSE-B', score: 55, tier: 'Engaged', attended: 8 },
    { id: 'std-6', name: 'Siddharth Rao', roll: '23CS8132', section: 'CSE-C', score: 32, tier: 'Low Engagement', attended: 4 },
    { id: 'std-7', name: 'Pooja Reddy', roll: '23CS8139', section: 'CSE-C', score: 26, tier: 'Low Engagement', attended: 3 },
    { id: 'std-8', name: 'Manish Gupta', roll: '23CS8144', section: 'CSE-C', score: 29, tier: 'Low Engagement', attended: 3 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Assigned Students & Cohorts</h1>
        <p className="text-xs text-slate-400 mt-1">
          Individual participation metrics for CSE III Year students across sections A, B, and C.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Student Name</th>
                <th className="p-4">Roll No</th>
                <th className="p-4">Section</th>
                <th className="p-4">Engagement Index</th>
                <th className="p-4">Cohort Classification</th>
                <th className="p-4 text-right">Attended</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {students.map((std) => (
                <tr key={std.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-4 font-bold text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold text-[10px]">
                      {std.name.charAt(0)}
                    </span>
                    <span>{std.name}</span>
                  </td>
                  <td className="p-4 font-mono text-slate-400">{std.roll}</td>
                  <td className="p-4 font-semibold">{std.section}</td>
                  <td className="p-4">
                    <span className="font-bold text-white text-sm">{std.score}%</span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] border ${
                        std.score >= 70
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : std.score < 50
                          ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                          : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      {std.tier}
                    </span>
                  </td>
                  <td className="p-4 text-right font-bold text-white">{std.attended} Events</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
