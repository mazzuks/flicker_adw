-- MIGRATION: TEMPLETERIA DASHBOARD ENHANCEMENTS
-- Purpose: Support 'archived' status and ensure updated_at triggers.
-- No emojis.

-- 1. UPDATE STATUS CHECK CONSTRAINT
ALTER TABLE public.templeteria_sites 
DROP CONSTRAINT IF EXISTS templeteria_sites_status_check;

ALTER TABLE public.templeteria_sites 
ADD CONSTRAINT templeteria_sites_status_check 
CHECK (status IN ('draft', 'published', 'archived'));

-- 2. ENSURE UPDATED_AT TRIGGER EXISTS
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tr_templeteria_sites_updated_at') THEN
        CREATE TRIGGER tr_templeteria_sites_updated_at
            BEFORE UPDATE ON public.templeteria_sites
            FOR EACH ROW
            EXECUTE FUNCTION public.handle_updated_at();
    END IF;
END $$;
