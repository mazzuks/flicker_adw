-- MIGRATION: FISCAL ALERTS 6.0 (Email Notifications)
-- Purpose: Track sent fiscal notifications to avoid duplicates and support cron logic.
-- No emojis.

-- 1. NOTIFICATIONS LOG
CREATE TABLE IF NOT EXISTS public.fiscal_event_notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id uuid REFERENCES public.fiscal_events(id) ON DELETE CASCADE NOT NULL,
    account_id uuid REFERENCES public.accounts(id) ON DELETE CASCADE NOT NULL,
    notification_type text NOT NULL CHECK (notification_type IN ('before_3d', 'due_today', 'overdue_1d')),
    sent_at timestamptz DEFAULT now(),
    CONSTRAINT fiscal_event_notifications_unique UNIQUE (event_id, notification_type)
);

-- 2. RLS POLICIES
ALTER TABLE public.fiscal_event_notifications ENABLE ROW LEVEL SECURITY;

-- Owner can see their own notifications
CREATE POLICY "users_view_own_fiscal_notifications" ON public.fiscal_event_notifications
    FOR SELECT TO authenticated
    USING (account_id = (SELECT account_id FROM public.user_profiles WHERE id = auth.uid()));

-- 3. GRANTS
GRANT ALL ON public.fiscal_event_notifications TO authenticated;
