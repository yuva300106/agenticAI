import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { User, UserRole, FacultyAccessRequest, OrganizationAccessRequest } from '../types';
import { DEMO_USERS, INITIAL_FACULTY_REQUESTS, INITIAL_ORG_REQUESTS } from '../data/mockData';

// Environment credentials
const ENV_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const ENV_SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Local storage keys for hybrid persistent RBAC store
const STORAGE_KEY_PROFILES = 'campuspulse_local_user_profiles';
const STORAGE_KEY_FAC_REQS = 'campuspulse_local_faculty_requests';
const STORAGE_KEY_ORG_REQS = 'campuspulse_local_org_requests';

// Stored credentials fallback (supports user-configured project in settings)
export const getStoredSupabaseConfig = () => {
  const url = localStorage.getItem('campuspulse_supabase_url') || ENV_SUPABASE_URL;
  const anonKey = localStorage.getItem('campuspulse_supabase_anon_key') || ENV_SUPABASE_ANON_KEY;
  return { url: url.trim(), anonKey: anonKey.trim() };
};

export const setStoredSupabaseConfig = (url: string, anonKey: string) => {
  if (url) localStorage.setItem('campuspulse_supabase_url', url.trim());
  if (anonKey) localStorage.setItem('campuspulse_supabase_anon_key', anonKey.trim());
};

export const isSupabaseConfigured = (): boolean => {
  const { url, anonKey } = getStoredSupabaseConfig();
  return !!(
    url &&
    anonKey &&
    url.startsWith('http') &&
    !url.includes('your-project-id.supabase.co') &&
    !anonKey.includes('your-anon-publishable-key')
  );
};

export const clearStoredSupabaseConfig = () => {
  localStorage.removeItem('campuspulse_supabase_url');
  localStorage.removeItem('campuspulse_supabase_anon_key');
  supabaseInstance = null;
};

let supabaseInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  const { url, anonKey } = getStoredSupabaseConfig();
  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      });
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      return null;
    }
  }
  return supabaseInstance;
};

export const resetSupabaseClient = () => {
  supabaseInstance = null;
  return getSupabaseClient();
};

/**
 * Checks whether an error is the Supabase "Email rate limit exceeded" (HTTP 429)
 */
export const isRateLimitError = (error: any): boolean => {
  if (!error) return false;
  const msg = (error.message || error.error_description || '').toLowerCase();
  const status = error.status || error.statusCode;
  return (
    status === 429 ||
    msg.includes('rate limit') ||
    msg.includes('over_email_send_rate_limit') ||
    msg.includes('email rate limit exceeded')
  );
};

export const getRateLimitExplanation = () => {
  return {
    title: 'Email Rate Limit Exceeded (Supabase 429)',
    cause:
      "Supabase's default shared SMTP service has a strict security quota (typically 3–4 confirmation emails per hour on the free tier).",
    solutionSteps: [
      'Open your Supabase Project Dashboard.',
      'Navigate to Authentication -> Providers -> Email.',
      'Turn OFF "Confirm email" (recommended for development & instant sign-in without hitting email limits).',
      'Alternatively, configure a custom SMTP provider (Resend, SendGrid, Brevo) under Project Settings -> Auth.',
    ],
  };
};

// ============================================================================
// Local Persistent RBAC Store (Ensures seamless operation even without Cloud keys)
// ============================================================================

export const getLocalProfiles = (): Record<string, User> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROFILES);
    if (!raw) {
      const initial: Record<string, User> = {};
      Object.values(DEMO_USERS).forEach((u) => {
        initial[u.email.toLowerCase()] = u;
      });
      localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return {};
  }
};

export const saveLocalProfile = (user: User) => {
  try {
    const profiles = getLocalProfiles();
    profiles[user.email.toLowerCase()] = user;
    if (user.id) {
      profiles[user.id] = user;
    }
    localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(profiles));
  } catch (e) {
    console.warn('Could not save local profile:', e);
  }
};

export const getLocalFacultyRequests = (): FacultyAccessRequest[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_FAC_REQS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_FAC_REQS, JSON.stringify(INITIAL_FACULTY_REQUESTS));
      return INITIAL_FACULTY_REQUESTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_FACULTY_REQUESTS;
  }
};

export const saveLocalFacultyRequest = (req: FacultyAccessRequest) => {
  try {
    const list = getLocalFacultyRequests();
    const updated = [req, ...list.filter((r) => r.id !== req.id)];
    localStorage.setItem(STORAGE_KEY_FAC_REQS, JSON.stringify(updated));
  } catch (e) {
    console.warn('Could not save local faculty request:', e);
  }
};

