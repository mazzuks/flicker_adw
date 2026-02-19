-- MIGRATION: RBAC & MULTI-TENANCY FOUNDATIONS
-- Purpose: Implement User Profiles, Roles, and Multi-tenant logic (tenant_id)

-- 1. ACCOUNTS / TENANTS (The containers)
CREATE TABLE IF NOT EXISTS public.accounts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    plan text CHECK (plan IN ('trial', 'active', 'past_due', 'suspended')) DEFAULT 'trial',
    settings jsonb DEFAULT '{}'::jsonb,
    created_at timestamptz DEFAULT now()
);

-- 2. USER PROFILES (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    account_id uuid REFERENCES public.accounts(id) ON DELETE CASCADE,
    full_name text,
    role text CHECK (role IN ('OWNER', 'MANAGER', 'OPERATOR', 'CLIENT')) DEFAULT 'CLIENT',
    avatar_url text,
    created_at timestamptz DEFAULT now()
);

-- 3. UPDATING CORE TABLES FOR MULTI-TENANCY
-- Add account_id to existing tables if not present
DO $$ BEGIN
    ALTER TABLE public.companies ADD COLUMN account_id uuid REFERENCES public.accounts(id) ON DELETE CASCADE;
    ALTER TABLE public.deals ADD COLUMN account_id uuid REFERENCES public.accounts(id) ON DELETE CASCADE;
    ALTER TABLE public.messages_threads ADD COLUMN account_id uuid REFERENCES public.accounts(id) ON DELETE CASCADE;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

-- 4. EVENTS AUDIT (The real audit trail)
CREATE TABLE IF NOT EXISTS public.events_audit (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id uuid REFERENCES public.accounts(id) ON DELETE CASCADE,
    actor_id uuid REFERENCES auth.users(id),
    entity_type text NOT NULL, -- 'deal', 'company', 'message', etc.
    entity_id uuid NOT NULL,
    action text NOT NULL, -- 'created', 'moved', 'uploaded', 'sent'
    payload_json jsonb DEFAULT '{}'::jsonb,
    created_at timestamptz DEFAULT now()
);

-- 5. DASHBOARD STATS VIEWS (Replacing hardcode)
CREATE OR REPLACE VIEW public.v_dashboard_kpis AS
SELECT 
    p.account_id,
    COALESCE(SUM(d.value_cents), 0) as total_pipeline_value,
    COUNT(d.id) as active_deals_count,
    COALESCE(AVG(EXTRACT(EPOCH FROM (d.sla_due_at - now())) / 86400), 0) as avg_sla_days,
    COUNT(CASE WHEN d.sla_due_at < now() THEN 1 END) as breached_count
FROM public.user_profiles p
LEFT JOIN public.deals d ON d.account_id = p.account_id AND d.stage_key != 'CONCLUIDO'
GROUP BY p.account_id;

CREATE OR REPLACE VIEW public.v_stage_stats AS
SELECT 
    account_id,
    stage_key,
    COUNT(*) as deals_count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (PARTITION BY account_id), 1) as pct_total,
    COALESCE(AVG(EXTRACT(EPOCH FROM (sla_due_at - now())) / 86400), 0) as avg_sla_days
FROM public.deals
GROUP BY account_id, stage_key;

-- 6. RLS POLICIES (Strict isolation)
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;

-- Dynamic Policy: Filter by user's account_id
CREATE OR REPLACE FUNCTION public.get_user_account() RETURNS uuid AS $$
  SELECT account_id FROM public.user_profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE;

DO $$ BEGIN
    -- COMPANIES
    CREATE POLICY "tenant_isolation" ON public.companies FOR ALL TO authenticated 
    USING (account_id = public.get_user_account());
    
    -- DEALS
    CREATE POLICY "tenant_isolation" ON public.deals FOR ALL TO authenticated 
    USING (account_id = public.get_user_account());
    
    -- PROFILES
    CREATE POLICY "self_profile" ON public.user_profiles FOR ALL TO authenticated 
    USING (id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 7. GRANT PERMISSIONS
GRANT SELECT ON public.v_dashboard_kpis TO authenticated;
GRANT SELECT ON public.v_stage_stats TO authenticated;
