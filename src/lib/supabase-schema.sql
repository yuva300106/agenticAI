-- ==============================================================================
-- CampusPulse: Secure Role-Based Access Control (RBAC) & Profiles
-- Run this complete script in your Supabase Dashboard SQL Editor
-- (Dashboard -> SQL Editor -> New Query -> Run)
-- ==============================================================================

-- 1. Create User Profiles Table
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

-- 2. Create Faculty / Club Coordinator Access Requests Table
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

-- 3. Create External Organization Access Requests Table
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

-- 4. Enable Row Level Security (RLS) on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty_access_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_access_requests ENABLE ROW LEVEL SECURITY;

-- 5. Helper Function: Is Authenticated User an Authorized Admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin' AND status = 'approved'
  );
END;
$$;

-- 6. Helper Function: Is Authenticated User an Approved Faculty
CREATE OR REPLACE FUNCTION public.is_faculty()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'faculty' AND status = 'approved'
  );
END;
$$;

-- 7. RLS Policies: user_profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
CREATE POLICY "Users can view own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
CREATE POLICY "Admins can view all profiles"
  ON public.user_profiles FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "Faculty can view student profiles" ON public.user_profiles;
CREATE POLICY "Faculty can view student profiles"
  ON public.user_profiles FOR SELECT
  USING (public.is_faculty() AND role = 'student');

DROP POLICY IF EXISTS "Users can update own non-privileged profile data" ON public.user_profiles;
CREATE POLICY "Users can update own non-privileged profile data"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND
    role = (SELECT role FROM public.user_profiles WHERE id = auth.uid()) AND
    status = (SELECT status FROM public.user_profiles WHERE id = auth.uid())
  );

DROP POLICY IF EXISTS "Admins can update any profile" ON public.user_profiles;
CREATE POLICY "Admins can update any profile"
  ON public.user_profiles FOR UPDATE
  USING (public.is_admin());

-- 8. RLS Policies: faculty_access_requests
DROP POLICY IF EXISTS "Faculty can view own access request" ON public.faculty_access_requests;
CREATE POLICY "Faculty can view own access request"
  ON public.faculty_access_requests FOR SELECT
  USING (auth.uid() = user_id OR email = (SELECT email FROM auth.users WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Admins can view and manage all faculty access requests" ON public.faculty_access_requests;
CREATE POLICY "Admins can view and manage all faculty access requests"
  ON public.faculty_access_requests FOR ALL
  USING (public.is_admin());

DROP POLICY IF EXISTS "Anyone authenticated can insert a faculty access request" ON public.faculty_access_requests;
CREATE POLICY "Anyone authenticated can insert a faculty access request"
  ON public.faculty_access_requests FOR INSERT
  WITH CHECK (true);

-- 9. RLS Policies: organization_access_requests
DROP POLICY IF EXISTS "Organizations can view own access request" ON public.organization_access_requests;
CREATE POLICY "Organizations can view own access request"
  ON public.organization_access_requests FOR SELECT
  USING (auth.uid() = user_id OR work_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Admins can view and manage all organization requests" ON public.organization_access_requests;
CREATE POLICY "Admins can view and manage all organization requests"
  ON public.organization_access_requests FOR ALL
  USING (public.is_admin());

DROP POLICY IF EXISTS "Anyone authenticated can insert an organization request" ON public.organization_access_requests;
CREATE POLICY "Anyone authenticated can insert an organization request"
  ON public.organization_access_requests FOR INSERT
  WITH CHECK (true);

-- 10. Automatic Trigger on auth.users: Enforce Role Security on Signup
-- CRITICAL REQUIREMENT: Public self-registration creates STUDENT accounts only!
-- Faculty and Organizations are strictly PENDING until Admin approval!
-- Administrator roles CANNOT be self-registered!
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  req_role TEXT;
  assigned_role TEXT;
  assigned_status TEXT;
  user_name TEXT;
BEGIN
  req_role := LOWER(COALESCE(new.raw_user_meta_data->>'role', 'student'));
  user_name := COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1));

  -- SECURITY ENFORCEMENT:
  -- - Public student signup -> role 'student', status 'approved'
  -- - Faculty request -> role 'faculty', status 'pending' (requires admin verification)
  -- - Organization request -> role 'external_partner', status 'pending' (requires admin verification)
  -- - Any request claiming 'admin' -> FORCED to 'student' (admin can only be promoted by existing admin)
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
    id,
    email,
    name,
    role,
    status,
    department,
    year,
    section,
    assigned_section,
    organization,
    org_type,
    verification_details,
    designation,
    employee_id,
    website,
    is_verified_partner
  ) VALUES (
    new.id,
    new.email,
    user_name,
    assigned_role,
    assigned_status,
    new.raw_user_meta_data->>'department',
    new.raw_user_meta_data->>'year',
    new.raw_user_meta_data->>'section',
    new.raw_user_meta_data->>'assignedSection',
    new.raw_user_meta_data->>'organization',
    new.raw_user_meta_data->>'orgType',
    new.raw_user_meta_data->>'verificationDetails',
    new.raw_user_meta_data->>'designation',
    new.raw_user_meta_data->>'employeeId',
    new.raw_user_meta_data->>'website',
    false
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();

  -- If faculty request, log to faculty_access_requests table
  IF req_role = 'faculty' THEN
    INSERT INTO public.faculty_access_requests (
      user_id,
      full_name,
      email,
      department,
      designation,
      assigned_section_or_club,
      employee_id,
      phone,
      justification
    ) VALUES (
      new.id,
      user_name,
      new.email,
      COALESCE(new.raw_user_meta_data->>'department', 'General'),
      COALESCE(new.raw_user_meta_data->>'designation', 'Faculty'),
      COALESCE(new.raw_user_meta_data->>'assignedSection', 'N/A'),
      COALESCE(new.raw_user_meta_data->>'employeeId', 'PENDING'),
      new.raw_user_meta_data->>'phone',
      COALESCE(new.raw_user_meta_data->>'justification', 'Faculty access request')
    );
  END IF;

  -- If organization request, log to organization_access_requests table
  IF req_role = 'external_partner' THEN
    INSERT INTO public.organization_access_requests (
      user_id,
      organization_name,
      org_type,
      representative_name,
      designation,
      work_email,
      phone,
      website,
      verification_details,
      partnership_intent
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
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

-- ==============================================================================
-- BOOTSTRAP INITIAL ADMIN INSTRUCTIONS:
-- Once you sign up with your admin email (e.g. admin@campuspulse.demo or your personal email),
-- run the following command in SQL Editor to grant yourself the authorized Admin role:
--
-- UPDATE public.user_profiles
-- SET role = 'admin', status = 'approved'
-- WHERE email = 'admin@campuspulse.demo'; -- replace with your registered email
-- ==============================================================================
