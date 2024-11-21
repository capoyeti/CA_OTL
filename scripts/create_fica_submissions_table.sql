-- Create submission status enum
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'submission_status') THEN
        CREATE TYPE submission_status AS ENUM (
            'pending_review',
            'approved',
            'rejected',
            'requires_more_info'
        );
    END IF;
END $$;

-- Create FICA template and sections
DO $$ 
DECLARE
    fica_template_id UUID;
BEGIN
    -- Create FICA template
    INSERT INTO templates (name, description, is_default)
    VALUES ('FICA CDD Form', 'Client Due Diligence Form for FICA Compliance', false)
    RETURNING id INTO fica_template_id;

    -- Create FICA sections and link them to template
    WITH inserted_sections AS (
        INSERT INTO sections (title, content, is_core, default_order)
        VALUES 
            ('Company Details', 'Company identification and registration information', true, 1),
            ('Representative Details', 'Authorized representative information', true, 2),
            ('Service Information', 'Type of service and payment details', true, 3),
            ('Business Information', 'Business description and structure', true, 4),
            ('UBO Information', 'Ultimate Beneficial Owner details', true, 5),
            ('Office Use', 'Internal processing information', true, 6)
        RETURNING id, default_order
    )
    INSERT INTO template_sections (template_id, section_id, display_order, is_required)
    SELECT fica_template_id, id, default_order, true
    FROM inserted_sections;
END $$;

-- Create FICA submissions table
CREATE TABLE IF NOT EXISTS fica_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    -- Template Reference
    template_id UUID REFERENCES templates(id),
    
    -- Core Submission Data
    status submission_status DEFAULT 'pending_review',
    submission_data JSONB NOT NULL, -- Stores all form data in template variable format
    
    -- Metadata
    version VARCHAR(20) NOT NULL DEFAULT '1.0',
    submission_ip VARCHAR(45),
    submitted_by UUID REFERENCES auth.users(id),
    processed_by UUID REFERENCES auth.users(id),
    processed_at TIMESTAMPTZ,
    
    -- Validation and Processing
    is_complete BOOLEAN DEFAULT false,
    validation_errors JSONB,
    processing_notes TEXT[]
);

-- Create section variables for FICA form
DO $$
DECLARE
    company_section_id UUID;
    representative_section_id UUID;
    service_section_id UUID;
    business_section_id UUID;
    ubo_section_id UUID;
BEGIN
    -- Get section IDs
    SELECT id INTO company_section_id FROM sections WHERE title = 'Company Details' ORDER BY created_at DESC LIMIT 1;
    SELECT id INTO representative_section_id FROM sections WHERE title = 'Representative Details' ORDER BY created_at DESC LIMIT 1;
    SELECT id INTO service_section_id FROM sections WHERE title = 'Service Information' ORDER BY created_at DESC LIMIT 1;
    SELECT id INTO business_section_id FROM sections WHERE title = 'Business Information' ORDER BY created_at DESC LIMIT 1;
    SELECT id INTO ubo_section_id FROM sections WHERE title = 'UBO Information' ORDER BY created_at DESC LIMIT 1;

    -- Insert variables for each section
    -- Company Details Section
    INSERT INTO section_variables (section_id, variable_name, description, is_required)
    VALUES
        (company_section_id, 'company_legal_entity', 'Legal name of the company', true),
        (company_section_id, 'company_registration_number', 'Company registration number', true),
        (company_section_id, 'company_sa_presence', 'Description of SA business presence', true),
        (company_section_id, 'company_stock_exchange', 'Stock exchange listing if applicable', false),
        (company_section_id, 'company_tax_number', 'SARS income tax number', true),
        (company_section_id, 'company_physical_address', 'Company''s registered address', true);

    -- Representative Details Section
    INSERT INTO section_variables (section_id, variable_name, description, is_required)
    VALUES
        (representative_section_id, 'representative_full_name', 'Full name of representative', true),
        (representative_section_id, 'representative_id_number', 'ID or passport number', true),
        (representative_section_id, 'representative_physical_address', 'Physical address', true),
        (representative_section_id, 'representative_telephone', 'Contact telephone', true),
        (representative_section_id, 'representative_email', 'Email address', true),
        (representative_section_id, 'representative_authority_type', 'Type of authority documentation', true);

    -- Service Information Section
    INSERT INTO section_variables (section_id, variable_name, description, is_required)
    VALUES
        (service_section_id, 'service_type', 'Type of service required', true),
        (service_section_id, 'service_other_details', 'Details for other service types', false),
        (service_section_id, 'payment_finance_method', 'Method of financing payments', true),
        (service_section_id, 'payment_large_cash', 'Large cash payment indicator', true);

    -- Business Information Section
    INSERT INTO section_variables (section_id, variable_name, description, is_required)
    VALUES
        (business_section_id, 'business_description', 'Description of business', true),
        (business_section_id, 'ownership_structure', 'Company ownership structure', true);

    -- UBO Information Section
    INSERT INTO section_variables (section_id, variable_name, description, is_required)
    VALUES
        (ubo_section_id, 'ubo_method', 'Method of UBO identification', true),
        (ubo_section_id, 'ubo_details', 'UBO identification details', true),
        (ubo_section_id, 'ubo_addresses', 'UBO physical addresses', true);
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_fica_submissions_status ON fica_submissions(status);
CREATE INDEX IF NOT EXISTS idx_fica_submissions_dates ON fica_submissions(created_at, processed_at);
CREATE INDEX IF NOT EXISTS idx_fica_submissions_template ON fica_submissions(template_id);
CREATE INDEX IF NOT EXISTS idx_fica_submissions_completion ON fica_submissions(is_complete);

-- Enable RLS
ALTER TABLE fica_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users" ON fica_submissions
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON fica_submissions
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for submission owner or processor" ON fica_submissions
    FOR UPDATE TO authenticated
    USING (
        auth.uid() = submitted_by 
        OR auth.uid() = processed_by
        OR auth.jwt() ->> 'role' = 'admin'
    );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_fica_submissions_updated_at
    BEFORE UPDATE ON fica_submissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create validation trigger
CREATE OR REPLACE FUNCTION validate_fica_submission()
RETURNS TRIGGER AS $$
DECLARE
    required_vars CURSOR FOR
        SELECT sv.variable_name
        FROM section_variables sv
        JOIN template_sections ts ON sv.section_id = ts.section_id
        WHERE ts.template_id = NEW.template_id
        AND sv.is_required = true;
    missing_vars TEXT[] := '{}';
    var_name TEXT;
BEGIN
    -- Check for required variables
    FOR var_name IN required_vars LOOP
        IF NOT (NEW.submission_data ? var_name) THEN
            missing_vars := array_append(missing_vars, var_name);
        END IF;
    END LOOP;

    -- Update validation status
    IF array_length(missing_vars, 1) > 0 THEN
        NEW.validation_errors := jsonb_build_object('missing_required_fields', missing_vars);
        NEW.is_complete := false;
    ELSE
        NEW.validation_errors := NULL;
        NEW.is_complete := true;
    END IF;

    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER validate_fica_submission_trigger
    BEFORE INSERT OR UPDATE OF submission_data ON fica_submissions
    FOR EACH ROW
    EXECUTE FUNCTION validate_fica_submission();
