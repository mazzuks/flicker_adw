-- MIGRATION: TEMPLETERIA PUBLISH HISTORY
-- Purpose: Audit trail for all publication events.
-- No emojis.

-- 1. PUBLISH EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.templeteria_publish_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id uuid REFERENCES public.templeteria_sites(id) ON DELETE CASCADE NOT NULL,
    version_id uuid REFERENCES public.templeteria_site_versions(id) ON DELETE CASCADE NOT NULL,
    published_by uuid REFERENCES auth.users(id) NOT NULL,
    published_at timestamptz DEFAULT now()
);

-- 2. RLS POLICIES
ALTER TABLE public.templeteria_publish_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_publish_events_isolation" ON public.templeteria_publish_events
FOR SELECT TO authenticated
USING (site_id IN (SELECT id FROM public.templeteria_sites WHERE account_id = (SELECT account_id FROM public.user_profiles WHERE id = auth.uid())));

-- 3. GRANTS
GRANT ALL ON public.templeteria_publish_events TO authenticated;
GRANT SELECT ON public.templeteria_publish_events TO anon;

-- Index for history lookups
CREATE INDEX idx_templeteria_publish_history ON public.templeteria_publish_events(site_id);
