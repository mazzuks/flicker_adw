-- MIGRATION: AUDIT TRAIL AUTOMATION
-- Purpose: Automatically log critical actions in the events_audit table.
-- No emojis.

-- 1. TRIGGER FUNCTION FOR DEALS
CREATE OR REPLACE FUNCTION public.audit_deal_changes()
RETURNS TRIGGER AS $$
BEGIN
    -- Log Stage Changes
    IF (TG_OP = 'UPDATE' AND OLD.stage_key IS DISTINCT FROM NEW.stage_key) THEN
        INSERT INTO public.events_audit (account_id, actor_id, entity_type, entity_id, action, payload_json)
        VALUES (
            NEW.account_id, 
            auth.uid(), 
            'deal', 
            NEW.id, 
            'moved', 
            jsonb_build_object('from', OLD.stage_key, 'to', NEW.stage_key)
        );
    END IF;

    -- Log Creation
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO public.events_audit (account_id, actor_id, entity_type, entity_id, action, payload_json)
        VALUES (
            NEW.account_id, 
            auth.uid(), 
            'deal', 
            NEW.id, 
            'created', 
            jsonb_build_object('stage', NEW.stage_key)
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. APPLY TRIGGER
DROP TRIGGER IF EXISTS tr_audit_deals ON public.deals;
CREATE TRIGGER tr_audit_deals
    AFTER INSERT OR UPDATE ON public.deals
    FOR EACH ROW EXECUTE FUNCTION public.audit_deal_changes();

-- 3. RLS FOR AUDIT
ALTER TABLE public.events_audit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_view_own_audit" ON public.events_audit
    FOR SELECT TO authenticated
    USING (account_id = (SELECT account_id FROM public.user_profiles WHERE id = auth.uid()));

-- 4. GRANT
GRANT ALL ON public.events_audit TO authenticated;
