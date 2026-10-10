import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Home,
  Compass,
  BookmarkCheck,
  BarChart3,
  TrendingUp,
  Sparkles,
  Bell,
  User,
  LayoutDashboard,
  CalendarDays,
  FileCheck2,
  Users2,
  MessageSquareQuote,
  Building2,
  ShieldCheck,
  Cpu,
  Layers,
  PlusCircle,
  Briefcase,
  HelpCircle,
  ExternalLink,
  LogOut,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

interface SidebarProps {
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const {
    currentUser,
    activeTab,
    setActiveTab,
    notifications,
    externalRequests,
    pendingFacultyRequests,
    pendingOrgRequests,
    signOutUser,
  } = useApp();

  const unreadCount = notifications.filter((n) => !n.read).length;
  const pendingRequestsCount = externalRequests.filter((r) => r.status === 'Pending Approval').length;
  const pendingApprovalsCount =
    pendingFacultyRequests.filter((r) => r.status === 'pending').length +
    pendingOrgRequests.filter((r) => r.status === 'pending').length;

  const getNavItems = (): NavItem[] => {
    switch (currentUser.role) {
      case 'student':
        return [
          { id: 'home', label: 'Home Dashboard', icon: <Home className="w-4 h-4" /> },
          { id: 'discover', label: 'Discover Opportunities', icon: <Compass className="w-4 h-4" /> },
          { id: 'my_opportunities', label: 'My Opportunities', icon: <BookmarkCheck className="w-4 h-4" /> },
          { id: 'engagement', label: 'My Engagement', icon: <BarChart3 className="w-4 h-4" /> },
          { id: 'career_impact', label: 'Career Impact', icon: <TrendingUp className="w-4 h-4" /> },
          { id: 'pulse_ai', label: 'Pulse AI Assistant', icon: <Sparkles className="w-4 h-4 text-cyan-400" />, badge: 'AI' },
          { id: 'workflow', label: 'How CampusPulse Thinks', icon: <Layers className="w-4 h-4 text-blue-400" /> },
          {
            id: 'notifications_page',
            label: 'Notifications',
            icon: <Bell className="w-4 h-4" />,
            badge: unreadCount > 0 ? `${unreadCount}` : undefined,
          },
          { id: 'profile', label: 'Student Profile', icon: <User className="w-4 h-4" /> },
        ];

      case 'faculty':
        return [
          { id: 'faculty_dashboard', label: 'Faculty Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'intelligence', label: 'Engagement Intelligence', icon: <BarChart3 className="w-4 h-4 text-blue-400" /> },
          { id: 'faculty_events', label: 'Events Catalog', icon: <CalendarDays className="w-4 h-4" /> },
          { id: 'faculty_messages', label: 'Faculty Messages', icon: <MessageSquareQuote className="w-4 h-4" /> },
          { id: 'faculty_students', label: 'Assigned Classes', icon: <Users2 className="w-4 h-4" /> },
          { id: 'workflow', label: 'How CampusPulse Thinks', icon: <Layers className="w-4 h-4" /> },
          {
            id: 'notifications_page',
            label: 'Notifications',
            icon: <Bell className="w-4 h-4" />,
            badge: unreadCount > 0 ? `${unreadCount}` : undefined,
          },
        ];

      case 'admin':
        return [
          { id: 'admin_overview', label: 'Admin Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
          {
            id: 'admin_access_requests',
            label: 'Role & Partner Approvals',
            icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
            badge: pendingApprovalsCount > 0 ? `${pendingApprovalsCount}` : undefined,
          },
          { id: 'intelligence', label: 'Engagement Intelligence', icon: <BarChart3 className="w-4 h-4" /> },
          {
            id: 'admin_requests',
            label: 'External Event Requests',
            icon: <FileCheck2 className="w-4 h-4 text-amber-400" />,
            badge: pendingRequestsCount > 0 ? `${pendingRequestsCount}` : undefined,
          },
          { id: 'admin_partners', label: 'Partner Management', icon: <Building2 className="w-4 h-4" /> },
          { id: 'agent_logs', label: 'AI Agent Activity', icon: <Cpu className="w-4 h-4 text-emerald-400" /> },
          { id: 'workflow', label: 'How CampusPulse Thinks', icon: <Layers className="w-4 h-4" /> },
          {
            id: 'notifications_page',
            label: 'Notifications',
            icon: <Bell className="w-4 h-4" />,
          },
        ];

      case 'external_partner':
        return [
          { id: 'partner_dashboard', label: 'Partner Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'request_permission', label: 'Request Permission', icon: <FileCheck2 className="w-4 h-4 text-amber-400" /> },
          { id: 'create_event', label: 'Create Approved Event', icon: <PlusCircle className="w-4 h-4 text-blue-400" /> },
          { id: 'my_approved_events', label: 'My Posted Events', icon: <CalendarDays className="w-4 h-4" /> },
          { id: 'partner_profile', label: 'Organization Profile', icon: <Building2 className="w-4 h-4" /> },
          { id: 'workflow', label: 'How CampusPulse Thinks', icon: <Layers className="w-4 h-4" /> },
        ];

      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 bg-slate-950/70 border-r border-slate-800/80 p-4 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        {/* Role Identity Tag */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
            Active Portal
          </div>
          <div className="text-sm font-bold text-white flex items-center justify-between">
            <span className="capitalize">{currentUser.role.replace('_', ' ')}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="text-xs text-slate-400 truncate mt-0.5">
            {currentUser.name}
          </div>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                      isActive
                        ? 'bg-blue-800 text-white'
                        : 'bg-slate-800 text-blue-400 group-hover:bg-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom info banner & sign out */}
      <div className="pt-4 border-t border-slate-800/80 space-y-3">
        <div className="bg-gradient-to-br from-blue-950/40 to-slate-900 p-3 rounded-xl border border-blue-500/20 text-xs">
          <div className="flex items-center gap-1.5 text-blue-300 font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Agentic Ecosystem</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            6 AI agents orchestrating opportunity matching, rescue, and faculty governance.
          </p>
        </div>

        <button
          onClick={() => {
            if (onLogout) {
              onLogout();
            } else {
              signOutUser();
            }
          }}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition shadow"
        >
          <LogOut className="w-3.5 h-3.5 text-rose-400" />
          <span>Sign Out / Switch Portal</span>
        </button>
      </div>
    </aside>
  );
};
