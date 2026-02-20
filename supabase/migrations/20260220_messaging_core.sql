-- MIGRATION: MESSAGING CORE 2.0
-- Purpose: Functional tables for real-time chat with internal notes support

-- 1. THREADS (Conversations)
CREATE TABLE IF NOT EXISTS public.messages_threads (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id uuid REFERENCES public.accounts(id) ON DELETE CASCADE,
    company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE,
    last_message_preview text,
    last_message_at timestamptz DEFAULT now(),
    unread_count_operator int DEFAULT 0,
    unread_count_client int DEFAULT 0,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamptz DEFAULT now()
);

-- 2. MESSAGES (Bubbles)
CREATE TABLE IF NOT EXISTS public.messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id uuid REFERENCES public.messages_threads(id) ON DELETE CASCADE,
    author_id uuid REFERENCES auth.users(id),
    body text NOT NULL,
    is_internal boolean DEFAULT false, -- If true, client cannot see it
    attachments jsonb DEFAULT '[]'::jsonb, -- Array of {name, url}
    created_at timestamptz DEFAULT now()
);

-- 3. RLS (Strict Multi-tenancy)
ALTER TABLE public.messages_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_threads_isolation" ON public.messages_threads FOR ALL TO authenticated
USING (account_id = (SELECT account_id FROM public.user_profiles WHERE id = auth.uid()));

CREATE POLICY "tenant_messages_isolation" ON public.messages FOR ALL TO authenticated
USING (
    thread_id IN (
        SELECT id FROM public.messages_threads 
        WHERE account_id = (SELECT account_id FROM public.user_profiles WHERE id = auth.uid())
    )
);

-- 4. RPC: SEND MESSAGE & UPDATE PREVIEW
CREATE OR REPLACE FUNCTION public.send_chat_message(
    p_thread_id uuid,
    p_body text,
    p_is_internal boolean DEFAULT false
) RETURNS uuid AS $$
DECLARE
    v_msg_id uuid;
BEGIN
    -- 1. Insert Message
    INSERT INTO public.messages (thread_id, author_id, body, is_internal)
    VALUES (p_thread_id, auth.uid(), p_body, p_is_internal)
    RETURNING id INTO v_msg_id;

    -- 2. Update Thread Preview (only if not internal, or always for operator)
    UPDATE public.messages_threads
    SET 
        last_message_preview = p_body,
        last_message_at = now(),
        unread_count_client = CASE WHEN NOT p_is_internal THEN unread_count_client + 1 ELSE unread_count_client END
    WHERE id = p_thread_id;

    RETURN v_msg_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. RPC: MARK AS READ
CREATE OR REPLACE FUNCTION public.mark_thread_read(p_thread_id uuid) 
RETURNS void AS $$
BEGIN
    UPDATE public.messages_threads
    SET unread_count_operator = 0
    WHERE id = p_thread_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
