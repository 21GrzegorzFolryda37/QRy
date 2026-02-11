-- Pending QR codes: hero-generated QR codes that get claimed after user registration
CREATE TABLE public.pending_qr_codes (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  signup_token    UUID DEFAULT gen_random_uuid() NOT NULL UNIQUE,
  short_code      VARCHAR(16) NOT NULL UNIQUE,
  destination_url TEXT NOT NULL,
  qr_type         VARCHAR(32) NOT NULL DEFAULT 'website',
  style           JSONB NOT NULL DEFAULT '{}',
  logo_url        TEXT,
  logo_size       INTEGER,
  qr_image_url    TEXT,
  email           VARCHAR(255),
  ip_address      VARCHAR(45),
  claimed         BOOLEAN NOT NULL DEFAULT FALSE,
  claimed_by      UUID REFERENCES auth.users(id),
  expires_at      TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pending_qr_short_code ON public.pending_qr_codes(short_code);
CREATE INDEX idx_pending_qr_signup_token ON public.pending_qr_codes(signup_token);

ALTER TABLE public.pending_qr_codes ENABLE ROW LEVEL SECURITY;
