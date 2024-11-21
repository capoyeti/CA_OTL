-- Create enum for submission status
CREATE TYPE submission_status AS ENUM ('pending_review', 'approved', 'rejected', 'requires_more_info');

-- Create the FICA submissions table
CREATE TABLE fica_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  status submission_status DEFAULT 'pending_review' NOT NULL,

  -- Company Information
  company_name_and_reg TEXT NOT NULL,
  company_sa_presence TEXT NOT NULL,
  company_stock_exchange TEXT,
  company_tax_number TEXT NOT NULL,
  company_registered_address TEXT NOT NULL,

  -- Representative Information
  representative_id_details TEXT NOT NULL,
  representative_address TEXT NOT NULL,
  representative_contact_details TEXT NOT NULL,
  representative_authority TEXT,

  -- Service Details
  service_type TEXT NOT NULL,
  service_other_details TEXT,
  payment_financing TEXT NOT NULL,
  payment_large_cash BOOLEAN DEFAULT false NOT NULL,

  -- Ownership Information
  business_description TEXT NOT NULL,
  ownership_structure TEXT NOT NULL,
  ubo_method TEXT NOT NULL,
  ubo_details TEXT NOT NULL,
  ubo_addresses TEXT NOT NULL
);

-- Create indexes for common queries
CREATE INDEX idx_fica_submissions_status ON fica_submissions(status);
CREATE INDEX idx_fica_submissions_created_at ON fica_submissions(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE fica_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users" ON fica_submissions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON fica_submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_fica_submissions_updated_at
    BEFORE UPDATE ON fica_submissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