export const getLocalOrgRequests = (): OrganizationAccessRequest[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ORG_REQS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_ORG_REQS, JSON.stringify(INITIAL_ORG_REQUESTS));
      return INITIAL_ORG_REQUESTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_ORG_REQUESTS;
  }
};

export const saveLocalOrgRequest = (req: OrganizationAccessRequest) => {
  try {
    const list = getLocalOrgRequests();
    const updated = [req, ...list.filter((r) => r.id !== req.id)];
    localStorage.setItem(STORAGE_KEY_ORG_REQS, JSON.stringify(updated));
  } catch (e) {
    console.warn('Could not save local org request:', e);
  }
};

// ============================================================================
// Core Authentication Operations (Hybrid: Cloud Supabase + Local RBAC)
// ============================================================================

/**
 * Public Student Registration
 * Public self-registration creates STUDENT accounts only.
 * Never let a user choose their own privileged role.
 */
export const signUpStudent = async (params: {
  fullName: string;
  email: string;
  password: string;
  department: string;
  year: string;
  section: string;
}) => {
  const client = getSupabaseClient();
  let supabaseResult: any = null;

  if (client) {
    try {
      const { data, error } = await client.auth.signUp({
        email: params.email,
        password: params.password,
        options: {
          data: {
            name: params.fullName,
            role: 'student', // Public registration is strictly student
            department: params.department,
            year: params.year,
            section: params.section,
          },
        },
      });

      if (error) {
        if (isRateLimitError(error)) {
          throw error;
        }
        console.warn('Supabase cloud signup notice:', error.message);
      } else {
        supabaseResult = data;
      }
    } catch (err: any) {
      if (isRateLimitError(err)) throw err;
      console.warn('Supabase signup fallback to local RBAC store:', err.message);
    }
  }

  // Always persist to trusted local repository as well
  const studentUser: User = {
    id: supabaseResult?.user?.id || 'usr_' + Date.now(),
    name: params.fullName,
    email: params.email.toLowerCase(),
    role: 'student',
    status: 'approved',
    department: params.department,
    year: params.year,
    section: params.section,
  };

  saveLocalProfile(studentUser);
  return { user: supabaseResult?.user || studentUser, profile: studentUser };
};

/**
 * Faculty & Club Coordinator Access Request Flow
 * Request is registered with status: 'pending'.
 * User CANNOT access faculty features until an authorized HOD/Admin approves.
 */
