-- MIGRATION: FISCAL MOTOR 2.0 (NF Requests & Fiscal Tickets)
-- Purpose: Implement the database structures for NF Requests and Operator Workflow.
-- No emojis.

-- 1. NF REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.nf_requests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id uuid REFERENCES public.accounts(id) ON DELETE CASCADE NOT NULL,
    requester_id uuid REFERENCES auth.users(id) NOT NULL,
    customer_cnpj_cpf text NOT NULL,
    amount_cents bigint NOT NULL,
    description text NOT NULL,
    service_date date DEFAULT CURRENT_DATE,
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'issued')),
    rejection_reason text,
    pdf_url text, -- Storage path for the issued NF
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 2. FISCAL TICKETS (Operator Work Queue)
CREATE TABLE IF NOT EXISTS public.fiscal_tickets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id uuid REFERENCES public.accounts(id) ON DELETE CASCADE NOT NULL,
    type text NOT NULL CHECK (type IN ('nf_issue', 'tax_calc', 'document_review', 'general')),
    priority text NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    assigned_to uuid REFERENCES auth.users(id),
    entity_id uuid, -- Reference to nf_requests.id, etc.
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 3. TRIGGER NF_REQUEST -> FISCAL_TICKET
-- Automatically open a fiscal ticket when an NF is requested.
CREATE OR REPLACE FUNCTION public.handle_nf_request_ticket()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.fiscal_tickets (account_id, type, priority, entity_id, status)
    VALUES (NEW.account_id, 'nf_issue', 'normal', NEW.id, 'open');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_nf_requested_open_ticket
    AFTER INSERT ON public.nf_requests
    FOR EACH ROW EXECUTE FUNCTION public.handle_nf_request_ticket();

-- 4. RLS POLICIES
ALTER TABLE public.nf_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fiscal_tickets ENABLE ROW LEVEL SECURITY;

-- NF Requests
CREATE POLICY "users_manage_own_nf_requests" ON public.nf_requests
    FOR ALL TO authenticated
    USING (account_id = (SELECT account_id FROM public.user_profiles WHERE id = auth.uid()));

-- Fiscal Tickets (Internal only)
CREATE POLICY "internal_manage_fiscal_tickets" ON public.fiscal_tickets
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role_global LIKE 'ADWORKS_%'));

-- 5. GRANTS
GRANT ALL ON public.nf_requests TO authenticated;
GRANT ALL ON public.fiscal_tickets TO authenticated;
