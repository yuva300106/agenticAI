import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Activity,
  GraduationCap,
  UserCheck,
  Shield,
  Briefcase,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  LogIn,
  UserPlus,
  Building2,
  Lock,
  Mail,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Database,
  ExternalLink,
  ChevronRight,
  Info,
  Clock,
  Eye,
  EyeOff,
} from 'lucide-react';
import {
  signUpStudent,
  requestFacultyAccess,
  requestOrganizationAccess,
  signInUser,
  isRateLimitError,
  getRateLimitExplanation,
} from '../../lib/supabase';
import { SupabaseConfigModal } from '../common/SupabaseConfigModal';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

type AuthMode = 'sign_in' | 'student_signup' | 'faculty_request' | 'org_request' | 'demo_accounts';

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const { switchUserRole, setAuthenticatedUser, addToast, isSupabaseConnected, reloadRequests } = useApp();

  const [authMode, setAuthMode] = useState<AuthMode>('sign_in');
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Loading & error state
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [rateLimitInfo, setRateLimitInfo] = useState<ReturnType<typeof getRateLimitExplanation> | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Form states
  // 1. Sign In
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // 2. Student Self-Registration (Strictly Student)
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [studentDepartment, setStudentDepartment] = useState('CSE');
  const [studentYear, setStudentYear] = useState('III');
  const [studentSection, setStudentSection] = useState('A');

  // 3. Faculty / Club Coordinator Access Request
  const [facultyName, setFacultyName] = useState('');
  const [facultyEmail, setFacultyEmail] = useState('');
  const [facultyPassword, setFacultyPassword] = useState('');
  const [facultyDepartment, setFacultyDepartment] = useState('CSE');
  const [facultyDesignation, setFacultyDesignation] = useState('Associate Professor');
  const [facultySectionOrClub, setFacultySectionOrClub] = useState('CSE-A / DSC Club Mentor');
  const [facultyEmployeeId, setFacultyEmployeeId] = useState('');
  const [facultyJustification, setFacultyJustification] = useState('');

  // 4. External Organization Registration
  const [orgName, setOrgName] = useState('');
  const [orgType, setOrgType] = useState('Company');
  const [orgRepName, setOrgRepName] = useState('');
  const [orgDesignation, setOrgDesignation] = useState('University Relations Lead');
  const [orgEmail, setOrgEmail] = useState('');
  const [orgPassword, setOrgPassword] = useState('');
  const [orgPhone, setOrgPhone] = useState('');
  const [orgWebsite, setOrgWebsite] = useState('');
  const [orgVerification, setOrgVerification] = useState('');
  const [orgIntent, setOrgIntent] = useState('');

  const clearMessages = () => {
    setErrorMessage(null);
    setRateLimitInfo(null);
    setSuccessNotice(null);
  };

  // Handle Demo Account Select
  const handleSelectRole = (role: UserRole) => {
    clearMessages();
    switchUserRole(role);
    onLoginSuccess();
  };

  // 1. Handle Sign In
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!signInEmail || !signInPassword) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await signInUser(signInEmail.trim(), signInPassword);
      if (res.user && res.profile) {
        setAuthenticatedUser(res.profile);
        addToast(`Welcome back, ${res.profile.name}!`, 'success');
        onLoginSuccess();
      } else if (res.user && !res.profile) {
        // Fallback if user_profiles row hasn't been generated yet
        addToast('Signed in. Setting up student workspace profile...', 'info');
        switchUserRole('student');
        onLoginSuccess();
      }
    } catch (err: any) {
      if (isRateLimitError(err)) {
        setRateLimitInfo(getRateLimitExplanation());
      } else {
        const msg = err.message || 'Invalid email or password.';
        setErrorMessage(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Handle Public Student Registration (Locked to student)
  const handleStudentSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!studentName || !studentEmail || !studentPassword) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (studentPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      await signUpStudent({
        fullName: studentName.trim(),
        email: studentEmail.trim(),
        password: studentPassword,
        department: studentDepartment,
        year: studentYear,
        section: studentSection,
      });

      setSuccessNotice(
        'Student account registered successfully! You can now sign in with your email and password.'
      );
      setAuthMode('sign_in');
      setSignInEmail(studentEmail);
    } catch (err: any) {
      if (isRateLimitError(err)) {
        setRateLimitInfo(getRateLimitExplanation());
      } else {
        setErrorMessage(err.message || 'Registration failed. Please check details.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Handle Faculty Access Request (Pending until Admin approves)
  const handleFacultyRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!facultyName || !facultyEmail || !facultyPassword || !facultyEmployeeId) {
      setErrorMessage('Please fill in all required fields including Employee Code.');
      return;
    }

    setIsLoading(true);

    try {
      await requestFacultyAccess({
        fullName: facultyName.trim(),
        email: facultyEmail.trim(),
        password: facultyPassword,
        department: facultyDepartment,
        designation: facultyDesignation,
        assignedSectionOrClub: facultySectionOrClub,
        employeeId: facultyEmployeeId.trim(),
        justification: facultyJustification || 'Faculty coordinator request',
      });

      setSuccessNotice(
        'Faculty access request registered! Your request status is now PENDING and awaiting verification by the Head of Department (HOD) or Campus Administrator.'
      );
      reloadRequests();
      setAuthMode('sign_in');
      setSignInEmail(facultyEmail);
    } catch (err: any) {
      if (isRateLimitError(err)) {
        setRateLimitInfo(getRateLimitExplanation());
      } else {
        setErrorMessage(err.message || 'Faculty request failed.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Handle External Organization Registration (Pending until Admin approves)
  const handleOrgRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!orgName || !orgEmail || !orgPassword || !orgVerification) {
      setErrorMessage('Please fill in Organization Name, Work Email, Password, and Verification details.');
      return;
    }

    setIsLoading(true);

    try {
      await requestOrganizationAccess({
        organizationName: orgName.trim(),
        orgType,
        representativeName: orgRepName.trim(),
        designation: orgDesignation,
        workEmail: orgEmail.trim(),
        password: orgPassword,
        phone: orgPhone,
        website: orgWebsite,
        verificationDetails: orgVerification,
        partnershipIntent: orgIntent || 'Host student hackathons and internships',
      });

      setSuccessNotice(
        'Organization registration submitted! Your request is PENDING and awaiting corporate verification by the Campus Placement & Administration Office.'
      );
      reloadRequests();
      setAuthMode('sign_in');
      setSignInEmail(orgEmail);
    } catch (err: any) {
      if (isRateLimitError(err)) {
        setRateLimitInfo(getRateLimitExplanation());
      } else {
        setErrorMessage(err.message || 'Organization registration failed.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white flex flex-col justify-between relative overflow-hidden">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="max-w-7xl mx-auto w-full p-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Activity className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              CampusPulse
            </span>
            <span className="hidden sm:inline-block ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Role-Based Authentication
            </span>
          </div>
        </div>

        {/* Supabase Status & Setup Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowConfigModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition shadow"
          >
            <Database className={`w-3.5 h-3.5 ${isSupabaseConnected ? 'text-emerald-400' : 'text-amber-400'}`} />
            <span>{isSupabaseConnected ? 'Live Supabase DB' : 'Supabase (Demo Mode)'}</span>
            <span
              className={`w-2 h-2 rounded-full ${
                isSupabaseConnected ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
            />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto w-full px-4 py-6 z-10 my-auto space-y-6">
        {/* Title & Brand Slogan */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/15 text-blue-300 border border-blue-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Opportunity &amp; Engagement Intelligence</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Institutional Portal Access
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Secure Role-Based Authentication with Row Level Security (RLS) &amp; Institutional Governance
          </p>

          {!isSupabaseConnected && (
            <div className="max-w-md mx-auto mt-2 px-3 py-1 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 text-[11px] flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Running in Built-In Demo Mode (Local Store)</span>
              </span>
              <button
                onClick={() => setShowConfigModal(true)}
                className="text-cyan-400 hover:underline font-semibold text-[10px]"
              >
                Connect Supabase ↗
              </button>
            </div>
          )}
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 bg-slate-900/90 border border-slate-800 rounded-2xl max-w-2xl mx-auto backdrop-blur-md">
          <button
            onClick={() => {
              setAuthMode('sign_in');
              clearMessages();
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              authMode === 'sign_in'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>

          <button
            onClick={() => {
              setAuthMode('student_signup');
              clearMessages();
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              authMode === 'student_signup'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Create Account</span>
          </button>

          <button
            onClick={() => {
              setAuthMode('faculty_request');
              clearMessages();
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              authMode === 'faculty_request'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Faculty Request</span>
          </button>

          <button
            onClick={() => {
              setAuthMode('org_request');
              clearMessages();
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              authMode === 'org_request'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Organization Request</span>
          </button>

          <button
            onClick={() => {
              setAuthMode('demo_accounts');
              clearMessages();
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              authMode === 'demo_accounts'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant Demo</span>
          </button>
        </div>

        {/* Global Rate Limit Alert Box (Requirement 8) */}
        {rateLimitInfo && (
          <div className="max-w-xl mx-auto bg-amber-950/40 border border-amber-500/50 rounded-2xl p-5 shadow-2xl backdrop-blur-md space-y-3 animate-slide-up">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-amber-200">{rateLimitInfo.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{rateLimitInfo.cause}</p>
              </div>
            </div>

            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-xs space-y-2">
              <div className="font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>How to resolve in Supabase Dashboard (1-click fix):</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-slate-300 text-[11px] pl-1">
                {rateLimitInfo.solutionSteps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={() => setAuthMode('demo_accounts')}
                className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Continue with Instant Demo Accounts</span>
              </button>
              <button
                onClick={() => setShowConfigModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
              >
                Open Setup Guide
              </button>
            </div>
          </div>
        )}

        {/* Global Error Notice */}
        {errorMessage && (
          <div className="max-w-xl mx-auto p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Global Success Notice */}
        {successNotice && (
          <div className="max-w-xl mx-auto p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* TAB 1: SIGN IN */}
        {authMode === 'sign_in' && (
          <div className="max-w-md mx-auto bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
            <div className="mb-5">
              <h2 className="text-xl font-bold text-white">Sign In to CampusPulse</h2>
              <p className="text-xs text-slate-400 mt-1">
                Enter your credentials to load your verified institutional role and dashboard.
              </p>
            </div>

            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    placeholder="student@college.edu or partner@company.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300 text-xs"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In to Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-col gap-2 text-center text-xs text-slate-400">
              <div>
                New student?{' '}
                <button
                  onClick={() => setAuthMode('student_signup')}
                  className="text-blue-400 font-bold hover:underline"
                >
                  Create Student Account
                </button>
              </div>
              <div className="text-[11px] text-slate-500">
                Evaluating the prototype? Use{' '}
                <button
                  onClick={() => setAuthMode('demo_accounts')}
                  className="text-purple-400 hover:underline font-semibold"
                >
                  Instant Demo Accounts
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CREATE STUDENT ACCOUNT (Public Self-Registration strictly Student - Requirement 2) */}
        {authMode === 'student_signup' && (
          <div className="max-w-md mx-auto bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
            <div className="mb-5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-500/15 text-blue-300 border border-blue-500/30 mb-2">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Public Self-Registration: Student Only</span>
              </div>
              <h2 className="text-xl font-bold text-white">Create Student Account</h2>
              <p className="text-xs text-slate-400 mt-1">
                Public self-registration strictly assigns Student permissions. Privileged roles require HOD/Admin verification.
              </p>
            </div>

            <form onSubmit={handleStudentSignUp} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  College Email Address
                </label>
                <input
                  type="email"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  placeholder="student@engg.edu"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={studentPassword}
                  onChange={(e) => setStudentPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-1">
                    Department
                  </label>
                  <select
                    value={studentDepartment}
                    onChange={(e) => setStudentDepartment(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none"
                  >
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="MECH">MECH</option>
                    <option value="CIVIL">CIVIL</option>
                    <option value="AI&DS">AI&DS</option>
                    <option value="IT">IT</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-1">
                    Year
                  </label>
                  <select
                    value={studentYear}
                    onChange={(e) => setStudentYear(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none"
                  >
                    <option value="I">Year I</option>
                    <option value="II">Year II</option>
                    <option value="III">Year III</option>
                    <option value="IV">Year IV</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-1">
                    Section
                  </label>
                  <select
                    value={studentSection}
                    onChange={(e) => setStudentSection(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none"
                  >
                    <option value="A">Sec A</option>
                    <option value="B">Sec B</option>
                    <option value="C">Sec C</option>
                  </select>
                </div>
              </div>

              {/* Role lock notice */}
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-850 text-[11px] text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>
                  Role is strictly locked to <strong>Student</strong> per campus security policy.
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition"
              >
                {isLoading ? 'Creating Student Account...' : 'Register Student Account'}
              </button>
            </form>

            <div className="mt-5 text-center text-xs text-slate-400">
              Already registered?{' '}
              <button
                onClick={() => setAuthMode('sign_in')}
                className="text-blue-400 font-bold hover:underline"
              >
                Sign In
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: FACULTY / COORDINATOR ACCESS REQUEST (Requirement 3) */}
        {authMode === 'faculty_request' && (
          <div className="max-w-lg mx-auto bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
            <div className="mb-5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 mb-2">
                <UserCheck className="w-3.5 h-3.5" />
                <span>Institutional Governance</span>
              </div>
              <h2 className="text-xl font-bold text-white">Faculty &amp; Coordinator Access Request</h2>
              <p className="text-xs text-slate-400 mt-1">
                New requests remain in a <strong>Pending Approval</strong> state until verified by the Head of Department (HOD) or Campus Administrator.
              </p>
            </div>

            <form onSubmit={handleFacultyRequest} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Faculty Full Name
                  </label>
                  <input
                    type="text"
                    value={facultyName}
                    onChange={(e) => setFacultyName(e.target.value)}
                    placeholder="Dr. Priya Rao"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Employee ID / Code
                  </label>
                  <input
                    type="text"
                    value={facultyEmployeeId}
                    onChange={(e) => setFacultyEmployeeId(e.target.value)}
                    placeholder="EMP-CSE-2024-09"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Official College Email
                  </label>
                  <input
                    type="email"
                    value={facultyEmail}
                    onChange={(e) => setFacultyEmail(e.target.value)}
                    placeholder="priya.rao@engg.edu"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={facultyPassword}
                    onChange={(e) => setFacultyPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Academic Department
                  </label>
                  <select
                    value={facultyDepartment}
                    onChange={(e) => setFacultyDepartment(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none"
                  >
                    <option value="CSE">Computer Science &amp; Engineering</option>
                    <option value="ECE">Electronics &amp; Communication</option>
                    <option value="MECH">Mechanical Engineering</option>
                    <option value="CIVIL">Civil Engineering</option>
                    <option value="AI&DS">Artificial Intelligence &amp; Data Science</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={facultyDesignation}
                    onChange={(e) => setFacultyDesignation(e.target.value)}
                    placeholder="Associate Professor / Club Coordinator"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Assigned Cohort / Club Mentorship
                </label>
                <input
                  type="text"
                  value={facultySectionOrClub}
                  onChange={(e) => setFacultySectionOrClub(e.target.value)}
                  placeholder="e.g. CSE-A Class In-charge or Robotics Club Mentor"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Justification / Request Purpose
                </label>
                <textarea
                  rows={2}
                  value={facultyJustification}
                  onChange={(e) => setFacultyJustification(e.target.value)}
                  placeholder="e.g. Class coordinator for CSE-A; require access to track engagement intelligence and notify students of mandatory department workshops."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 flex items-start gap-2">
                <Clock className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  After submission, your account will be marked <strong>Pending</strong>. You will be able to log in to track approval status, but coordinator dashboards unlock once an Admin signs off.
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition"
              >
                {isLoading ? 'Submitting Request...' : 'Submit Faculty Access Request'}
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: EXTERNAL ORGANIZATION REGISTRATION (Requirement 4) */}
        {authMode === 'org_request' && (
          <div className="max-w-lg mx-auto bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
            <div className="mb-5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/15 text-amber-400 border border-amber-500/30 mb-2">
                <Building2 className="w-3.5 h-3.5" />
                <span>Corporate &amp; External Partner Verification</span>
              </div>
              <h2 className="text-xl font-bold text-white">External Organization Registration</h2>
              <p className="text-xs text-slate-400 mt-1">
                Organizations must provide verification details. Accounts remain pending until reviewed and approved by college authorities.
              </p>
            </div>

            <form onSubmit={handleOrgRequest} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Organization / Company Name
                  </label>
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="TechNova Innovations"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Organization Type
                  </label>
                  <select
                    value={orgType}
                    onChange={(e) => setOrgType(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none"
                  >
                    <option value="Company">Corporate / Company</option>
                    <option value="Startup">Early-Stage Startup</option>
                    <option value="Non-Profit">Non-Profit Foundation</option>
                    <option value="Research Lab">Research Laboratory</option>
                    <option value="Community">Open-Source Community</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Representative Name
                  </label>
                  <input
                    type="text"
                    value={orgRepName}
                    onChange={(e) => setOrgRepName(e.target.value)}
                    placeholder="e.g. Vikram Seth"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Representative Designation
                  </label>
                  <input
                    type="text"
                    value={orgDesignation}
                    onChange={(e) => setOrgDesignation(e.target.value)}
                    placeholder="Head of Campus Relations"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Corporate Work Email
                  </label>
                  <input
                    type="email"
                    value={orgEmail}
                    onChange={(e) => setOrgEmail(e.target.value)}
                    placeholder="partnerships@technova.io"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={orgPassword}
                    onChange={(e) => setOrgPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Official Website URL
                  </label>
                  <input
                    type="text"
                    value={orgWebsite}
                    onChange={(e) => setOrgWebsite(e.target.value)}
                    placeholder="https://technova.io"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Work Phone (Optional)
                  </label>
                  <input
                    type="text"
                    value={orgPhone}
                    onChange={(e) => setOrgPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Verification Credentials / Registration Proof
                </label>
                <input
                  type="text"
                  value={orgVerification}
                  onChange={(e) => setOrgVerification(e.target.value)}
                  placeholder="e.g. MCA CIN, Delaware Entity #, Official LinkedIn Company page"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Partnership Intent / Opportunities Planned
                </label>
                <textarea
                  rows={2}
                  value={orgIntent}
                  onChange={(e) => setOrgIntent(e.target.value)}
                  placeholder="e.g. Propose to host annual AI Hackathon and offer summer internship interview tracks for CSE & ECE students."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  The account remains <strong>Pending</strong> until an Administrator confirms legitimacy. Posting opportunities and campus access will be granted once approved.
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30 transition"
              >
                {isLoading ? 'Submitting Organization...' : 'Submit Organization Verification Request'}
              </button>
            </form>
          </div>
        )}

        {/* TAB 5: INSTANT DEMO ACCOUNTS (Preserving existing hackathon evaluation accounts) */}
        {authMode === 'demo_accounts' && (
          <div className="space-y-4">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">
              Select a pre-configured verified role to evaluate the platform:
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
              {/* Student */}
              <div className="bg-slate-900/90 border border-slate-800 hover:border-blue-500/60 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-blue-950/40 group">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-3">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1">
                    Role: Student
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition">
                    Aarav Sharma
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">aarav@campuspulse.demo</p>
                  <div className="mt-3 text-[11px] text-slate-400 bg-slate-950 p-2 rounded-xl border border-slate-850">
                    CSE • Year III • Section A
                  </div>
                </div>

                <button
                  onClick={() => handleSelectRole('student')}
                  className="mt-5 w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow"
                >
                  <span>Launch Student Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Faculty */}
              <div className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/60 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-emerald-950/40 group">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1">
                    Role: Faculty Coordinator
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition">
                    Dr. Priya Rao
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">priya.rao@campuspulse.demo</p>
                  <div className="mt-3 text-[11px] text-slate-400 bg-slate-950 p-2 rounded-xl border border-slate-850">
                    Dept: CSE • Assigned: CSE-A
                  </div>
                </div>

                <button
                  onClick={() => handleSelectRole('faculty')}
                  className="mt-5 w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow"
                >
                  <span>Launch Faculty Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Admin */}
              <div className="bg-slate-900/90 border border-slate-800 hover:border-purple-500/60 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-purple-950/40 group">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-3">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-1">
                    Role: College Admin
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition">
                    Campus Admin
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">admin@campuspulse.demo</p>
                  <div className="mt-3 text-[11px] text-slate-400 bg-slate-950 p-2 rounded-xl border border-slate-850">
                    HOD &amp; Role Approvals
                  </div>
                </div>

                <button
                  onClick={() => handleSelectRole('admin')}
                  className="mt-5 w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow"
                >
                  <span>Launch Admin Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* External Partner */}
              <div className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/60 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-amber-950/40 group">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-1">
                    Role: External Partner
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition">
                    TechNova Innovations
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">partnerships@technova.io</p>
                  <div className="mt-3 text-[11px] text-cyan-300 bg-slate-950 p-2 rounded-xl border border-slate-850 flex items-center gap-1 font-semibold">
                    <ShieldCheck className="w-3 h-3 text-cyan-400" />
                    <span>Verified Partner</span>
                  </div>
                </div>

                <button
                  onClick={() => handleSelectRole('external_partner')}
                  className="mt-5 w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow"
                >
                  <span>Launch Partner Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full p-6 text-center text-xs text-slate-500 border-t border-slate-900 z-10 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          CampusPulse • Secure Role-Based Access Control • Row Level Security Enforced
        </div>
        <button
          onClick={() => setShowConfigModal(true)}
          className="text-cyan-400 hover:underline flex items-center gap-1"
        >
          <Database className="w-3 h-3" />
          <span>Supabase Dashboard Settings &amp; Testing Guide</span>
        </button>
      </footer>

      {/* Supabase Config & Testing Guide Modal */}
      <SupabaseConfigModal isOpen={showConfigModal} onClose={() => setShowConfigModal(false)} />
    </div>
  );
};
