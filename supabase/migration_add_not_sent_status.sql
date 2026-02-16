-- Add 'not_sent' status to the job_offers table
-- This allows users to save job offers before actually applying

-- Update the status constraint to include 'not_sent'
ALTER TABLE job_offers 
DROP CONSTRAINT IF EXISTS job_offers_status_check;

ALTER TABLE job_offers 
ADD CONSTRAINT job_offers_status_check 
CHECK (status IN ('not_sent', 'applied', 'interview', 'rejected', 'offer'));
