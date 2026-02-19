-- MIGRATION: SUPABASE-WIRED ENTERPRISE SCHEMA (v3)
-- Final architecture for real data fetching

-- 1. COMPANIES
CREATE TABLE IF NOT EXISTS public.companies (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    cnpj text UNIQUE,
    status text CHECK (status IN ('LEAD', 'CONTRATADO', 'ATIVO', 'PAUSADO')) DEFAULT 'LEAD',
    owner_id uuid REFERENCES auth.users(id),
    created_at timestamptz DEFAULT now()
);

-- 2. PIPELINE STAGES (Simplified Mapping)
-- Final keys: LEAD, CONTRATADO, CNPJ, DOMINIO, EMAIL, SITE, MARCA, CONTABILIDADE, CONCLUIDO

-- 3. DEALS (PROCESSES)
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

-- 4. COMPONENTS: CHECKLISTS, DOCS, MESSAGES
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

CREATE TABLE IF NOT EXISTS public.events_audit (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id uuid REFERENCES auth.users(id),
    entity_type text NOT NULL,
    entity_id uuid NOT NULL,
    action text NOT NULL,
    payload_json jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now()
);

-- 5. PERFORMANCE VIEW (O Coração da Dashboard)
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

-- SEED DATA
DO $$
DECLARE
    v_user_id uuid;
    v_comp_id uuid;
    v_deal_id uuid;
BEGIN
    SELECT id INTO v_user_id FROM auth.users LIMIT 1;
    
    IF v_user_id IS NOT NULL THEN
        INSERT INTO companies (name, cnpj, status, owner_id) 
        VALUES ('Restaurante Sabor & Arte', '12.345.678/0001-99', 'ATIVO', v_user_id)
        RETURNING id INTO v_comp_id;

        INSERT INTO deals (company_id, stage_key, title, value_cents, priority, owner_id, sla_due_at)
        VALUES (v_comp_id, 'CNPJ', 'Processo de Abertura Local', 250000, 'URGENT', v_user_id, now() - interval '1 day')
        RETURNING id INTO v_deal_id;

        INSERT INTO deal_checklist_items (deal_id, title, done) VALUES 
        (v_deal_id, 'Coletar RG Sócios', true),
        (v_deal_id, 'Assinar Contrato', false);
    END IF;
END $$;
