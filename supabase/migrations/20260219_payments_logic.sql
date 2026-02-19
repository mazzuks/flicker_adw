-- MIGRATION: WEBHOOK & TENANT STATUS LOGIC
-- Purpose: Create tables for payment tracking and automate tenant status updates

-- 1. PAYMENT INVOICES
CREATE TABLE IF NOT EXISTS public.payments_invoices (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id uuid REFERENCES public.accounts(id) ON DELETE CASCADE,
    provider text NOT NULL DEFAULT 'pagbank',
    provider_invoice_id text UNIQUE,
    amount_cents bigint NOT NULL,
    status text CHECK (status IN ('PENDING', 'PAID', 'CANCELED', 'EXPIRED')) DEFAULT 'PENDING',
    due_at timestamptz,
    paid_at timestamptz,
    created_at timestamptz DEFAULT now()
);

-- 2. WEBHOOK EVENTS LOG
CREATE TABLE IF NOT EXISTS public.payments_webhooks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    provider text NOT NULL,
    payload jsonb NOT NULL,
    processed_at timestamptz DEFAULT now()
);

-- 3. AUTOMATIC STATUS UPDATE TRIGGER
-- When an invoice is PAID, update the account status to 'active'
CREATE OR REPLACE FUNCTION public.handle_payment_success()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'PAID' THEN
        UPDATE public.accounts 
        SET plan = 'active'
        WHERE id = NEW.account_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_payment_success ON public.payments_invoices;
CREATE TRIGGER on_payment_success
    AFTER UPDATE OF status ON public.payments_invoices
    FOR EACH ROW
    WHEN (OLD.status IS DISTINCT FROM NEW.status)
    EXECUTE FUNCTION public.handle_payment_success();

-- 4. RLS FOR INVOICES
ALTER TABLE public.payments_invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenant_invoice_isolation" ON public.payments_invoices FOR SELECT TO authenticated
USING (account_id = (SELECT account_id FROM public.user_profiles WHERE id = auth.uid()));

GRANT SELECT ON public.payments_invoices TO authenticated;
