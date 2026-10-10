import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  CampusEvent,
  ClassEngagement,
  ExternalPermissionRequest,
  AgentActivityLogItem,
  CampusNotification,
  StudentStats,
  FacultyAccessRequest,
  OrganizationAccessRequest,
} from '../types';
import {
  DEMO_USERS,
  INITIAL_EVENTS,
  INITIAL_CLASSES,
  INITIAL_EXTERNAL_REQUESTS,
  INITIAL_AGENT_LOGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_FACULTY_REQUESTS,
  INITIAL_ORG_REQUESTS,
} from '../data/mockData';
import {
  getSupabaseClient,
  fetchUserProfile,
  approveFacultyRequestInDb,
  rejectFacultyRequestInDb,
  approveOrgRequestInDb,
  rejectOrgRequestInDb,
  getLocalFacultyRequests,
  getLocalOrgRequests,
} from '../lib/supabase';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface AppContextType {
  currentUser: User;
  switchUserRole: (role: UserRole) => void;
  setAuthenticatedUser: (user: User) => void;
  signOutUser: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  isPendingApproval: boolean;
  isRejected: boolean;
  isSupabaseConnected: boolean;
  checkSupabaseConnection: () => Promise<boolean>;

  events: CampusEvent[];
  interestedEventIds: string[];
  registeredEventIds: string[];
  attendedEventIds: string[];
  feedbackGiven: Record<string, { rating: number; comment: string }>;
  studentStats: StudentStats;
  classes: ClassEngagement[];
  externalRequests: ExternalPermissionRequest[];
  agentLogs: AgentActivityLogItem[];
  notifications: CampusNotification[];
  selectedEventForModal: CampusEvent | null;
  setSelectedEventForModal: (evt: CampusEvent | null) => void;
  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;

  // Student Actions
  toggleInterest: (eventId: string) => void;
  registerForEvent: (eventId: string) => void;
  cancelRegistration: (eventId: string) => void;
  markAttended: (eventId: string) => void;
  submitFeedback: (eventId: string, rating: number, comment: string) => void;
  triggerMissedOpportunityRescue: (eventId: string) => void;

  // Faculty Actions
  sendFacultyMessage: (classId: string, message: string) => void;

  // Admin Role Approvals (Requirement 5)
  pendingFacultyRequests: FacultyAccessRequest[];
  pendingOrgRequests: OrganizationAccessRequest[];
  reloadRequests: () => void;
  approveFacultyAccess: (requestId: string) => Promise<void>;
  rejectFacultyAccess: (requestId: string, reason: string) => Promise<void>;
  approveOrgAccess: (requestId: string) => Promise<void>;
  rejectOrgAccess: (requestId: string, reason: string) => Promise<void>;

  // Admin Event Requests
  approveExternalRequest: (requestId: string, validUntil?: string) => void;
  rejectExternalRequest: (requestId: string, reason?: string) => void;

  // External Partner Actions
  submitExternalRequest: (reqData: Partial<ExternalPermissionRequest>) => void;
  createExternalEvent: (eventData: Partial<CampusEvent>, requestId: string) => boolean;
  toggleSimulatedExpiry: (requestId: string) => void;

  // Notifications
  markNotificationAsRead: (notifId: string) => void;
  dismissNotification: (notifId: string) => void;
  clearAllNotifications: () => void;

  // Navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('campuspulse_role');
    return (saved && DEMO_USERS[saved]) ? DEMO_USERS[saved] : DEMO_USERS.student;
  });

  const [activeTab, setActiveTab] = useState<string>('home');
  const [events, setEvents] = useState<CampusEvent[]>(INITIAL_EVENTS);
  const [classes, setClasses] = useState<ClassEngagement[]>(INITIAL_CLASSES);
  const [externalRequests, setExternalRequests] = useState<ExternalPermissionRequest[]>(
    INITIAL_EXTERNAL_REQUESTS
  );
  const [pendingFacultyRequests, setPendingFacultyRequests] = useState<FacultyAccessRequest[]>(() =>
    getLocalFacultyRequests()
  );
  const [pendingOrgRequests, setPendingOrgRequests] = useState<OrganizationAccessRequest[]>(() =>
    getLocalOrgRequests()
  );
  const [agentLogs, setAgentLogs] = useState<AgentActivityLogItem[]>(INITIAL_AGENT_LOGS);
  const [notifications, setNotifications] = useState<CampusNotification[]>(INITIAL_NOTIFICATIONS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [selectedEventForModal, setSelectedEventForModal] = useState<CampusEvent | null>(null);

  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(false);

  // Student action state
  const [interestedEventIds, setInterestedEventIds] = useState<string[]>([
    'evt-01',
    'evt-02',
    'evt-03',
    'evt-04',
    'evt-06',
    'evt-10',
    'evt-12',
  ]);

  const [registeredEventIds, setRegisteredEventIds] = useState<string[]>([
    'evt-02',
    'evt-04',
    'evt-10',
  ]);

  const [attendedEventIds, setAttendedEventIds] = useState<string[]>([
    'evt-04',
    'evt-10',
  ]);

  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, { rating: number; comment: string }>>({
    'evt-04': { rating: 5, comment: 'Exceptional system architecture insights by the speaker.' },
  });

  const isPendingApproval = currentUser.status === 'pending';
  const isRejected = currentUser.status === 'rejected';

  // Check connection to Supabase
  const checkSupabaseConnection = async (): Promise<boolean> => {
    const client = getSupabaseClient();
    if (!client) {
      setIsSupabaseConnected(false);
      return false;
    }
    try {
      const { error } = await client.from('user_profiles').select('id').limit(1);
      // If error mentions table doesn't exist, Supabase is connected but schema needs run
      const ok = !error || !error.message.includes('FetchError');
      setIsSupabaseConnected(ok);
      return ok;
    } catch {
      setIsSupabaseConnected(false);
      return false;
    }
  };

  // Sync Supabase session on mount
  useEffect(() => {
    checkSupabaseConnection();

    const client = getSupabaseClient();
    if (!client) return;

    // Check active session
    client.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user.id).then((profile) => {
          if (profile) {
            setAuthenticatedUser(profile);
          }
        });
      }
    });

    const { data: authListener } = client.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id);
        if (profile) {
          setAuthenticatedUser(profile);
        }
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const addToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = 'toast_' + Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addAgentLog = (
    agentName: AgentActivityLogItem['agentName'],
    action: string,
    detail: string,
    type: AgentActivityLogItem['type'] = 'info'
  ) => {
    const newLog: AgentActivityLogItem = {
      id: 'log_' + Date.now(),
      agentName,
      action,
      detail,
      timestamp: 'Just now',
      type,
    };
    setAgentLogs((prev) => [newLog, ...prev]);
  };

  // Set authenticated user from trusted database record
  const setAuthenticatedUser = (user: User) => {
    setCurrentUser(user);
    if (user.status === 'pending') {
      // User is pending; dashboard navigation will display PendingApprovalView
      return;
    }
    // Route to appropriate dashboard based on approved role
    if (user.role === 'student') setActiveTab('home');
    else if (user.role === 'faculty') setActiveTab('faculty_dashboard');
    else if (user.role === 'admin') setActiveTab('admin_overview');
    else if (user.role === 'external_partner') setActiveTab('partner_dashboard');
  };

  const refreshProfile = async () => {
    const client = getSupabaseClient();
    if (client && currentUser.id) {
      const updated = await fetchUserProfile(currentUser.id);
      if (updated) {
        setAuthenticatedUser(updated);
      }
    }
  };

  const signOutUser = async () => {
    const client = getSupabaseClient();
    if (client) {
      try {
        await client.auth.signOut();
      } catch (err) {
        console.warn('Sign out error:', err);
      }
    }
    // Reset to default student demo user
    setCurrentUser(DEMO_USERS.student);
    setActiveTab('home');
    addToast('Signed out of CampusPulse.', 'info');
  };

  const switchUserRole = (role: UserRole) => {
    if (DEMO_USERS[role]) {
      setCurrentUser(DEMO_USERS[role]);
      localStorage.setItem('campuspulse_role', role);

      if (role === 'student') setActiveTab('home');
      else if (role === 'faculty') setActiveTab('faculty_dashboard');
      else if (role === 'admin') setActiveTab('admin_overview');
      else if (role === 'external_partner') setActiveTab('partner_dashboard');

      addToast(`Switched account to ${DEMO_USERS[role].name} (${role.toUpperCase()})`, 'info');
    }
  };

  // Student: Toggle interest
  const toggleInterest = (eventId: string) => {
    const isCurrentlyInterested = interestedEventIds.includes(eventId);
    const targetEvent = events.find((e) => e.id === eventId);
    const eventName = targetEvent?.title || 'Event';

    if (isCurrentlyInterested) {
      setInterestedEventIds((prev) => prev.filter((id) => id !== eventId));
      addToast(`Removed "${eventName}" from your interested list.`, 'info');
    } else {
      setInterestedEventIds((prev) => [...prev, eventId]);
      addToast(`Marked "${eventName}" as Interested!`, 'success');
      addAgentLog(
        'Opportunity Matching Agent',
        `Student indicated interest in ${eventName}`,
        `Stored intent flag. Tracking registration deadline to safeguard against missed opportunity.`,
        'info'
      );

      if (eventId === 'evt-01' || targetEvent?.isClosingSoon) {
        setTimeout(() => {
          triggerMissedOpportunityRescue(eventId);
        }, 1200);
      }
    }
  };

  // Student: Trigger rescue notification
  const triggerMissedOpportunityRescue = (eventId: string) => {
    const targetEvent = events.find((e) => e.id === eventId) || events[0];
    const notifId = 'notif_missed_' + eventId;

    const existing = notifications.find((n) => n.id === notifId);
    if (!existing) {
      const newNotif: CampusNotification = {
        id: notifId,
        title: `⚠️ Opportunity Alert: ${targetEvent.title}`,
        message: `You showed interest in ${targetEvent.title}, but haven't registered yet! Registration closes in a few hours.`,
        timestamp: 'Just now',
        read: false,
        type: 'missed_rescue',
        eventId: targetEvent.id,
        actionButton: {
          label: 'Register Now',
          action: 'register',
        },
      };

      setNotifications((prev) => [newNotif, ...prev]);
      addAgentLog(
        'Missed Opportunity Rescue Agent',
        `Triggered opportunity rescue alert for ${targetEvent.title}`,
        `Identified 8 hours remaining to deadline with student interest flag set. Dispatched high-priority action card.`,
        'warning'
      );
      addToast(`⚠️ Alert: Registration for ${targetEvent.title} closes in a few hours!`, 'warning');
    }
  };

  // Student: Register for event
  const registerForEvent = (eventId: string) => {
    const targetEvent = events.find((e) => e.id === eventId);
    const eventName = targetEvent?.title || 'Event';

    if (!registeredEventIds.includes(eventId)) {
      setRegisteredEventIds((prev) => [...prev, eventId]);

      setEvents((prev) =>
        prev.map((e) => (e.id === eventId ? { ...e, registeredCount: e.registeredCount + 1 } : e))
      );

      addToast(`🎉 Successfully registered for ${eventName}!`, 'success');

      setNotifications((prev) =>
        prev.map((n) => {
          if (n.eventId === eventId && n.type === 'missed_rescue') {
            return {
              ...n,
              title: `✓ Registration Confirmed`,
              message: `You're registered for ${eventName} 🎉`,
              timestamp: 'Just now',
              type: 'registered',
              actionButton: undefined,
            };
          }
          return n;
        })
      );

      addAgentLog(
        'Missed Opportunity Rescue Agent',
        `Successfully converted interest into registration for ${eventName}`,
        `Student rescued from missing deadline. Updated registration ledger and class cohort metrics.`,
        'success'
      );
    }
  };

  const cancelRegistration = (eventId: string) => {
    const targetEvent = events.find((e) => e.id === eventId);
    setRegisteredEventIds((prev) => prev.filter((id) => id !== eventId));
    addToast(`Cancelled registration for ${targetEvent?.title || 'Event'}.`, 'info');
  };

  const markAttended = (eventId: string) => {
    const targetEvent = events.find((e) => e.id === eventId);
    const eventName = targetEvent?.title || 'Event';
    if (!attendedEventIds.includes(eventId)) {
      setAttendedEventIds((prev) => [...prev, eventId]);
      addToast(`Marked attendance verified for ${eventName}! Points added.`, 'success');
      addAgentLog(
        'Engagement Intelligence Agent',
        `Verified attendance for ${eventName}`,
        `Recalculated engagement score and updated aggregate attendance index.`,
        'success'
      );
    }
  };

  const submitFeedback = (eventId: string, rating: number, comment: string) => {
    setFeedbackGiven((prev) => ({
      ...prev,
      [eventId]: { rating, comment },
    }));
    addToast('Thank you! Your feedback has been recorded (+15% score factor).', 'success');
    addAgentLog(
      'Engagement Intelligence Agent',
      'Logged qualitative feedback for opportunity',
      `Feedback score: ${rating}/5 stars. Factored into semester engagement rating.`,
      'info'
    );
  };

  // Faculty actions
  const sendFacultyMessage = (classId: string, message: string) => {
    setClasses((prev) =>
      prev.map((c) =>
        c.id === classId
          ? {
              ...c,
              lastMessageSent: message,
              messageTimestamp: 'Just now',
            }
          : c
      )
    );

    const targetClass = classes.find((c) => c.id === classId);
    addToast(`Message dispatched to ${targetClass?.name || 'Class'} students!`, 'success');
    addAgentLog(
      'Faculty Communication Agent',
      `Delivered personalized faculty advisory to ${targetClass?.name}`,
      `Dispatched via push broadcast. Monitored student read receipt telemetry.`,
      'info'
    );
  };

  // Admin Role Approvals (Requirement 5)
  const approveFacultyAccess = async (requestId: string) => {
    setPendingFacultyRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'approved',
              reviewedAt: new Date().toISOString(),
              reviewedBy: currentUser.id,
            }
          : r
      )
    );

    const req = pendingFacultyRequests.find((r) => r.id === requestId);
    const facultyName = req?.fullName || 'Faculty Member';

    // If Supabase connected, sync to database
    try {
      await approveFacultyRequestInDb(requestId, currentUser.id);
    } catch (err) {
      console.warn('Database sync error (mock fallback active):', err);
    }

    addToast(`✓ Approved Faculty Coordinator: ${facultyName}. Access granted!`, 'success');
    addAgentLog(
      'External Verification Agent',
      `Approved faculty coordinator privilege for ${facultyName}`,
      `Role updated to faculty coordinator. Department portal access unlocked.`,
      'success'
    );
  };

  const rejectFacultyAccess = async (requestId: string, reason: string) => {
    setPendingFacultyRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'rejected',
              rejectionReason: reason,
              reviewedAt: new Date().toISOString(),
              reviewedBy: currentUser.id,
            }
          : r
      )
    );

    const req = pendingFacultyRequests.find((r) => r.id === requestId);
    try {
      await rejectFacultyRequestInDb(requestId, reason, currentUser.id);
    } catch (err) {
      console.warn('Database sync error (mock fallback active):', err);
    }

    addToast(`Faculty request declined: ${reason}`, 'warning');
    addAgentLog(
      'External Verification Agent',
      `Declined faculty access request for ${req?.fullName || requestId}`,
      `Reason: ${reason}`,
      'warning'
    );
  };

  const reloadRequests = () => {
    setPendingFacultyRequests(getLocalFacultyRequests());
    setPendingOrgRequests(getLocalOrgRequests());
  };

  const approveOrgAccess = async (requestId: string) => {
    setPendingOrgRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'approved',
              reviewedAt: new Date().toISOString(),
              reviewedBy: currentUser.id,
            }
          : r
      )
    );

    const req = pendingOrgRequests.find((r) => r.id === requestId);
    const orgName = req?.organizationName || 'External Partner';

    try {
      await approveOrgRequestInDb(requestId, currentUser.id);
    } catch (err) {
      console.warn('Database sync error (mock fallback active):', err);
    }

    addToast(`✓ Verified & Approved Partner: ${orgName}!`, 'success');
    addAgentLog(
      'External Verification Agent',
      `Verified and approved external organization: ${orgName}`,
      `Granted Verified Partner status. Permitted to submit student opportunities.`,
      'success'
    );
  };

  const rejectOrgAccess = async (requestId: string, reason: string) => {
    setPendingOrgRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'rejected',
              rejectionReason: reason,
              reviewedAt: new Date().toISOString(),
              reviewedBy: currentUser.id,
            }
          : r
      )
    );

    const req = pendingOrgRequests.find((r) => r.id === requestId);
    try {
      await rejectOrgRequestInDb(requestId, reason, currentUser.id);
    } catch (err) {
      console.warn('Database sync error (mock fallback active):', err);
    }

    addToast(`Organization request declined: ${reason}`, 'warning');
    addAgentLog(
      'External Verification Agent',
      `Declined organization verification for ${req?.organizationName || requestId}`,
      `Reason: ${reason}`,
      'warning'
    );
  };

  // Admin Event Approvals
  const approveExternalRequest = (requestId: string, validUntil?: string) => {
    const expiry = validUntil || '15 Nov 2026';
    setExternalRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'Approved',
              reviewedAt: 'Today',
              validFrom: '01 Oct 2026',
              validUntil: expiry,
              isExpired: false,
            }
          : r
      )
    );

    const req = externalRequests.find((r) => r.id === requestId);
    const org = req?.organizationName || 'External Partner';

    addToast(`✓ Approved request for ${org}! Temporary posting access granted until ${expiry}.`, 'success');
    addAgentLog(
      'External Verification Agent',
      `Approved temporary posting permission for ${org}`,
      `Authority validated credentials. Posting window open until ${expiry}. Audience restricted by college.`,
      'success'
    );
  };

  const rejectExternalRequest = (requestId: string, reason = 'Did not meet college standards') => {
    setExternalRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'Rejected',
              reviewedAt: 'Today',
            }
          : r
      )
    );
    addToast(`Request rejected: ${reason}`, 'warning');
    addAgentLog(
      'External Verification Agent',
      `Rejected partner request (${requestId})`,
      `Reason: ${reason}. Notification dispatched to partner liaison.`,
      'warning'
    );
  };

  const toggleSimulatedExpiry = (requestId: string) => {
    setExternalRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          const newExpiredState = !r.isExpired;
          return {
            ...r,
            isExpired: newExpiredState,
          };
        }
        return r;
      })
    );

    const target = externalRequests.find((r) => r.id === requestId);
    const willBeExpired = !target?.isExpired;

    if (willBeExpired) {
      addToast(`Posting access for ${target?.organizationName} is now EXPIRED!`, 'warning');
      addAgentLog(
        'External Verification Agent',
        `Revoked posting access due to permission window expiry`,
        `Posting time-bound token expired. Further creation or modification blocked.`,
        'alert'
      );
    } else {
      addToast(`Posting access for ${target?.organizationName} is now ACTIVE!`, 'success');
    }
  };

  // External partner actions
  const submitExternalRequest = (reqData: Partial<ExternalPermissionRequest>) => {
    const newReq: ExternalPermissionRequest = {
      id: 'req-' + Date.now(),
      organizationName: reqData.organizationName || 'TechNova Innovations',
      organizationType: reqData.organizationType || 'Company',
      officialEmail: reqData.officialEmail || 'partnerships@technova.io',
      contactPerson: reqData.contactPerson || 'Campus Relations Team',
      phone: reqData.phone || '+91 98765 43210',
      website: reqData.website || 'https://technova.io',
      authorityTarget: reqData.authorityTarget || 'Training & Placement Coordinator',
      eventTitle: reqData.eventTitle || 'Tech Opportunity',
      eventDescription: reqData.eventDescription || 'Exciting student opportunity.',
      eventCategory: reqData.eventCategory || 'Hackathon',
      eventDate: reqData.eventDate || '25 Oct 2026',
      registrationDeadline: reqData.registrationDeadline || '23 Oct 2026',
      targetDepartment: reqData.targetDepartment || 'CSE',
      targetYear: reqData.targetYear || 'III',
      targetSections: reqData.targetSections || 'A, B',
      registrationLink: reqData.registrationLink || 'https://technova.io',
      reasonForRequest: reqData.reasonForRequest || 'College recruitment collaboration',
      status: 'Pending Approval',
      submittedAt: 'Today',
    };

    setExternalRequests((prev) => [newReq, ...prev]);
    addToast(`Request submitted for ${newReq.eventTitle}! Pending college review.`, 'success');
    addAgentLog(
      'External Verification Agent',
      `Received new permission request from ${newReq.organizationName}`,
      `Routing to ${newReq.authorityTarget} for compliance validation.`,
      'info'
    );
  };

  const createExternalEvent = (eventData: Partial<CampusEvent>, requestId: string): boolean => {
    const req = externalRequests.find((r) => r.id === requestId);
    if (!req) return false;

    if (req.status !== 'Approved' || req.isExpired) {
      addToast('Cannot publish: Posting permission is inactive or expired.', 'error');
      return false;
    }

    const newEvt: CampusEvent = {
      id: 'evt-ext-' + Date.now(),
      title: eventData.title || req.eventTitle,
      organizer: req.organizationName,
      category: req.eventCategory,
      date: req.eventDate,
      time: '10:00 AM - 04:00 PM',
      deadline: req.registrationDeadline,
      location: 'Virtual / TechNova Portal',
      mode: 'Online',
      source: 'verified_external',
      isInternal: false,
      isVerifiedExternal: true,
      isRecommended: true,
      isClosingSoon: false,
      whyRecommended: `Vetted by ${req.authorityTarget} for ${req.targetDepartment} Year ${req.targetYear}.`,
      targetDepartment: [req.targetDepartment],
      targetYear: [req.targetYear],
      targetSections: req.targetSections.split(',').map((s) => s.trim()),
      skills: eventData.skills || ['AI Systems', 'Full Stack', 'Cloud'],
      description: eventData.description || req.eventDescription,
      eligibility: `Audience selected by College: ${req.targetDepartment} Year ${req.targetYear} (Sections ${req.targetSections})`,
      registeredCount: 0,
      maxSeats: eventData.maxSeats || 100,
      externalPostingId: req.id,
      pointsWeight: { technical: 7, competitive: 8, industry: 7, leadership: 4 },
    };

    setEvents((prev) => [newEvt, ...prev]);
    addToast(`✓ Event "${newEvt.title}" published to student dashboard!`, 'success');
    addAgentLog(
      'Opportunity Matching Agent',
      `Published vetted external opportunity: ${newEvt.title}`,
      `Audience restricted to College-approved cohort: ${req.targetDepartment} Year ${req.targetYear}.`,
      'success'
    );
    return true;
  };

  const markNotificationAsRead = (notifId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
    );
  };

  const dismissNotification = (notifId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notifId));
    addToast('Notification dismissed', 'info');
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    addToast('All notifications cleared', 'info');
  };

  // Deterministic Student Stats calculation
  const calculateStudentStats = (): StudentStats => {
    const baseInterestCount = 21 + (interestedEventIds.length - 7);
    const baseRegCount = 16 + (registeredEventIds.length - 3);
    const baseAttendCount = 12 + (attendedEventIds.length - 2);
    const feedbackCount = Object.keys(feedbackGiven).length;

    const engagementScore = Math.min(
      98,
      Math.max(
        60,
        Math.round(
          (baseInterestCount / 24) * 20 +
            (baseRegCount / 18) * 25 +
            (baseAttendCount / 14) * 40 +
            (Math.min(feedbackCount, 5) / 5) * 15
        )
      )
    );

    const technical = 72;
    const competitive = 48 + (registeredEventIds.includes('evt-03') ? 6 : 0);
    const industry = 61;
    const leadership = 38 + (registeredEventIds.includes('evt-06') ? 7 : 0);
    const overallCareerExposure = Math.round(
      (technical * 0.35 + competitive * 0.25 + industry * 0.25 + leadership * 0.15)
    );

    return {
      engagementScore: engagementScore || 78,
      careerExposureScore: overallCareerExposure || 64,
      technical,
      competitive,
      industry,
      leadership,
      eventsAttendedCount: baseAttendCount,
      registrationsCount: baseRegCount,
      interestsCount: baseInterestCount,
      missedCount: 4,
      categoryCounts: {
        workshops: 6,
        hackathons: 3,
        competitions: 2,
        seminars: 4,
        clubEvents: 5,
        internships: 1,
      },
    };
  };

  const studentStats = calculateStudentStats();

  return (
    <AppContext.Provider
      value={{
        currentUser,
        switchUserRole,
        setAuthenticatedUser,
        signOutUser,
        refreshProfile,
        isPendingApproval,
        isRejected,
        isSupabaseConnected,
        checkSupabaseConnection,
        events,
        interestedEventIds,
        registeredEventIds,
        attendedEventIds,
        feedbackGiven,
        studentStats,
        classes,
        externalRequests,
        pendingFacultyRequests,
        pendingOrgRequests,
        reloadRequests,
        approveFacultyAccess,
        rejectFacultyAccess,
        approveOrgAccess,
        rejectOrgAccess,
        agentLogs,
        notifications,
        selectedEventForModal,
        setSelectedEventForModal,
        toasts,
        addToast,
        removeToast,
        toggleInterest,
        registerForEvent,
        cancelRegistration,
        markAttended,
        submitFeedback,
        triggerMissedOpportunityRescue,
        sendFacultyMessage,
        approveExternalRequest,
        rejectExternalRequest,
        submitExternalRequest,
        createExternalEvent,
        toggleSimulatedExpiry,
        markNotificationAsRead,
        dismissNotification,
        clearAllNotifications,
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
