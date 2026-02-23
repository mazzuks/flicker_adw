-- MIGRATION: PRODUCT FINANCIAL DASHBOARD 4.0 (Admin BI)
-- Purpose: Implement subscriptions tracking and high-level product metrics for Admin.
-- No emojis.

-- 1. SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id uuid REFERENCES public.accounts(id) ON DELETE CASCADE NOT NULL,
    plan_name text NOT NULL,
    status text NOT NULL CHECK (status IN ('active', 'canceled', 'trial')),
    price_monthly numeric(15,2) NOT NULL DEFAULT 0,
    started_at timestamptz DEFAULT now(),
    canceled_at timestamptz,
    created_at timestamptz DEFAULT now()
);

-- 2. RLS POLICIES
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Admin ONLY: Select/All
CREATE POLICY "admin_manage_subscriptions" ON public.subscriptions
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role_global = 'ADWORKS_SUPERADMIN'));

-- 3. PRODUCT METRICS VIEW
CREATE OR REPLACE VIEW public.v_product_finance_bi AS
WITH stats AS (
    SELECT 
        COALESCE(SUM(price_monthly), 0) as total_mrr,
        COUNT(*) filter (where status = 'active') as active_count,
        COUNT(*) filter (where status = 'canceled' AND canceled_at >= (now() - interval '30 days')) as churn_30d_count
    FROM public.subscriptions
)
SELECT 
    total_mrr as accumulated_revenue,
    CASE WHEN active_count > 0 THEN total_mrr / active_count ELSE 0 END as avg_revenue_per_user,
    CASE WHEN active_count > 0 THEN total_mrr / active_count ELSE 0 END as ticket_average,
    CASE WHEN (active_count + churn_30d_count) > 0 
         THEN (churn_30d_count::numeric / (active_count + churn_30d_count)) * 100 
         ELSE 0 END as churn_rate_30d
FROM stats;

-- 4. GRANTS
GRANT SELECT ON public.v_product_finance_bi TO authenticated;
GRANT ALL ON public.subscriptions TO authenticated;
