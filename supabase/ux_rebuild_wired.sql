-- MIGRATION: ENTERPRISE UX REBUILD (SUPABASE WIRED)
-- Tables and initial seed for the refined core flow

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name text NOT NULL,
    email text UNIQUE NOT NULL,
    role text CHECK (role IN ('SUPERADMIN', 'OPERATOR', 'CLIENT')) DEFAULT 'CLIENT',
    created_at timestamptz DEFAULT now()
);

-- 2. COMPANIES
CREATE TABLE IF NOT EXISTS public.companies (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    cnpj text UNIQUE,
    status text CHECK (status IN ('LEAD', 'CONTRATADO', 'ATIVO', 'PAUSADO')) DEFAULT 'LEAD',
    owner_id uuid REFERENCES public.profiles(id),
    created_at timestamptz DEFAULT now()
);

-- 3. PIPELINES
CREATE TABLE IF NOT EXISTS public.pipelines (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    is_default boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
);

-- 4. PIPELINE STAGES
CREATE TABLE IF NOT EXISTS public.pipeline_stages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    pipeline_id uuid REFERENCES public.pipelines(id) ON DELETE CASCADE,
    key text NOT NULL, -- LEAD, CONTRATADO, CNPJ, DOMINIO, EMAIL, SITE, MARCA, CONTABILIDADE
    title text NOT NULL,
    order_index int NOT NULL,
    UNIQUE(pipeline_id, key)
);

-- 5. DEALS (PROCESSES)
CREATE TABLE IF NOT EXISTS public.deals (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE,
    pipeline_id uuid REFERENCES public.pipelines(id) ON DELETE CASCADE,
    stage_id uuid REFERENCES public.pipeline_stages(id),
    title text NOT NULL,
    value_cents bigint DEFAULT 0,
    priority text CHECK (priority IN ('LOW', 'NORMAL', 'HIGH', 'URGENT')) DEFAULT 'NORMAL',
    owner_id uuid REFERENCES public.profiles(id),
    sla_due_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 6. SUPPORT TABLES (Checklists, Docs, Messages)
CREATE TABLE IF NOT EXISTS public.deal_checklists (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_id uuid REFERENCES public.deals(id) ON DELETE CASCADE,
    title text NOT NULL DEFAULT 'Checklist'
);

CREATE TABLE IF NOT EXISTS public.deal_checklist_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    checklist_id uuid REFERENCES public.deal_checklists(id) ON DELETE CASCADE,
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

-- SEED: INITIAL PIPELINE
DO $$
DECLARE
    p_id uuid;
BEGIN
    INSERT INTO public.pipelines (name, is_default) VALUES ('Empresa Pronta', true) RETURNING id INTO p_id;

    INSERT INTO public.pipeline_stages (pipeline_id, key, title, order_index) VALUES
    (p_id, 'LEAD', 'Lead', 1),
    (p_id, 'CONTRATADO', 'Contratado', 2),
    (p_id, 'CNPJ', 'CNPJ', 3),
    (p_id, 'DOMINIO', 'Domínio', 4),
    (p_id, 'EMAIL', 'E-mail', 5),
    (p_id, 'SITE', 'Site', 6),
    (p_id, 'MARCA', 'Marca', 7),
    (p_id, 'CONTABILIDADE', 'Contabilidade', 8)
    ON CONFLICT DO NOTHING;
END $$;

-- ENABLE RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;

-- POLICIES (BASIC)
CREATE POLICY "Superadmin sees all" ON public.profiles FOR ALL USING (true);
CREATE POLICY "Operators see profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Clients see own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
