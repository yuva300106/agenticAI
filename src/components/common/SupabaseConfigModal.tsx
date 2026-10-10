import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Database,
  CheckCircle2,
  AlertTriangle,
  Copy,
  ExternalLink,
  ShieldCheck,
  X,
  Sparkles,
  KeyRound,
  Terminal,
  Settings,
  Flame,
} from 'lucide-react';
import {
  getStoredSupabaseConfig,
  setStoredSupabaseConfig,
  clearStoredSupabaseConfig,
  resetSupabaseClient,
  isSupabaseConfigured,
} from '../../lib/supabase';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({ isOpen, onClose }) => {
  const { addToast, isSupabaseConnected, checkSupabaseConnection } = useApp();
  const currentConfig = getStoredSupabaseConfig();

  const [url, setUrl] = useState(currentConfig.url);
  const [anonKey, setAnonKey] = useState(currentConfig.anonKey);
  const [copied, setCopied] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleSaveConfig = async () => {
    setStoredSupabaseConfig(url, anonKey);
    resetSupabaseClient();
    addToast('Supabase configuration saved.', 'success');
    await handleTest();
  };

  const handleResetToDemo = () => {
    clearStoredSupabaseConfig();
    setUrl('');
    setAnonKey('');
    resetSupabaseClient();
    setTestResult({
      success: true,
      message: 'Active mode: Built-In Offline Demo Mode. All student, faculty, admin, and partner flows work instantly without cloud configuration.',
    });
    addToast('Running in Built-In Demo Mode.', 'info');
  };

  const handleTest = async () => {
    setTestingConnection(true);
    setTestResult(null);

    const cleanUrl = url.trim();
    const cleanKey = anonKey.trim();

    if (!cleanUrl || !cleanKey || !cleanUrl.startsWith('http') || cleanUrl.includes('your-project-id.supabase.co')) {
      setTestResult({
        success: false,
        message: 'Supabase is not configured yet. Please check project URL & Anon Key, or use the "Built-In Demo Mode" button to test all roles offline.',
      });
      setTestingConnection(false);
      return;
    }

    try {
      const isOk = await checkSupabaseConnection();
      if (isOk) {
        setTestResult({
          success: true,
          message: 'Connection to Supabase project confirmed! Authentication and API are operational.',
        });
      } else {
        setTestResult({
          success: false,
          message:
            'Could not reach Supabase with these credentials or user_profiles table not initialized yet. Please check project URL and anon key, and ensure SQL schema is executed.',
        });
      }
    } catch (e: any) {
      setTestResult({
        success: false,
        message: e.message || 'Connection test failed. Please verify project URL & Anon Key.',
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const copySqlSchema = () => {
    const sql = `-- CampusPulse: Secure Role-Based Access Control (RBAC) & Profiles
-- Run in Supabase SQL Editor:
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'faculty', 'admin', 'external_partner')),
  status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
  department TEXT,
  year TEXT,
  section TEXT,
  assigned_section TEXT,
  organization TEXT,
  org_type TEXT,
  verification_details TEXT,
  designation TEXT,
  employee_id TEXT,
  website TEXT,
  rejection_reason TEXT,
  is_verified_partner BOOLEAN DEFAULT false,
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.faculty_access_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  department TEXT NOT NULL,
  designation TEXT NOT NULL,
  assigned_section_or_club TEXT NOT NULL,
  employee_id TEXT NOT NULL,
  phone TEXT,
  justification TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.organization_access_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  organization_name TEXT NOT NULL,
  org_type TEXT NOT NULL,
  representative_name TEXT NOT NULL,
  designation TEXT NOT NULL,
  work_email TEXT NOT NULL,
  phone TEXT,
  website TEXT,
  verification_details TEXT NOT NULL,
  partnership_intent TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty_access_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_access_requests ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin' AND status = 'approved');
END;
$$;

CREATE OR REPLACE FUNCTION public.is_faculty()
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'faculty' AND status = 'approved');
END;
$$;

DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
CREATE POLICY "Users can view own profile" ON public.user_profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
CREATE POLICY "Admins can view all profiles" ON public.user_profiles FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Faculty can view student profiles" ON public.user_profiles;
CREATE POLICY "Faculty can view student profiles" ON public.user_profiles FOR SELECT USING (public.is_faculty() AND role = 'student');

DROP POLICY IF EXISTS "Users can update own non-privileged profile data" ON public.user_profiles;
CREATE POLICY "Users can update own non-privileged profile data" ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND
    role = (SELECT role FROM public.user_profiles WHERE id = auth.uid()) AND
    status = (SELECT status FROM public.user_profiles WHERE id = auth.uid())
  );

DROP POLICY IF EXISTS "Admins can update any profile" ON public.user_profiles;
CREATE POLICY "Admins can update any profile" ON public.user_profiles FOR UPDATE USING (public.is_admin());

DROP POLICY IF EXISTS "Faculty can view own access request" ON public.faculty_access_requests;
CREATE POLICY "Faculty can view own access request" ON public.faculty_access_requests FOR SELECT USING (auth.uid() = user_id OR email = (SELECT email FROM auth.users WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Admins can view and manage all faculty access requests" ON public.faculty_access_requests;
CREATE POLICY "Admins can view and manage all faculty access requests" ON public.faculty_access_requests FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Anyone authenticated can insert a faculty access request" ON public.faculty_access_requests;
CREATE POLICY "Anyone authenticated can insert a faculty access request" ON public.faculty_access_requests FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Organizations can view own access request" ON public.organization_access_requests;
CREATE POLICY "Organizations can view own access request" ON public.organization_access_requests FOR SELECT USING (auth.uid() = user_id OR work_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Admins can view and manage all organization requests" ON public.organization_access_requests;
CREATE POLICY "Admins can view and manage all organization requests" ON public.organization_access_requests FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Anyone authenticated can insert an organization request" ON public.organization_access_requests;
CREATE POLICY "Anyone authenticated can insert an organization request" ON public.organization_access_requests FOR INSERT WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  req_role TEXT;
  assigned_role TEXT;
  assigned_status TEXT;
  user_name TEXT;
BEGIN
  req_role := LOWER(COALESCE(new.raw_user_meta_data->>'role', 'student'));
  user_name := COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1));

  IF req_role = 'faculty' THEN
    assigned_role := 'faculty';
    assigned_status := 'pending';
  ELSIF req_role = 'external_partner' THEN
    assigned_role := 'external_partner';
    assigned_status := 'pending';
  ELSE
    assigned_role := 'student';
    assigned_status := 'approved';
  END IF;

  INSERT INTO public.user_profiles (
    id, email, name, role, status, department, year, section, assigned_section,
    organization, org_type, verification_details, designation, employee_id, website, is_verified_partner
  ) VALUES (
    new.id, new.email, user_name, assigned_role, assigned_status,
    new.raw_user_meta_data->>'department', new.raw_user_meta_data->>'year',
    new.raw_user_meta_data->>'section', new.raw_user_meta_data->>'assignedSection',
    new.raw_user_meta_data->>'organization', new.raw_user_meta_data->>'orgType',
    new.raw_user_meta_data->>'verificationDetails', new.raw_user_meta_data->>'designation',
    new.raw_user_meta_data->>'employeeId', new.raw_user_meta_data->>'website', false
  )
  ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, updated_at = NOW();

  IF req_role = 'faculty' THEN
    INSERT INTO public.faculty_access_requests (
      user_id, full_name, email, department, designation, assigned_section_or_club, employee_id, phone, justification
    ) VALUES (
      new.id, user_name, new.email,
      COALESCE(new.raw_user_meta_data->>'department', 'General'),
      COALESCE(new.raw_user_meta_data->>'designation', 'Faculty'),
      COALESCE(new.raw_user_meta_data->>'assignedSection', 'N/A'),
      COALESCE(new.raw_user_meta_data->>'employeeId', 'PENDING'),
      new.raw_user_meta_data->>'phone',
      COALESCE(new.raw_user_meta_data->>'justification', 'Faculty access request')
    );
  END IF;

  IF req_role = 'external_partner' THEN
    INSERT INTO public.organization_access_requests (
      user_id, organization_name, org_type, representative_name, designation, work_email, phone, website, verification_details, partnership_intent
    ) VALUES (
      new.id,
      COALESCE(new.raw_user_meta_data->>'organization', 'Organization'),
      COALESCE(new.raw_user_meta_data->>'orgType', 'Company'),
      user_name,
      COALESCE(new.raw_user_meta_data->>'designation', 'Representative'),
      new.email,
      new.raw_user_meta_data->>'phone',
      COALESCE(new.raw_user_meta_data->>'website', 'N/A'),
      COALESCE(new.raw_user_meta_data->>'verificationDetails', 'Pending verification'),
      COALESCE(new.raw_user_meta_data->>'partnershipIntent', 'Host student opportunities')
    );
  END IF;

  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();`;

    navigator.clipboard.writeText(sql);
    setCopied(true);
    addToast('SQL schema copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/20">
              <Database className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Supabase RBAC & Authentication Setup</h2>
              <p className="text-xs text-slate-400">
                Configuration instructions, rate-limit settings & testing verification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Connection Status Banner */}
        <div
          className={`p-4 rounded-2xl border flex items-start gap-3 ${
            isSupabaseConnected
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
          }`}
        >
          {isSupabaseConnected ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          )}
          <div className="text-xs space-y-1">
            <div className="font-bold">
              {isSupabaseConnected
                ? 'Supabase Project Active & Connected'
                : 'Supabase Project Needs Configuration'}
            </div>
            <p className="text-slate-300 leading-relaxed">
              {isSupabaseConnected
                ? 'Your project is connected. Role-based authentication and database security policies are active.'
                : 'Enter your Supabase URL and publishable Anon Key below to enable live database authentication.'}
            </p>
          </div>
        </div>

        {/* Credentials Form */}
        <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-850">
          <div className="text-xs font-bold text-white flex items-center gap-1.5">
            <KeyRound className="w-4 h-4 text-cyan-400" />
            <span>Supabase Project Credentials</span>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">
              Project URL (<code className="text-slate-300">VITE_SUPABASE_URL</code>)
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://your-project-id.supabase.co"
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-750 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">
              Publishable Anon Key (<code className="text-slate-300">VITE_SUPABASE_ANON_KEY</code>)
            </label>
            <input
              type="text"
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-750 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              onClick={handleSaveConfig}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow transition"
            >
              Save Configuration
            </button>
            <button
              onClick={handleTest}
              disabled={testingConnection}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition"
            >
              {testingConnection ? 'Testing Connection...' : 'Test Connection'}
            </button>
            <button
              onClick={handleResetToDemo}
              className="px-4 py-2 rounded-xl bg-purple-900/60 hover:bg-purple-800/80 border border-purple-500/30 text-purple-200 font-semibold text-xs transition"
              title="Clears keys and enables local persistence demo mode"
            >
              Use Built-In Demo Mode
            </button>
          </div>

          {testResult && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                testResult.success
                  ? 'bg-emerald-950/60 border border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-950/60 border border-rose-500/30 text-rose-300'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}
        </div>

        {/* Dashboard Settings Checklist (Requirement 10 & 8) */}
        <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-850">
          <div className="text-xs font-bold text-white flex items-center gap-1.5">
            <Settings className="w-4 h-4 text-amber-400" />
            <span>Required Supabase Dashboard Settings</span>
          </div>

          <div className="space-y-2 text-xs text-slate-300">
            {/* Step 1: Fix Email Rate Limit */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[10px]">
                  1
                </span>
                <span>Fix "Email Rate Limit Exceeded" (HTTP 429)</span>
              </div>
              <p className="text-[11px] text-slate-400 pl-6 leading-relaxed">
                Supabase free tier rate-limits confirmation emails to ~3/hour. In your Supabase Dashboard:
                go to <strong className="text-white">Authentication → Providers → Email</strong>, and uncheck{' '}
                <strong className="text-amber-300">"Confirm email"</strong>. This allows accounts to log in immediately without sending rate-limited emails during testing!
              </p>
            </div>

            {/* Step 2: Run SQL Schema */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="font-bold text-white flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-[10px]">
                    2
                  </span>
                  <span>Execute Database Schema &amp; RLS Policies</span>
                </div>
                <button
                  onClick={copySqlSchema}
                  className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] flex items-center gap-1 transition"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copied ? 'Copied!' : 'Copy SQL Schema'}</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400 pl-6 leading-relaxed">
                Go to <strong className="text-white">Supabase Dashboard → SQL Editor → New Query</strong>, paste the schema, and click <strong className="text-emerald-400">Run</strong>. This creates the <code className="text-slate-300">user_profiles</code> table, security definer triggers, and RLS policies.
              </p>
            </div>

            {/* Step 3: Bootstrap Initial Admin */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-[10px]">
                  3
                </span>
                <span>Bootstrap Initial Admin</span>
              </div>
              <p className="text-[11px] text-slate-400 pl-6 leading-relaxed">
                Sign up with your admin email (e.g. <code className="text-purple-300">admin@campuspulse.demo</code>), then execute in SQL Editor:
              </p>
              <div className="pl-6 pt-1">
                <pre className="bg-slate-950 p-2 rounded-lg border border-slate-800 font-mono text-[10px] text-cyan-300 overflow-x-auto">
{`UPDATE public.user_profiles
SET role = 'admin', status = 'approved'
WHERE email = 'admin@campuspulse.demo';`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Role Testing Verification Guide */}
        <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-850">
          <div className="text-xs font-bold text-white flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>How to Test Each Role in CampusPulse</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px]">
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="font-bold text-blue-400">1. Student Self-Registration</div>
              <p className="text-slate-400">
                Register on "Create Account". Check that role is automatically locked to Student. Immediately lands on Student Dashboard with engagement tracking.
              </p>
            </div>

            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="font-bold text-emerald-400">2. Faculty Access Request</div>
              <p className="text-slate-400">
                Submit on "Request Faculty Access". When signing in, verify user is in "Pending Approval" state. Once approved by Admin, lands on Faculty Dashboard.
              </p>
            </div>

            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="font-bold text-amber-400">3. Organization Registration</div>
              <p className="text-slate-400">
                Submit on "Register Organization". Stays pending until Admin reviews credentials and verifies partner. Once approved, lands on Partner Dashboard.
              </p>
            </div>

            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="font-bold text-purple-400">4. Admin Approval Workflow</div>
              <p className="text-slate-400">
                Log in as Admin. Navigate to "Approvals" tab. Review pending faculty and organization requests. Approve or reject with reason.
              </p>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
