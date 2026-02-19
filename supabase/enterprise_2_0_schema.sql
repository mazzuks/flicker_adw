-- MIGRATION: ENTERPRISE 2.0 (PIPEDRIVE/TRELLO ENGINE)
-- Final schema according to file_50 specs

-- 1. COMPANIES
CREATE TABLE IF NOT EXISTS public.companies (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid REFERENCES public.tenants(id) ON DELETE CASCADE,
    legal_name text NOT NULL,
     trade_name text,
    document text, -- CNPJ
    segment text,
    created_at timestamptz DEFAULT now()
);

-- 2. PIPELINES & STAGES
CREATE TABLE IF NOT EXISTS public.pipelines (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.stages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    pipeline_id uuid REFERENCES public.pipelines(id) ON DELETE CASCADE,
    name text NOT NULL,
    key text NOT NULL,
    "order" int NOT NULL,
    sla_days int DEFAULT 5,
    color text,
    UNIQUE(pipeline_id, key)
);

-- 3. DEALS (PROCESSES)
CREATE TABLE IF NOT EXISTS public.deals (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE,
    title text NOT NULL,
    value_cents bigint DEFAULT 0,
    priority text CHECK (priority IN ('LOW','NORMAL','HIGH','URGENT')) DEFAULT 'NORMAL',
    stage_id uuid REFERENCES public.stages(id),
    owner_id uuid REFERENCES public.users(id),
    stage_entered_at timestamptz DEFAULT now(),
    sla_due_at timestamptz,
    sla_status text CHECK (sla_status IN ('ok','warning','breached')) DEFAULT 'ok',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 4. COLLABORATION & ACTIVITY
CREATE TABLE IF NOT EXISTS public.deal_comments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_id uuid REFERENCES public.deals(id) ON DELETE CASCADE,
    user_id uuid REFERENCES public.users(id),
    body text NOT NULL,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.deal_activities (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_id uuid REFERENCES public.deals(id) ON DELETE CASCADE,
    user_id uuid REFERENCES public.users(id),
    type text NOT NULL, -- moved_stage, changed_owner, etc
    payload_json jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now()
);

-- SEED CORE PIPELINE
DO $$
DECLARE
    p_id uuid;
BEGIN
    INSERT INTO public.pipelines (name) VALUES ('Empresa Pronta') RETURNING id INTO p_id;

    INSERT INTO public.stages (pipeline_id, name, key, "order", sla_days) VALUES
    (p_id, 'Lead', 'lead', 1, 2),
    (p_id, 'Contratado', 'contracted', 2, 1),
    (p_id, 'CNPJ', 'cnpj', 3, 5),
    (p_id, 'Domínio', 'domain', 4, 1),
    (p_id, 'E-mail', 'email', 5, 1),
    (p_id, 'Site', 'site', 6, 7),
    (p_id, 'Marca', 'brand', 7, 20),
    (p_id, 'Contabilidade', 'accounting', 8, 30),
    (p_id, 'Concluído', 'completed', 9, 0);
END $$;
