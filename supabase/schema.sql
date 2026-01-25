-- EngageQR Database Schema
-- Run this in Supabase SQL Editor to set up your database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE plan_type AS ENUM ('free', 'starter', 'pro', 'enterprise');
CREATE TYPE subscription_status_type AS ENUM ('active', 'canceled', 'past_due', 'trialing', 'incomplete');

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  plan plan_type NOT NULL DEFAULT 'free',
  subscription_status subscription_status_type,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  qr_limit INTEGER NOT NULL DEFAULT 5,
  monthly_scan_limit INTEGER NOT NULL DEFAULT 1000,
  current_month_scans INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- QR Codes table
CREATE TABLE qr_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  short_code TEXT NOT NULL UNIQUE,
  destination_url TEXT NOT NULL,
  style JSONB NOT NULL DEFAULT '{
    "foregroundColor": "#000000",
    "backgroundColor": "#FFFFFF",
    "cornerRadius": 0,
    "errorCorrectionLevel": "M",
    "margin": 4,
    "width": 400
  }'::JSONB,
  logo_url TEXT,
  logo_size INTEGER,
  qr_image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for short_code lookups (used in redirect)
CREATE INDEX idx_qr_codes_short_code ON qr_codes(short_code);
CREATE INDEX idx_qr_codes_user_id ON qr_codes(user_id);

-- Scans table
CREATE TABLE scans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  qr_code_id UUID NOT NULL REFERENCES qr_codes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  ip_address TEXT,
  country TEXT,
  country_code TEXT,
  region TEXT,
  city TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  device_type TEXT,
  browser TEXT,
  browser_version TEXT,
  os TEXT,
  os_version TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  referrer TEXT,
  scanned_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for analytics queries
CREATE INDEX idx_scans_qr_code_id ON scans(qr_code_id);
CREATE INDEX idx_scans_user_id ON scans(user_id);
CREATE INDEX idx_scans_scanned_at ON scans(scanned_at);
CREATE INDEX idx_scans_user_id_scanned_at ON scans(user_id, scanned_at);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_qr_codes_updated_at
  BEFORE UPDATE ON qr_codes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Function to increment scan count (called after insert on scans)
CREATE OR REPLACE FUNCTION increment_scan_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET current_month_scans = current_month_scans + 1
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to increment scan count
CREATE TRIGGER on_scan_insert
  AFTER INSERT ON scans
  FOR EACH ROW
  EXECUTE FUNCTION increment_scan_count();

-- Function to check QR limit before insert
CREATE OR REPLACE FUNCTION check_qr_limit()
RETURNS TRIGGER AS $$
DECLARE
  user_qr_limit INTEGER;
  current_qr_count INTEGER;
BEGIN
  SELECT qr_limit INTO user_qr_limit
  FROM profiles
  WHERE id = NEW.user_id;

  -- -1 means unlimited
  IF user_qr_limit = -1 THEN
    RETURN NEW;
  END IF;

  SELECT COUNT(*) INTO current_qr_count
  FROM qr_codes
  WHERE user_id = NEW.user_id;

  IF current_qr_count >= user_qr_limit THEN
    RAISE EXCEPTION 'QR code limit reached. Please upgrade your plan.';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to enforce QR limit
CREATE TRIGGER enforce_qr_limit
  BEFORE INSERT ON qr_codes
  FOR EACH ROW
  EXECUTE FUNCTION check_qr_limit();

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for qr_codes
CREATE POLICY "Users can view their own QR codes"
  ON qr_codes
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create QR codes"
  ON qr_codes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own QR codes"
  ON qr_codes
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own QR codes"
  ON qr_codes
  FOR DELETE
  USING (auth.uid() = user_id);

-- Public policy for redirect lookup (service role will use this)
CREATE POLICY "Public can read active QR codes by short_code"
  ON qr_codes
  FOR SELECT
  USING (is_active = TRUE);

-- RLS Policies for scans
CREATE POLICY "Users can view their own scans"
  ON scans
  FOR SELECT
  USING (auth.uid() = user_id);

-- Service role can insert scans (for tracking)
CREATE POLICY "Service role can insert scans"
  ON scans
  FOR INSERT
  WITH CHECK (TRUE);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('qr-images', 'qr-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('logos', 'logos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for qr-images bucket
CREATE POLICY "Anyone can view QR images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'qr-images');

CREATE POLICY "Authenticated users can upload QR images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'qr-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their QR images"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'qr-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their QR images"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'qr-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for logos bucket
CREATE POLICY "Anyone can view logos"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'logos');

CREATE POLICY "Authenticated users can upload logos"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'logos' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their logos"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'logos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their logos"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'logos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Monthly scan count reset (run this as a cron job at the start of each month)
-- You can set this up in Supabase Dashboard > Database > Scheduled Jobs
-- Or use pg_cron if available
/*
SELECT cron.schedule(
  'reset-monthly-scans',
  '0 0 1 * *', -- First day of each month at midnight
  $$UPDATE profiles SET current_month_scans = 0$$
);
*/
