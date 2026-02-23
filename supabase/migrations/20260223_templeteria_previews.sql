-- MIGRATION: TEMPLETERIA PREVIEW LINKS
-- Purpose: Support shareable preview links for non-published sites.
-- No emojis.

-- 1. ADD PREVIEW COLUMNS TO SITES
ALTER TABLE public.templeteria_sites
ADD COLUMN preview_token text,
ADD COLUMN preview_expires_at timestamptz;

-- 2. CREATE INDEX FOR PREVIEW LOOKUP
CREATE INDEX idx_templeteria_sites_preview ON public.templeteria_sites(preview_token);

-- 3. RLS: PERMIT ANONYMOUS PREVIEW ACCESS
-- Note: This policy allows anon to select by preview_token if not expired.
CREATE POLICY "anon_read_preview_sites" ON public.templeteria_sites
FOR SELECT TO anon
USING (
    preview_token IS NOT NULL 
    AND preview_expires_at > now()
);

-- 4. RLS: PERMIT ANONYMOUS ACCESS TO VERSIONS VIA PREVIEW
CREATE POLICY "anon_read_preview_versions" ON public.templeteria_site_versions
FOR SELECT TO anon
USING (
    site_id IN (
        SELECT id FROM public.templeteria_sites 
        WHERE preview_token IS NOT NULL AND preview_expires_at > now()
    )
);
