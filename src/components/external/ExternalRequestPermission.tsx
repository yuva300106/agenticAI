import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CollegeAuthority, EventCategory } from '../../types';
import {
  FileCheck2,
  Building,
  Calendar,
  Clock,
  ShieldCheck,
  Send,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const ExternalRequestPermission: React.FC = () => {
  const { currentUser, submitExternalRequest, setActiveTab } = useApp();

  const [formData, setFormData] = useState({
    organizationName: currentUser.organization || 'TechNova Innovations',
    organizationType: 'Company',
    officialEmail: 'partnerships@technova.io',
    contactPerson: 'Vikram Mehta (Director of Campus Alliances)',
    phone: '+91 98765 43210',
    website: 'https://technova.io',
    authorityTarget: 'Training & Placement Coordinator' as CollegeAuthority,
    eventTitle: 'Autonomous AI Agents Hackathon: Multi-Agent Systems',
    eventDescription:
      'A 12-hour intensive hybrid hackathon focusing on multi-agent execution with tools and LLM loops. Top teams receive cash rewards and pre-placement interviews.',
    eventCategory: 'Hackathon' as EventCategory,
    eventDate: '24 Oct 2026',
    registrationDeadline: '22 Oct 2026',
    targetDepartment: 'CSE',
    targetYear: 'III',
    targetSections: 'A, B',
    registrationLink: 'https://technova.io/hackathons/campuspulse-2026',
    reasonForRequest:
      'We seek direct campus collaboration with CSE pre-final year students to discover talent for our upcoming 2027 AI engineering fellowship.',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitExternalRequest(formData);
    setIsSubmitted(true);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Request Permission to Post an Opportunity
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          CampusPulse enforces strict institutional governance. External events require prior review and audience approval by designated college authorities.
        </p>
      </div>

      {isSubmitted ? (
        <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-8 text-center space-y-4 animate-fade-in">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">Status: Pending Approval</h2>
          <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
            Your request has been submitted to the selected college authority:{' '}
            <strong className="text-white">{formData.authorityTarget}</strong>. Once approved, you will receive a
            time-bound temporary posting token.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => setActiveTab('partner_dashboard')}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow"
            >
              Return to Partner Dashboard
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          {/* Authority Selection */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <label className="block text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">
              Select College Approving Authority
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(
                [
                  'Training & Placement Coordinator',
                  'Principal / Administrator',
                  'Relevant HOD',
                  'Club Faculty Coordinator',
                ] as CollegeAuthority[]
              ).map((auth) => (
                <label
                  key={auth}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer text-xs transition ${
                    formData.authorityTarget === auth
                      ? 'bg-blue-600/20 border-blue-500 text-white'
                      : 'bg-slate-900 border-slate-850 text-slate-400 hover:text-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="authorityTarget"
                    value={auth}
                    checked={formData.authorityTarget === auth}
                    onChange={(e) =>
                      setFormData({ ...formData, authorityTarget: e.target.value as CollegeAuthority })
                    }
                    className="text-blue-600 focus:ring-0"
                  />
                  <span className="font-semibold">{auth}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Org Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Organization Name</label>
              <input
                type="text"
                value={formData.organizationName}
                onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Organization Type</label>
              <input
                type="text"
                value={formData.organizationType}
                onChange={(e) => setFormData({ ...formData, organizationType: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Official Email</label>
              <input
                type="email"
                value={formData.officialEmail}
                onChange={(e) => setFormData({ ...formData, officialEmail: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Contact Person & Title</label>
              <input
                type="text"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                required
              />
            </div>
          </div>

          {/* Event Details */}
          <div className="border-t border-slate-800 pt-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Opportunity Specifications</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Proposed Event Title</label>
                <input
                  type="text"
                  value={formData.eventTitle}
                  onChange={(e) => setFormData({ ...formData, eventTitle: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                <select
                  value={formData.eventCategory}
                  onChange={(e) =>
                    setFormData({ ...formData, eventCategory: e.target.value as EventCategory })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                >
                  <option value="Hackathon">Hackathon</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Competition">Competition</option>
                  <option value="Internship">Internship</option>
                  <option value="Seminar">Seminar</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Event Date</label>
                <input
                  type="text"
                  value={formData.eventDate}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Registration Deadline</label>
                <input
                  type="text"
                  value={formData.registrationDeadline}
                  onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Department & Year</label>
                <input
                  type="text"
                  value={`${formData.targetDepartment} Year ${formData.targetYear} (Sections ${formData.targetSections})`}
                  disabled
                  className="w-full bg-slate-950/60 border border-slate-850 rounded-xl px-3.5 py-2 text-xs text-slate-400 cursor-not-allowed"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Event Description</label>
                <textarea
                  rows={2}
                  value={formData.eventDescription}
                  onChange={(e) => setFormData({ ...formData, eventDescription: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Reason for Campus Posting</label>
                <textarea
                  rows={2}
                  value={formData.reasonForRequest}
                  onChange={(e) => setFormData({ ...formData, reasonForRequest: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                  required
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 transition flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Submit Permission Request</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
