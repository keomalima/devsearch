-- Migration to add new fields to job_offers table
-- Run this in your Supabase SQL Editor

ALTER TABLE job_offers 
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS company_description TEXT,
ADD COLUMN IF NOT EXISTS cover_letter TEXT,
ADD COLUMN IF NOT EXISTS user_notes TEXT;

-- Create index for location searches
CREATE INDEX IF NOT EXISTS idx_job_offers_location ON job_offers(location);
