-- MIGRATION: TEMPLETERIA VERSIONED ARCHITECTURE
-- Purpose: Implement robust versioning for sites to support safe history and rollback.
-- Alignment: Abort simple approach, implement full versioning (Approach B).
-- No emojis.

-- 1. CLEANUP PREVIOUS ATTEMPTS
DROP TABLE IF EXISTS public.templeteria_ai_jobs CASCADE;
DROP TABLE IF EXISTS public.templeteria_site_versions CASCADE;
DROP TABLE IF EXISTS public.templeteria_sites CASCADE;

-- 2. TEMPLETERIA SITES (Registry)
CREATE TABLE public.templeteria_sites (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE,
    created_by uuid NOT NULL REFERENCES auth.users(id),
    name text NOT NULL,
    slug text NOT NULL UNIQUE,
    status text NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED')),
    published_version_id uuid, -- late FK added below
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- 3. SITE VERSIONS (The Data Store)
CREATE TABLE public.templeteria_site_versions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id uuid REFERENCES public.templeteria_sites(id) ON DELETE CASCADE NOT NULL,
    client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE,
    version int NOT NULL,
    schema_json jsonb NOT NULL DEFAULT '{}'::jsonb,
    theme_json jsonb NOT NULL DEFAULT '{}'::jsonb,
    notes text,
    created_by uuid REFERENCES auth.users(id),
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Add published_version_id FK
ALTER TABLE public.templeteria_sites 
ADD CONSTRAINT templeteria_sites_published_version_id_fkey 
FOREIGN KEY (published_version_id) REFERENCES public.templeteria_site_versions(id);

-- 4. AI JOBS (Production Audit)
CREATE TABLE public.templeteria_ai_jobs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE,
    site_id uuid REFERENCES public.templeteria_sites(id) ON DELETE SET NULL,
    status text NOT NULL CHECK (status IN ('RUNNING', 'DONE', 'ERROR')),
    mode text NOT NULL CHECK (mode IN ('GENERATE', 'REFINE')),
    provider text,
    input_payload_json jsonb NOT NULL DEFAULT '{}'::jsonb,
    output_payload_json jsonb,
    error_message text,
    created_by uuid NOT NULL REFERENCES auth.users(id),
    created_at timestamptz NOT NULL DEFAULT now()
);

-- 5. RLS (Strict Multi-Tenancy)
ALTER TABLE public.templeteria_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templeteria_site_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templeteria_ai_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner_manage_sites" ON public.templeteria_sites FOR ALL TO authenticated USING (created_by = auth.uid());
CREATE POLICY "owner_manage_versions" ON public.templeteria_site_versions FOR ALL TO authenticated USING (created_by = auth.uid());
CREATE POLICY "owner_manage_jobs" ON public.templeteria_ai_jobs FOR ALL TO authenticated USING (created_by = auth.uid());

-- Public Access: Sites + Versions
CREATE POLICY "public_read_published_sites" ON public.templeteria_sites FOR SELECT TO anon USING (status = 'PUBLISHED');
CREATE POLICY "public_read_published_versions" ON public.templeteria_site_versions FOR SELECT TO anon 
USING (id IN (SELECT published_version_id FROM public.templeteria_sites WHERE status = 'PUBLISHED'));

-- 6. GRANTS
GRANT ALL ON public.templeteria_sites TO authenticated;
GRANT ALL ON public.templeteria_site_versions TO authenticated;
GRANT ALL ON public.templeteria_ai_jobs TO authenticated;
GRANT SELECT ON public.templeteria_sites TO anon;
GRANT SELECT ON public.templeteria_site_versions TO anon;
