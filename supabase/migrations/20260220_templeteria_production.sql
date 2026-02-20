-- MIGRATION: TEMPLETERIA PRODUCTION CORE
-- Purpose: Remove stubs and implement production-ready schema for sites and AI jobs.
-- No emojis.

-- 1. CLEANUP PREVIOUS MOCKS IF ANY
DROP TABLE IF EXISTS public.templeteria_ai_jobs CASCADE;
DROP TABLE IF EXISTS public.templeteria_site_versions CASCADE;
DROP TABLE IF EXISTS public.templeteria_sites CASCADE;

-- 2. TEMPLETERIA SITES
CREATE TABLE public.templeteria_sites (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE,
    created_by uuid NOT NULL REFERENCES auth.users(id),
    slug text NOT NULL,
    status text NOT NULL DEFAULT 'DRAFT', -- DRAFT, PUBLISHED
    title text,
    description text,
    schema_json jsonb NOT NULL DEFAULT '{}'::jsonb,
    theme_json jsonb NOT NULL DEFAULT '{}'::jsonb,
    published_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT templeteria_sites_slug_unique UNIQUE (slug)
);

-- 3. AI JOBS LOG
CREATE TABLE public.templeteria_ai_jobs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE,
    site_id uuid REFERENCES public.templeteria_sites(id) ON DELETE SET NULL,
    status text NOT NULL, -- RUNNING, DONE, ERROR
    mode text NOT NULL, -- GENERATE, REFINE
    provider text,
    input_payload_json jsonb NOT NULL DEFAULT '{}'::jsonb,
    output_payload_json jsonb,
    error_message text,
    created_by uuid NOT NULL REFERENCES auth.users(id),
    created_at timestamptz NOT NULL DEFAULT now()
);

-- 4. UPDATED_AT TRIGGER
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

-- 5. RLS POLICIES
ALTER TABLE public.templeteria_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templeteria_ai_jobs ENABLE ROW LEVEL SECURITY;

-- SITES: Owner access
CREATE POLICY "owner_manage_sites" ON public.templeteria_sites
FOR ALL TO authenticated
USING (created_by = auth.uid());

-- SITES: Public read for published
CREATE POLICY "public_read_published_sites" ON public.templeteria_sites
FOR SELECT TO anon
USING (status = 'PUBLISHED');

-- AI JOBS: Owner access
CREATE POLICY "owner_read_jobs" ON public.templeteria_ai_jobs
FOR SELECT TO authenticated
USING (created_by = auth.uid());

CREATE POLICY "owner_insert_jobs" ON public.templeteria_ai_jobs
FOR INSERT TO authenticated
WITH CHECK (created_by = auth.uid());

-- 6. GRANTS
GRANT ALL ON public.templeteria_sites TO authenticated;
GRANT SELECT ON public.templeteria_sites TO anon;
GRANT ALL ON public.templeteria_ai_jobs TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;
