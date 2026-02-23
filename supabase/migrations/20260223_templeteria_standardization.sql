-- MIGRATION: TEMPLETERIA STANDARDIZATION (FINAL)
-- Purpose: Unify naming, multi-tenancy, and status across all Templeteria tables.
-- No emojis.

-- 1. CLEANUP PREVIOUS TEMPLETERIA TABLES
DROP TABLE IF EXISTS public.templeteria_ai_jobs CASCADE;
DROP TABLE IF EXISTS public.templeteria_site_versions CASCADE;
DROP TABLE IF EXISTS public.templeteria_sites CASCADE;

-- 2. TEMPLETERIA SITES (Registry)
CREATE TABLE public.templeteria_sites (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id uuid REFERENCES public.accounts(id) ON DELETE CASCADE NOT NULL,
    created_by uuid NOT NULL REFERENCES auth.users(id),
    name text NOT NULL,
    slug text NOT NULL UNIQUE,
    status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    published_version int, -- Stores the version number that is currently live
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- 3. SITE VERSIONS (Data Store)
CREATE TABLE public.templeteria_site_versions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id uuid REFERENCES public.templeteria_sites(id) ON DELETE CASCADE NOT NULL,
    version int NOT NULL,
    schema_json jsonb NOT NULL DEFAULT '{}'::jsonb,
    theme_json jsonb NOT NULL DEFAULT '{}'::jsonb,
    notes text,
    created_by uuid NOT NULL REFERENCES auth.users(id),
    created_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT templeteria_site_versions_unique_ver UNIQUE (site_id, version)
);

-- 4. AI JOBS (Production Log)
CREATE TABLE public.templeteria_ai_jobs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id uuid REFERENCES public.templeteria_sites(id) ON DELETE CASCADE,
    version_id uuid REFERENCES public.templeteria_site_versions(id) ON DELETE SET NULL,
    job_type text NOT NULL CHECK (job_type IN ('generate', 'refine', 'publish')),
    status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'done', 'error')),
    prompt text,
    result_json jsonb,
    error text,
    created_by uuid NOT NULL REFERENCES auth.users(id),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- 5. TRIGGER FOR UPDATED_AT
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    return NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_templeteria_sites_updated
    BEFORE UPDATE ON public.templeteria_sites
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_templeteria_ai_jobs_updated
    BEFORE UPDATE ON public.templeteria_ai_jobs
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 6. RLS POLICIES (Strict Tenant Isolation)
ALTER TABLE public.templeteria_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templeteria_site_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templeteria_ai_jobs ENABLE ROW LEVEL SECURITY;

-- Helper function already exists in some migrations, but let's ensure we have a tenant check.
-- We use public.get_user_account() if it exists, or join directly.

CREATE POLICY "tenant_sites_isolation" ON public.templeteria_sites
FOR ALL TO authenticated
USING (account_id = (SELECT account_id FROM public.user_profiles WHERE id = auth.uid()));

CREATE POLICY "tenant_versions_isolation" ON public.templeteria_site_versions
FOR ALL TO authenticated
USING (site_id IN (SELECT id FROM public.templeteria_sites WHERE account_id = (SELECT account_id FROM public.user_profiles WHERE id = auth.uid())));

CREATE POLICY "tenant_jobs_isolation" ON public.templeteria_ai_jobs
FOR ALL TO authenticated
USING (created_by = auth.uid());

-- Public Access for Published Sites
CREATE POLICY "public_read_published_sites" ON public.templeteria_sites
FOR SELECT TO anon
USING (status = 'published');

CREATE POLICY "public_read_published_versions" ON public.templeteria_site_versions
FOR SELECT TO anon
USING (site_id IN (SELECT id FROM public.templeteria_sites WHERE status = 'published'));

-- 7. GRANTS
GRANT ALL ON public.templeteria_sites TO authenticated;
GRANT ALL ON public.templeteria_site_versions TO authenticated;
GRANT ALL ON public.templeteria_ai_jobs TO authenticated;
GRANT SELECT ON public.templeteria_sites TO anon;
GRANT SELECT ON public.templeteria_site_versions TO anon;

-- Indices for performance
CREATE INDEX idx_templeteria_sites_account ON public.templeteria_sites(account_id);
CREATE INDEX idx_templeteria_versions_site ON public.templeteria_site_versions(site_id);
CREATE INDEX idx_templeteria_jobs_user ON public.templeteria_ai_jobs(created_by);
