-- MIGRATION: TEMPLETERIA FASE 2 (VERSIONING & SNAPSHOTS)
-- Purpose: Support immutable snapshots, schema versioning, and rollback.
-- No emojis.

-- 1. EXTEND SITE VERSIONS
ALTER TABLE public.templeteria_site_versions
ADD COLUMN schema_version int NOT NULL DEFAULT 1;

-- 2. EXTEND SITES FOR SNAPSHOTS
ALTER TABLE public.templeteria_sites
ADD COLUMN published_version_id uuid REFERENCES public.templeteria_site_versions(id),
ADD COLUMN published_version int,
ADD COLUMN published_schema_json jsonb,
ADD COLUMN published_schema_version int,
ADD COLUMN published_at timestamptz;

-- 3. UPDATE AI JOBS CONSTRAINT
ALTER TABLE public.templeteria_ai_jobs 
DROP CONSTRAINT templeteria_ai_jobs_job_type_check;

ALTER TABLE public.templeteria_ai_jobs 
ADD CONSTRAINT templeteria_ai_jobs_job_type_check 
CHECK (job_type IN ('generate', 'refine', 'publish', 'rollback'));

-- 4. REFRESH RLS FOR SNAPSHOTS
DROP POLICY IF EXISTS "public_read_published_versions" ON public.templeteria_site_versions;
CREATE POLICY "public_read_published_versions" ON public.templeteria_site_versions
FOR SELECT TO anon
USING (id IN (SELECT published_version_id FROM public.templeteria_sites WHERE status = 'published'));
