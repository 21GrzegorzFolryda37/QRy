-- Migration: Add LinkPage and Survey support
-- Run this in Supabase SQL Editor

-- Add content_type column to qr_codes if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'qr_codes' AND column_name = 'content_type') THEN
        ALTER TABLE qr_codes ADD COLUMN content_type TEXT DEFAULT 'website';
    END IF;
END $$;

-- Add content_data column for storing linkpage/survey JSON data
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'qr_codes' AND column_name = 'content_data') THEN
        ALTER TABLE qr_codes ADD COLUMN content_data JSONB DEFAULT NULL;
    END IF;
END $$;

-- Create survey_responses table
CREATE TABLE IF NOT EXISTS survey_responses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    qr_code_id UUID NOT NULL REFERENCES qr_codes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    answers JSONB NOT NULL,
    submitted_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_survey_responses_qr_code_id ON survey_responses(qr_code_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_user_id ON survey_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_submitted_at ON survey_responses(submitted_at);
CREATE INDEX IF NOT EXISTS idx_qr_codes_content_type ON qr_codes(content_type);

-- Enable RLS on survey_responses
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for survey_responses
-- Users can view their own survey responses
CREATE POLICY IF NOT EXISTS "Users can view own survey responses"
    ON survey_responses FOR SELECT
    USING (auth.uid() = user_id);

-- Anyone can insert survey responses (public surveys)
CREATE POLICY IF NOT EXISTS "Anyone can submit survey responses"
    ON survey_responses FOR INSERT
    WITH CHECK (true);

-- Update comment for documentation
COMMENT ON TABLE survey_responses IS 'Stores responses to survey QR codes';
COMMENT ON COLUMN qr_codes.content_type IS 'Type of QR code content: website, facebook, instagram, youtube, tiktok, linkedin, twitter, whatsapp, email, phone, sms, wifi, vcard, location, pdf, menu, linkpage, survey';
COMMENT ON COLUMN qr_codes.content_data IS 'JSON data for special content types like linkpage and survey';
