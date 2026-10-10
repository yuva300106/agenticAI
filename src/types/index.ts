export type UserRole = 'student' | 'faculty' | 'admin' | 'external_partner';
export type UserStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status?: UserStatus;
  department?: string;
  year?: string;
  section?: string;
  assignedSection?: string;
  organization?: string;
  orgType?: string;
  isVerifiedPartner?: boolean;
  designation?: string;
  employeeId?: string;
  verificationDetails?: string;
  website?: string;
  rejectionReason?: string;
  approvedAt?: string;
  approvedBy?: string;
}

export interface FacultyAccessRequest {
  id: string;
  userId?: string;
  fullName: string;
  email: string;
  department: string;
  designation: string;
  assignedSectionOrClub: string;
  employeeId: string;
  phone?: string;
  justification: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface OrganizationAccessRequest {
  id: string;
  userId?: string;
  organizationName: string;
  orgType: string;
  representativeName: string;
  designation: string;
  workEmail: string;
  phone?: string;
  website: string;
  verificationDetails: string;
  partnershipIntent: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export type EventCategory =
  | 'Workshop'
  | 'Hackathon'
  | 'Competition'
  | 'Seminar'
  | 'Internship'
  | 'Scholarship'
  | 'Club Event'
  | 'Industry';

export type EventSource = 'internal' | 'verified_external' | 'external_source';

export interface CampusEvent {
  id: string;
  title: string;
  organizer: string;
  category: EventCategory;
  date: string;
  time: string;
  deadline: string;
  location: string;
  mode: 'Online' | 'Offline' | 'Hybrid';
  source: EventSource;
  isInternal: boolean;
  isVerifiedExternal: boolean;
  isRecommended: boolean;
  isClosingSoon: boolean;
  whyRecommended?: string;
  targetDepartment: string[];
  targetYear: string[];
  targetSections: string[];
  skills: string[];
  description: string;
  eligibility: string;
  externalPostingId?: string;
  registrationUrl?: string;
  maxSeats?: number;
  registeredCount: number;
  pointsWeight: {
    technical: number;
    competitive: number;
    industry: number;
    leadership: number;
  };
}

export interface StudentStats {
  engagementScore: number; // e.g. 78%
  careerExposureScore: number; // e.g. 64 / 100
  technical: number; // e.g. 72
  competitive: number; // e.g. 48
  industry: number; // e.g. 61
  leadership: number; // e.g. 38
  eventsAttendedCount: number;
  registrationsCount: number;
  interestsCount: number;
  missedCount: number;
  categoryCounts: {
    workshops: number;
    hackathons: number;
    competitions: number;
    seminars: number;
    clubEvents: number;
    internships: number;
  };
}

export interface ClassEngagement {
  id: string;
  department: string;
  year: string;
  section: string;
  name: string; // e.g. 'CSE-A'
  studentCount: number;
  engagementScore: number;
  status: 'Highly Engaged' | 'Engaged — Needs Improvement' | 'Low Engagement';
  interestRate: number;
  registrationRate: number;
  attendanceRate: number;
  feedbackRate: number;
  facultyCoordinator: string;
  lastMessageSent?: string;
  messageTimestamp?: string;
}

export type CollegeAuthority =
  | 'Principal / Administrator'
  | 'Training & Placement Coordinator'
  | 'Relevant HOD'
  | 'Club Faculty Coordinator';

export interface ExternalPermissionRequest {
  id: string;
  organizationName: string;
  organizationType: string;
  officialEmail: string;
  contactPerson: string;
  phone: string;
  website: string;
  authorityTarget: CollegeAuthority;
  eventTitle: string;
  eventDescription: string;
  eventCategory: EventCategory;
  eventDate: string;
  registrationDeadline: string;
  targetDepartment: string;
  targetYear: string;
  targetSections: string;
  registrationLink: string;
  reasonForRequest: string;
  status: 'Pending Approval' | 'Approved' | 'Rejected';
  validFrom?: string;
  validUntil?: string;
  submittedAt: string;
  reviewedAt?: string;
  isExpired?: boolean;
}

export interface AgentActivityLogItem {
  id: string;
  agentName:
    | 'Opportunity Matching Agent'
    | 'Missed Opportunity Rescue Agent'
    | 'Engagement Intelligence Agent'
    | 'Faculty Communication Agent'
    | 'External Verification Agent'
    | 'Career Insight Agent'
    | 'Pulse AI Assistant';
  action: string;
  detail: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'alert';
}

export interface CampusNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'missed_rescue' | 'registered' | 'recommendation' | 'engagement' | 'faculty' | 'partner';
  eventId?: string;
  actionButton?: {
    label: string;
    action: 'register' | 'view_event' | 'dismiss';
  };
}
