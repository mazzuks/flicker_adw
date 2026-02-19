-- MIGRATION: REFOUNDATION 3.0 (SCHEMA FIX)
-- Purpose: Create missing tables and views to resolve "relation does not exist" errors

-- 1. COMPANIES (The Core Entity)
CREATE TABLE IF NOT EXISTS public.companies (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    cnpj text UNIQUE,
    status text CHECK (status IN ('LEAD', 'CONTRATADO', 'ATIVO', 'PAUSADO')) DEFAULT 'LEAD',
    owner_id uuid REFERENCES auth.users(id),
    created_at timestamptz DEFAULT now()
);

-- 2. DEALS (The Processes)
CREATE TABLE IF NOT EXISTS public.deals (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE,
    stage_key text NOT NULL DEFAULT 'LEAD',
    title text NOT NULL,
    value_cents bigint DEFAULT 0,
    priority text CHECK (priority IN ('LOW','NORMAL','HIGH','URGENT')) DEFAULT 'NORMAL',
    owner_id uuid REFERENCES auth.users(id),
    sla_due_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 3. SUPPORT TABLES
CREATE TABLE IF NOT EXISTS public.deal_checklist_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_id uuid REFERENCES public.deals(id) ON DELETE CASCADE,
    title text NOT NULL,
    done boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.deal_docs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_id uuid REFERENCES public.deals(id) ON DELETE CASCADE,
    name text NOT NULL,
    url text NOT NULL,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.messages_threads (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE,
    last_message_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id uuid REFERENCES public.messages_threads(id) ON DELETE CASCADE,
    author_id uuid REFERENCES auth.users(id),
    body text NOT NULL,
    is_internal boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
);

-- 4. KANBAN & KPI VIEW (The Star of the Dashboard)
CREATE OR REPLACE VIEW v_deals_board AS
SELECT 
    d.*,
    c.name as company_name,
    c.cnpj as company_cnpj,
    (SELECT count(*) FROM deal_checklist_items WHERE deal_id = d.id) as checklist_total,
    (SELECT count(*) FROM deal_checklist_items WHERE deal_id = d.id AND done = true) as checklist_done,
    (SELECT count(*) FROM deal_docs WHERE deal_id = d.id) as docs_count,
    CASE 
        WHEN d.sla_due_at < now() THEN 'breached'
        WHEN d.sla_due_at < (now() + interval '48 hours') THEN 'warning'
        ELSE 'ok'
    END as sla_status
FROM deals d
JOIN companies c ON d.company_id = c.id;

-- 5. RLS (Enable all for authenticated to unblock dev)
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deal_checklist_items ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    CREATE POLICY "dev_all_access" ON public.companies FOR ALL TO authenticated USING (true);
    CREATE POLICY "dev_all_access" ON public.deals FOR ALL TO authenticated USING (true);
    CREATE POLICY "dev_all_access" ON public.deal_checklist_items FOR ALL TO authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 6. FINAL SEED FUNCTION (RPC)
CREATE OR REPLACE FUNCTION public.seed_dev_data()
RETURNS jsonb AS $$
DECLARE
    v_user_id uuid;
    v_comp_id uuid;
    v_deal_id uuid;
    v_stage_keys text[] := ARRAY['LEAD', 'CONTRATADO', 'CNPJ', 'DOMINIO', 'EMAIL', 'SITE', 'MARCA', 'CONTABILIDADE', 'CONCLUIDO'];
    i int;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN RAISE EXCEPTION 'Must be authenticated'; END IF;

    FOR i IN 1..20 LOOP
        INSERT INTO public.companies (name, cnpj, status, owner_id)
        VALUES ('Empresa Seed #' || i, LPAD(i::text, 14, '0'), 'ACTIVE', v_user_id)
        RETURNING id INTO v_comp_id;

        INSERT INTO public.deals (company_id, stage_key, title, value_cents, priority, owner_id, sla_due_at)
        VALUES (v_comp_id, v_stage_keys[(i % 9) + 1], 'Processo de Abertura #' || i, 250000, 'NORMAL', v_user_id, now() + (random() * interval '10 days'))
        RETURNING id INTO v_deal_id;
    END LOOP;

    RETURN jsonb_build_object('success', true, 'message', '20 empresas criadas');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.seed_dev_data() TO authenticated;
