-- MIGRATION: TEMPLETERIA FOUNDATION (SCHEMA 1.0)
-- Purpose: Support declarative site building with multi-tenancy and high-fidelity schema

-- 1. MASTER SECRETS (Encrypted Tokens Store)
CREATE TABLE IF NOT EXISTS public.master_secrets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    key_name text UNIQUE NOT NULL, -- 'OPENAI_KEY', 'GODADDY_SECRET', etc.
    key_value text NOT NULL, -- Encrypted value (managed via Edge Functions)
    description text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 2. SITE CONFIGURATIONS (The JSON Source of Truth)
CREATE TABLE IF NOT EXISTS public.templeteria_sites (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id uuid REFERENCES public.accounts(id) ON DELETE CASCADE,
    company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE,
    status text CHECK (status IN ('draft', 'generating', 'refining', 'pending_approval', 'published')) DEFAULT 'draft',
    
    -- Declarative Schema (The Core)
    site_schema jsonb NOT NULL DEFAULT '{
        "metadata": {"title": "", "description": ""},
        "theme": {"primaryColor": "#2563eb", "font": "Inter"},
        "pages": [],
        "assets": []
    }'::jsonb,
    
    -- Wizard Answers (Raw data for AI)
    wizard_data jsonb DEFAULT '{}'::jsonb,
    
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 3. SITE VERSIONS (For safety and rollback)
CREATE TABLE IF NOT EXISTS public.templeteria_versions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id uuid REFERENCES public.templeteria_sites(id) ON DELETE CASCADE,
    schema_snapshot jsonb NOT NULL,
    created_by uuid REFERENCES auth.users(id),
    created_at timestamptz DEFAULT now()
);

-- 4. RLS & SECURITY
ALTER TABLE public.master_secrets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templeteria_sites ENABLE ROW LEVEL SECURITY;

-- Only super_admins can see secrets (managed via role check in user_profiles)
CREATE POLICY "master_only_secrets" ON public.master_secrets FOR ALL TO authenticated
USING ((SELECT role FROM public.user_profiles WHERE id = auth.uid()) = 'OWNER');

-- Users see their own sites
CREATE POLICY "tenant_site_isolation" ON public.templeteria_sites FOR ALL TO authenticated
USING (account_id = (SELECT account_id FROM public.user_profiles WHERE id = auth.uid()));

-- 5. RPC: INITIALIZE SITE FROM WIZARD
CREATE OR REPLACE FUNCTION public.init_templeteria_site(p_company_id uuid, p_wizard_data jsonb)
RETURNS uuid AS $$
DECLARE
    v_site_id uuid;
    v_acc_id uuid;
BEGIN
    SELECT account_id INTO v_acc_id FROM public.companies WHERE id = p_company_id;
    
    INSERT INTO public.templeteria_sites (account_id, company_id, wizard_data, status)
    VALUES (v_acc_id, p_company_id, p_wizard_data, 'generating')
    RETURNING id INTO v_site_id;
    
    RETURN v_site_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT ALL ON public.templeteria_sites TO authenticated;
GRANT ALL ON public.templeteria_versions TO authenticated;
