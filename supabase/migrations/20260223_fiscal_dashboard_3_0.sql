-- MIGRATION: FISCAL DASHBOARD 3.0 (Financial Metrics)
-- Purpose: Implement simplified financial metrics for client viewing.
-- No emojis.

-- 1. FINANCIAL METRICS TABLE
CREATE TABLE IF NOT EXISTS public.company_finance_metrics (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id uuid REFERENCES public.accounts(id) ON DELETE CASCADE NOT NULL,
    month_ref date NOT NULL, -- Reference: YYYY-MM-01
    revenue_month numeric(15,2) DEFAULT 0,
    revenue_accum numeric(15,2) DEFAULT 0,
    taxes_paid numeric(15,2) DEFAULT 0,
    taxes_open numeric(15,2) DEFAULT 0,
    updated_by uuid REFERENCES auth.users(id),
    updated_at timestamptz DEFAULT now(),
    CONSTRAINT company_finance_metrics_account_month_unique UNIQUE (account_id, month_ref)
);

-- 2. RLS POLICIES
ALTER TABLE public.company_finance_metrics ENABLE ROW LEVEL SECURITY;

-- Cliente: SELECT own account
CREATE POLICY "users_view_own_finance_metrics" ON public.company_finance_metrics
    FOR SELECT TO authenticated
    USING (account_id = (SELECT account_id FROM public.user_profiles WHERE id = auth.uid()));

-- Operador/Admin: SELECT + UPSERT (ALL)
CREATE POLICY "operators_manage_finance_metrics" ON public.company_finance_metrics
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role_global LIKE 'ADWORKS_%'));

-- 3. GRANTS
GRANT ALL ON public.company_finance_metrics TO authenticated;
