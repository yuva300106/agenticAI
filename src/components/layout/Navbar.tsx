import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Activity,
  Bell,
  Check,
  ChevronDown,
  Layers,
  Sparkles,
  UserCheck,
  Building,
  GraduationCap,
  Shield,
  Briefcase,
  X,
  ExternalLink,
  LogOut,
  Database,
  Lock,
} from 'lucide-react';
import { SupabaseConfigModal } from '../common/SupabaseConfigModal';

interface NavbarProps {
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
  const {
    currentUser,
    switchUserRole,
    notifications,
    markNotificationAsRead,
    dismissNotification,
    registerForEvent,
    setActiveTab,
    setSelectedEventForModal,
    events,
    signOutUser,
    isSupabaseConnected,
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const roles: { role: UserRole; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      role: 'student',
      label: 'Aarav Sharma',
      desc: 'Student • CSE III-A',
      icon: <GraduationCap className="w-4 h-4 text-blue-400" />,
    },
    {
      role: 'faculty',
      label: 'Dr. Priya Rao',
      desc: 'Faculty Coordinator • CSE',
      icon: <UserCheck className="w-4 h-4 text-emerald-400" />,
    },
    {
      role: 'admin',
      label: 'Campus Admin',
      desc: 'Institutional Administrator',
      icon: <Shield className="w-4 h-4 text-purple-400" />,
    },
    {
      role: 'external_partner',
      label: 'TechNova Innovations',
      desc: 'Verified Company Partner',
      icon: <Briefcase className="w-4 h-4 text-amber-400" />,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab(currentUser.role === 'student' ? 'home' : currentUser.role === 'faculty' ? 'faculty_dashboard' : currentUser.role === 'admin' ? 'admin_overview' : 'partner_dashboard')}>
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/20">
            <Activity className="w-5 h-5 text-white animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                CampusPulse
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Agentic Intelligence
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block truncate">
              Don't just discover opportunities. Make every opportunity count.
            </p>
          </div>
        </div>

        {/* Center / Navigation Quick Links */}
        <div className="hidden lg:flex items-center gap-1">
          <button
            onClick={() => setActiveTab('workflow')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition"
          >
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>How CampusPulse Thinks</span>
          </button>
        </div>

        {/* Right Section: Role Switcher & Notifications */}
        <div className="flex items-center gap-3">
          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-slide-up">
                <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-bold text-white">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setIsNotifOpen(false)}
                    className="text-slate-400 hover:text-white text-xs"
                  >
                    Close
                  </button>
                </div>

                <div className="max-h-96 overflow-y-auto divide-y divide-slate-800/60 p-1">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                      No notifications at this moment.
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-3.5 transition rounded-xl ${
                          notif.read ? 'bg-transparent text-slate-400' : 'bg-slate-800/40 text-slate-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <span className="text-xs font-bold text-white leading-tight">
                            {notif.title}
                          </span>
                          <span className="text-[10px] text-slate-500 shrink-0">{notif.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed mb-2.5">
                          {notif.message}
                        </p>

                        <div className="flex items-center justify-between gap-2">
                          {notif.actionButton && (
                            <button
                              onClick={() => {
                                if (notif.actionButton?.action === 'register' && notif.eventId) {
                                  registerForEvent(notif.eventId);
                                } else if (notif.actionButton?.action === 'view_event' && notif.eventId) {
                                  const ev = events.find((e) => e.id === notif.eventId);
                                  if (ev) setSelectedEventForModal(ev);
                                }
                                markNotificationAsRead(notif.id);
                                setIsNotifOpen(false);
                              }}
                              className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow transition"
                            >
                              {notif.actionButton.label}
                            </button>
                          )}
                          <div className="flex items-center gap-2 ml-auto">
                            {!notif.read && (
                              <button
                                onClick={() => markNotificationAsRead(notif.id)}
                                className="text-[11px] text-blue-400 hover:underline"
                              >
                                Mark read
                              </button>
                            )}
                            <button
                              onClick={() => dismissNotification(notif.id)}
                              className="text-[11px] text-slate-500 hover:text-slate-300"
                            >
                              Dismiss
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Supabase Status Pill */}
          <button
            onClick={() => setShowConfigModal(true)}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 hover:text-white transition shadow"
            title="Configure Supabase and view testing guide"
          >
            <Database className={`w-3.5 h-3.5 ${isSupabaseConnected ? 'text-emerald-400' : 'text-amber-400'}`} />
            <span className="hidden lg:inline text-[11px] font-semibold">Supabase</span>
            <span
              className={`w-2 h-2 rounded-full ${
                isSupabaseConnected ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
            />
          </button>

          {/* Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-slate-600 text-left transition shadow-md"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold text-xs shrink-0">
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-white flex items-center gap-1">
                  <span>{currentUser.name}</span>
                  <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 uppercase">
                    {currentUser.role.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
                  {currentUser.department || currentUser.organization || 'Campus'}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </button>

            {isRoleMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 p-2 animate-slide-up space-y-1">
                <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 flex items-center justify-between">
                  <span>Active Session</span>
                  <span className="text-emerald-400 text-[10px]">Verified Role</span>
                </div>

                {roles.map((r) => (
                  <button
                    key={r.role}
                    onClick={() => {
                      switchUserRole(r.role);
                      setIsRoleMenuOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl transition flex items-center justify-between ${
                      currentUser.role === r.role
                        ? 'bg-blue-600/20 text-white border border-blue-500/30'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-slate-800">{r.icon}</div>
                      <div>
                        <div className="text-xs font-bold text-white">{r.label}</div>
                        <div className="text-[10px] text-slate-400">{r.desc}</div>
                      </div>
                    </div>
                    {currentUser.role === r.role && (
                      <Check className="w-4 h-4 text-blue-400 shrink-0" />
                    )}
                  </button>
                ))}

                <div className="pt-2 border-t border-slate-800 space-y-1">
                  <button
                    onClick={() => {
                      setIsRoleMenuOpen(false);
                      setShowConfigModal(true);
                    }}
                    className="w-full text-left p-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2 transition"
                  >
                    <Database className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Supabase Settings &amp; Guide</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsRoleMenuOpen(false);
                      if (onLogout) {
                        onLogout();
                      } else {
                        signOutUser();
                      }
                    }}
                    className="w-full text-left p-2 rounded-xl text-xs font-semibold text-rose-300 hover:bg-rose-950/40 flex items-center gap-2 transition"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-400" />
                    <span>Sign In / Switch Portal</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <SupabaseConfigModal isOpen={showConfigModal} onClose={() => setShowConfigModal(false)} />
    </header>
  );
};