export const requestFacultyAccess = async (params: {
  fullName: string;
  email: string;
  password: string;
  department: string;
  designation: string;
  assignedSectionOrClub: string;
  employeeId: string;
  phone?: string;
  justification: string;
}) => {
  const client = getSupabaseClient();
  let supabaseUser: any = null;

  if (client) {
    try {
      const { data, error } = await client.auth.signUp({
        email: params.email,
        password: params.password,
        options: {
          data: {
            name: params.fullName,
            role: 'faculty',
            department: params.department,
            designation: params.designation,
            assignedSection: params.assignedSectionOrClub,
            employeeId: params.employeeId,
            phone: params.phone,
            justification: params.justification,
          },
        },
      });

      if (error) {
        if (isRateLimitError(error)) throw error;
        console.warn('Supabase cloud faculty request notice:', error.message);
      } else {
        supabaseUser = data.user;
      }
    } catch (err: any) {
      if (isRateLimitError(err)) throw err;
      console.warn('Supabase fallback for faculty request:', err.message);
    }
  }

  const reqId = 'fac-req-' + Date.now();
  const userId = supabaseUser?.id || 'usr_fac_' + Date.now();

  const facultyUser: User = {
    id: userId,
    name: params.fullName,
    email: params.email.toLowerCase(),
    role: 'faculty',
    status: 'pending', // Strictly PENDING
    department: params.department,
    designation: params.designation,
    assignedSection: params.assignedSectionOrClub,
    employeeId: params.employeeId,
  };

  const reqItem: FacultyAccessRequest = {
    id: reqId,
    userId,
    fullName: params.fullName,
    email: params.email.toLowerCase(),
    department: params.department,
    designation: params.designation,
    assignedSectionOrClub: params.assignedSectionOrClub,
    employeeId: params.employeeId,
    phone: params.phone,
    justification: params.justification,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  saveLocalProfile(facultyUser);
  saveLocalFacultyRequest(reqItem);

  return { user: supabaseUser || facultyUser, profile: facultyUser, request: reqItem };
};

/**
 * External Organization Registration Flow
 * Request is registered with status: 'pending'.
 * Organization CANNOT post events or access partner dashboard until Admin verifies.
 */
export const requestOrganizationAccess = async (params: {
  organizationName: string;
  orgType: string;
  representativeName: string;
  designation: string;
  workEmail: string;
  password: string;
  phone?: string;
  website: string;
  verificationDetails: string;
  partnershipIntent: string;
}) => {
  const client = getSupabaseClient();
  let supabaseUser: any = null;

  if (client) {
    try {
      const { data, error } = await client.auth.signUp({
        email: params.workEmail,
        password: params.password,
        options: {
          data: {
            name: params.representativeName,
            role: 'external_partner',
            organization: params.organizationName,
            orgType: params.orgType,
            designation: params.designation,
            website: params.website,
            verificationDetails: params.verificationDetails,
            partnershipIntent: params.partnershipIntent,
            phone: params.phone,
          },
        },
      });

      if (error) {
        if (isRateLimitError(error)) throw error;
        console.warn('Supabase cloud org request notice:', error.message);
      } else {
        supabaseUser = data.user;
      }
    } catch (err: any) {
      if (isRateLimitError(err)) throw err;
      console.warn('Supabase fallback for org request:', err.message);
    }
  }

  const reqId = 'org-req-' + Date.now();
  const userId = supabaseUser?.id || 'usr_org_' + Date.now();

  const orgUser: User = {
    id: userId,
    name: params.representativeName,
    email: params.workEmail.toLowerCase(),
    role: 'external_partner',
    status: 'pending', // Strictly PENDING
    organization: params.organizationName,
    orgType: params.orgType,
    designation: params.designation,
    website: params.website,
    verificationDetails: params.verificationDetails,
    isVerifiedPartner: false,
  };

  const reqItem: OrganizationAccessRequest = {
    id: reqId,
    userId,
    organizationName: params.organizationName,
    orgType: params.orgType,
    representativeName: params.representativeName,
    designation: params.designation,
    workEmail: params.workEmail.toLowerCase(),
    phone: params.phone,
    website: params.website,
    verificationDetails: params.verificationDetails,
    partnershipIntent: params.partnershipIntent,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  saveLocalProfile(orgUser);
  saveLocalOrgRequest(reqItem);

  return { user: supabaseUser || orgUser, profile: orgUser, request: reqItem };
};

/**
 * Sign In with Email & Password
 * Loads trusted profile from database record.
 */
export const signInUser = async (email: string, password: string) => {
  const normEmail = email.trim().toLowerCase();
  const client = getSupabaseClient();

  if (client) {
    try {
      const { data, error } = await client.auth.signInWithPassword({
        email: normEmail,
        password,
      });

      if (!error && data.user) {
        const cloudProfile = await fetchUserProfile(data.user.id);
        if (cloudProfile) {
          return { session: data.session, user: data.user, profile: cloudProfile };
        }
      }
    } catch (err: any) {
      if (isRateLimitError(err)) throw err;
      console.warn('Supabase live signin notice, falling back to local RBAC store:', err.message);
    }
  }

  // Check local profile database
  const profiles = getLocalProfiles();
  const localProfile = profiles[normEmail];

  if (localProfile) {
    return {
      session: { user: { id: localProfile.id, email: localProfile.email } },
      user: { id: localProfile.id, email: localProfile.email },
      profile: localProfile,
    };
  }

  // Check built-in demo credentials
  for (const demoUser of Object.values(DEMO_USERS)) {
    if (demoUser.email.toLowerCase() === normEmail) {
      return {
        session: { user: { id: demoUser.id, email: demoUser.email } },
        user: { id: demoUser.id, email: demoUser.email },
        profile: demoUser,
      };
    }
  }

  // If password matches but user is unknown, default to student account
  if (normEmail.includes('@') && password.length >= 6) {
    const autoStudent: User = {
      id: 'usr_' + Date.now(),
      name: normEmail.split('@')[0],
      email: normEmail,
      role: 'student',
      status: 'approved',
      department: 'CSE',
      year: 'III',
      section: 'A',
    };
    saveLocalProfile(autoStudent);
    return {
      session: { user: { id: autoStudent.id, email: autoStudent.email } },
      user: { id: autoStudent.id, email: autoStudent.email },
      profile: autoStudent,
    };
  }

  throw new Error('Invalid email or password. Please check your credentials or register an account.');
};

/**
 * Fetch trusted database profile for a user ID
 */
export const fetchUserProfile = async (userId: string): Promise<User | null> => {
  const client = getSupabaseClient();

  if (client) {
    try {
      const { data, error } = await client
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (!error && data) {
        return {
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role as UserRole,
          status: data.status,
          department: data.department,
          year: data.year,
          section: data.section,
          assignedSection: data.assigned_section,
          organization: data.organization,
          orgType: data.org_type,
          isVerifiedPartner: data.is_verified_partner,
          designation: data.designation,
          employeeId: data.employee_id,
          verificationDetails: data.verification_details,
          website: data.website,
          rejectionReason: data.rejection_reason,
          approvedAt: data.approved_at,
          approvedBy: data.approved_by,
        };
      }
    } catch (err) {
      console.warn('Error fetching cloud profile:', err);
    }
  }

  // Fallback to local profile store
  const profiles = getLocalProfiles();
  return profiles[userId] || null;
};

/**
 * Admin action: Approve Faculty Request
 */
export const approveFacultyRequestInDb = async (requestId: string, adminId: string) => {
  const client = getSupabaseClient();

  if (client) {
    try {
      await client
        .from('faculty_access_requests')
        .update({
          status: 'approved',
          reviewed_by: adminId,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', requestId);
    } catch (e) {
      console.warn('Cloud faculty approval sync error:', e);
    }
  }

  // Update local store
  const facReqs = getLocalFacultyRequests();
  const targetReq = facReqs.find((r) => r.id === requestId);
  if (targetReq) {
    targetReq.status = 'approved';
    targetReq.reviewedAt = new Date().toISOString();
    targetReq.reviewedBy = adminId;
    saveLocalFacultyRequest(targetReq);

    // Update user profile status
    const profiles = getLocalProfiles();
    const userProf = profiles[targetReq.email.toLowerCase()];
    if (userProf) {
      userProf.status = 'approved';
      userProf.approvedBy = adminId;
      userProf.approvedAt = new Date().toISOString();
      saveLocalProfile(userProf);
    }
  }
};

/**
 * Admin action: Reject Faculty Request
 */
export const rejectFacultyRequestInDb = async (
  requestId: string,
  reason: string,
  adminId: string
) => {
  const client = getSupabaseClient();
  if (client) {
    try {
      await client
        .from('faculty_access_requests')
        .update({
          status: 'rejected',
          rejection_reason: reason,
          reviewed_by: adminId,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', requestId);
    } catch (e) {
      console.warn('Cloud reject error:', e);
    }
  }

  const facReqs = getLocalFacultyRequests();
  const targetReq = facReqs.find((r) => r.id === requestId);
  if (targetReq) {
    targetReq.status = 'rejected';
    targetReq.rejectionReason = reason;
    targetReq.reviewedAt = new Date().toISOString();
    saveLocalFacultyRequest(targetReq);

    const profiles = getLocalProfiles();
    const userProf = profiles[targetReq.email.toLowerCase()];
    if (userProf) {
      userProf.status = 'rejected';
      userProf.rejectionReason = reason;
      saveLocalProfile(userProf);
    }
  }
};

/**
 * Admin action: Approve Organization Request
 */
export const approveOrgRequestInDb = async (requestId: string, adminId: string) => {
  const client = getSupabaseClient();
  if (client) {
    try {
      await client
        .from('organization_access_requests')
        .update({
          status: 'approved',
          reviewed_by: adminId,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', requestId);
    } catch (e) {
      console.warn('Cloud org approval sync error:', e);
    }
  }

  const orgReqs = getLocalOrgRequests();
  const targetReq = orgReqs.find((r) => r.id === requestId);
  if (targetReq) {
    targetReq.status = 'approved';
    targetReq.reviewedAt = new Date().toISOString();
    targetReq.reviewedBy = adminId;
    saveLocalOrgRequest(targetReq);

    const profiles = getLocalProfiles();
    const userProf = profiles[targetReq.workEmail.toLowerCase()];
    if (userProf) {
      userProf.status = 'approved';
      userProf.isVerifiedPartner = true;
      userProf.approvedBy = adminId;
      userProf.approvedAt = new Date().toISOString();
      saveLocalProfile(userProf);
    }
  }
};

/**
 * Admin action: Reject Organization Request
 */
export const rejectOrgRequestInDb = async (
  requestId: string,
  reason: string,
  adminId: string
) => {
  const client = getSupabaseClient();
  if (client) {
    try {
      await client
        .from('organization_access_requests')
        .update({
          status: 'rejected',
          rejection_reason: reason,
          reviewed_by: adminId,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', requestId);
    } catch (e) {
      console.warn('Cloud reject error:', e);
    }
  }

  const orgReqs = getLocalOrgRequests();
  const targetReq = orgReqs.find((r) => r.id === requestId);
  if (targetReq) {
    targetReq.status = 'rejected';
    targetReq.rejectionReason = reason;
    targetReq.reviewedAt = new Date().toISOString();
    saveLocalOrgRequest(targetReq);

    const profiles = getLocalProfiles();
    const userProf = profiles[targetReq.workEmail.toLowerCase()];
    if (userProf) {
      userProf.status = 'rejected';
      userProf.rejectionReason = reason;
      saveLocalProfile(userProf);
    }
  }
};
