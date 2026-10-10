import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { DemoScenarioGuide } from './components/common/DemoScenarioGuide';
import { ToastContainer } from './components/common/ToastContainer';
import { EventDetailsModal } from './components/common/EventDetailsModal';
import { AgentWorkflowVisualizer } from './components/common/AgentWorkflowVisualizer';
import { NotificationsPage } from './components/common/NotificationsPage';
import { ProfileView } from './components/common/ProfileView';

// Student
import { StudentHome } from './components/student/StudentHome';
import { DiscoverOpportunities } from './components/student/DiscoverOpportunities';
import { MyOpportunities } from './components/student/MyOpportunities';
import { StudentEngagement } from './components/student/StudentEngagement';
import { CareerImpact } from './components/student/CareerImpact';
import { PulseAI } from './components/student/PulseAI';

// Faculty
import { FacultyDashboard } from './components/faculty/FacultyDashboard';
import { EngagementIntelligence } from './components/faculty/EngagementIntelligence';
import { FacultyMessages } from './components/faculty/FacultyMessages';
import { FacultyStudents } from './components/faculty/FacultyStudents';

// Admin
import { AdminOverview } from './components/admin/AdminOverview';
import { AdminAccessRequests } from './components/admin/AdminAccessRequests';
import { AdminExternalRequests } from './components/admin/AdminExternalRequests';
import { AdminPartners } from './components/admin/AdminPartners';
import { AgentActivityView } from './components/admin/AgentActivityView';

// External Partner
import { ExternalPartnerDashboard } from './components/external/ExternalPartnerDashboard';
import { ExternalRequestPermission } from './components/external/ExternalRequestPermission';
import { ExternalCreateEvent } from './components/external/ExternalCreateEvent';
import { ExternalMyEvents } from './components/external/ExternalMyEvents';
import { ExternalProfile } from './components/external/ExternalProfile';

// Auth Screen & Pending Gate
import { LoginScreen } from './components/auth/LoginScreen';
import { PendingApprovalView } from './components/auth/PendingApprovalView';

const MainLayout: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const { activeTab, currentUser, isPendingApproval, isRejected } = useApp();

  // If currently authenticated user is pending or rejected, show pending approval gate
  if (isPendingApproval || isRejected) {
    return <PendingApprovalView />;
  }

  const renderContent = () => {
    switch (activeTab) {
      // Student tabs
      case 'home':
        return <StudentHome />;
      case 'discover':
      case 'faculty_events':
        return <DiscoverOpportunities />;
      case 'my_opportunities':
        return <MyOpportunities />;
      case 'engagement':
        return <StudentEngagement />;
      case 'career_impact':
        return <CareerImpact />;
      case 'pulse_ai':
        return <PulseAI />;
      case 'profile':
        return <ProfileView />;

      // Common tabs
      case 'workflow':
        return <AgentWorkflowVisualizer />;
      case 'notifications_page':
        return <NotificationsPage />;

      // Faculty tabs
      case 'faculty_dashboard':
        return <FacultyDashboard />;
      case 'intelligence':
        return <EngagementIntelligence />;
      case 'faculty_messages':
        return <FacultyMessages />;
      case 'faculty_students':
        return <FacultyStudents />;

      // Admin tabs
      case 'admin_overview':
        return <AdminOverview />;
      case 'admin_access_requests':
        return <AdminAccessRequests />;
      case 'admin_requests':
        return <AdminExternalRequests />;
      case 'admin_partners':
        return <AdminPartners />;
      case 'agent_logs':
        return <AgentActivityView />;

      // External Partner tabs
      case 'partner_dashboard':
        return <ExternalPartnerDashboard />;
      case 'request_permission':
        return <ExternalRequestPermission />;
      case 'create_event':
        return <ExternalCreateEvent />;
      case 'my_approved_events':
        return <ExternalMyEvents />;
      case 'partner_profile':
        return <ExternalProfile />;

      default:
        if (currentUser.role === 'student') return <StudentHome />;
        if (currentUser.role === 'faculty') return <FacultyDashboard />;
        if (currentUser.role === 'admin') return <AdminOverview />;
        return <ExternalPartnerDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* 14-Step Live Hackathon Guide Bar */}
      <DemoScenarioGuide />

      {/* Main App Navigation */}
      <Navbar onLogout={onLogout} />

      {/* App Body */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar onLogout={onLogout} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-5xl">
          {renderContent()}
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <EventDetailsModal />
      <ToastContainer />
    </div>
  );
};

export const AppContent: React.FC = () => {
  const [showLogin, setShowLogin] = useState(false);
  const { isPendingApproval, isRejected } = useApp();

  if (isPendingApproval || isRejected) {
    return <PendingApprovalView />;
  }

  if (showLogin) {
    return <LoginScreen onLoginSuccess={() => setShowLogin(false)} />;
  }

  return <MainLayout onLogout={() => setShowLogin(true)} />;
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
