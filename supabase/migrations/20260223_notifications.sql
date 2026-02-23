-- MIGRATION: NOTIFICATIONS SYSTEM
-- Purpose: Support real-time alerts for clients and operators.
-- No emojis.

CREATE TABLE IF NOT EXISTS public.notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id uuid REFERENCES public.accounts(id) ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES auth.users(id), -- Null means all users in account
    title text NOT NULL,
    body text NOT NULL,
    type text NOT NULL CHECK (type IN ('message', 'document', 'fiscal', 'system')),
    link text, -- Path to navigate to
    read_at timestamptz,
    created_at timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_view_own_notifications" ON public.notifications
    FOR ALL TO authenticated
    USING (account_id = (SELECT account_id FROM public.user_profiles WHERE id = auth.uid()));

-- GRANT
GRANT ALL ON public.notifications TO authenticated;

-- Helper to send notification from backend
CREATE OR REPLACE FUNCTION public.send_notification(
    p_account_id uuid,
    p_title text,
    p_body text,
    p_type text,
    p_link text DEFAULT NULL,
    p_user_id uuid DEFAULT NULL
) RETURNS uuid AS $$
DECLARE
    v_notif_id uuid;
BEGIN
    INSERT INTO public.notifications (account_id, user_id, title, body, type, link)
    VALUES (p_account_id, p_user_id, p_title, p_body, p_type, p_link)
    RETURNING id INTO v_notif_id;
    RETURN v_notif_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
