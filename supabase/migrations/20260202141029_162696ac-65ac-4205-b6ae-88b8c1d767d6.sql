-- Create the update_updated_at_column function FIRST
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create enum for profile verification status
CREATE TYPE public.profile_status AS ENUM ('pending', 'verified', 'rejected');

-- Create profiles table for tracked LinkedIn profiles
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  linkedin_url TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  title TEXT,
  avatar_url TEXT,
  risk_score INTEGER NOT NULL DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
  status public.profile_status NOT NULL DEFAULT 'pending',
  is_active_on_linkedin BOOLEAN NOT NULL DEFAULT true,
  report_count INTEGER NOT NULL DEFAULT 1,
  ai_analysis TEXT,
  last_checked_at TIMESTAMP WITH TIME ZONE,
  reported_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin settings table for API keys
CREATE TABLE public.admin_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Profiles RLS: Everyone can view verified profiles
CREATE POLICY "Anyone can view verified profiles"
ON public.profiles
FOR SELECT
USING (status = 'verified');

-- Profiles RLS: Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Profiles RLS: Admins can manage profiles
CREATE POLICY "Admins can manage profiles"
ON public.profiles
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Profiles RLS: Authenticated users can report profiles
CREATE POLICY "Users can report profiles"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = reported_by);

-- Admin settings RLS: Only admins
CREATE POLICY "Only admins can view settings"
ON public.admin_settings
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can manage settings"
ON public.admin_settings
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Trigger for updated_at on profiles
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for updated_at on admin_settings
CREATE TRIGGER update_admin_settings_updated_at
BEFORE UPDATE ON public.admin_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();