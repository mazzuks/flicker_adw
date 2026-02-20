-- MIGRATION: TEMPLETERIA FINAL MVP CLOSEOUT
-- Purpose: Sites, Versions, and AI Job Logs with RLS for multi-tenancy.
-- No emojis in comments or code.

-- 1. TEMPLETERIA SITES
CREATE TABLE IF NOT EXISTS public.templeteria_sites (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
    name text NOT NULL,
    slug text UNIQUE NOT NULL,
    status text NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED')),
    published_version_id uuid, -- will FK to site_versions after creation
    created_by uuid REFERENCES auth.users(id),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 2. TEMPLETERIA SITE VERSIONS
CREATE TABLE IF NOT EXISTS public.templeteria_site_versions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id uuid REFERENCES public.templeteria_sites(id) ON DELETE CASCADE NOT NULL,
    client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
    version int NOT NULL,
    template_json jsonb NOT NULL,
    notes text,
    created_by uuid REFERENCES auth.users(id),
    created_at timestamptz DEFAULT now(),
    CONSTRAINT templeteria_site_versions_site_version_unique UNIQUE (site_id, version)
);

-- Add late FK to published_version_id
DO $$ BEGIN
    ALTER TABLE public.templeteria_sites 
    ADD CONSTRAINT templeteria_sites_published_version_id_fkey 
    FOREIGN KEY (published_version_id) REFERENCES public.templeteria_site_versions(id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 3. TEMPLETERIA AI JOBS (AUDIT + LOGS)
CREATE TABLE IF NOT EXISTS public.templeteria_ai_jobs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
    site_id uuid REFERENCES public.templeteria_sites(id) ON DELETE SET NULL,
    status text NOT NULL CHECK (status IN ('RUNNING', 'DONE', 'ERROR')),
    mode text NOT NULL CHECK (mode IN ('GENERATE', 'REFINE')),
    input_payload_json jsonb,
    output_payload_json jsonb,
    provider text,
    cost_tokens int,
    error_message text,
    created_by uuid REFERENCES auth.users(id),
    created_at timestamptz DEFAULT now()
);

-- 4. RLS POLICIES (MULTI-TENANCY)
ALTER TABLE public.templeteria_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templeteria_site_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templeteria_ai_jobs ENABLE ROW LEVEL SECURITY;

-- Dynamic function to get current client context from client_memberships
CREATE OR REPLACE FUNCTION public.get_auth_client_ids() 
RETURNS uuid[] AS $$
    SELECT array_agg(client_id) FROM public.client_memberships WHERE user_id = auth.uid();
$$ LANGUAGE sql STABLE;

-- SITES: Owner/User within tenant
CREATE POLICY "tenant_sites_isolation" ON public.templeteria_sites 
FOR ALL TO authenticated
USING (client_id = ANY(public.get_auth_client_ids()));

-- VERSIONS: Owner/User within tenant
CREATE POLICY "tenant_versions_isolation" ON public.templeteria_site_versions 
FOR ALL TO authenticated
USING (client_id = ANY(public.get_auth_client_ids()));

-- AI JOBS: Owner/User within tenant
CREATE POLICY "tenant_ai_jobs_isolation" ON public.templeteria_ai_jobs 
FOR ALL TO authenticated
USING (client_id = ANY(public.get_auth_client_ids()));

-- INTERNAL/MASTER ROLES (If applicable, based on profile.role_global)
-- Using simple profile check for ADWORKS prefix
CREATE POLICY "internal_sites_access" ON public.templeteria_sites 
FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role_global::text LIKE 'ADWORKS_%'));

-- 5. GRANTS
GRANT ALL ON public.templeteria_sites TO authenticated;
GRANT ALL ON public.templeteria_site_versions TO authenticated;
GRANT ALL ON public.templeteria_ai_jobs TO authenticated;
