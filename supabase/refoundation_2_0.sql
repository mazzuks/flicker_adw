-- MIGRATION: REFOUNDATION 2.0 (ENTERPRISE SCHEMA)
-- Tables according to file_49 specs

-- 1. TENANTS
CREATE TABLE IF NOT EXISTS public.tenants (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- 2. USERS (Adjusted from profiles)
CREATE TABLE IF NOT EXISTS public.users (
    id uuid PRIMARY KEY REFERENCES auth.users(id),
    tenant_id uuid REFERENCES public.tenants(id),
    name text NOT NULL,
    email text UNIQUE NOT NULL,
    role text CHECK (role IN ('MASTER', 'OPERATOR', 'CLIENT')),
    created_at timestamptz DEFAULT now()
);

-- 3. COMPANIES
CREATE TABLE IF NOT EXISTS public.companies (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid REFERENCES public.tenants(id) ON DELETE CASCADE,
    legal_name text NOT NULL,
    trade_name text,
    cnpj text,
    status text CHECK (status IN ('ACTIVE', 'PAUSED', 'DONE')) DEFAULT 'ACTIVE',
    created_at timestamptz DEFAULT now()
);

-- 4. PIPELINES
CREATE TABLE IF NOT EXISTS public.pipelines (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid REFERENCES public.tenants(id) ON DELETE CASCADE,
    name text DEFAULT 'Empresa Pronta',
    created_at timestamptz DEFAULT now()
);

-- 5. STAGES (Lead -> Completed)
CREATE TABLE IF NOT EXISTS public.stages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    pipeline_id uuid REFERENCES public.pipelines(id) ON DELETE CASCADE,
    key text UNIQUE NOT NULL,
    name text NOT NULL,
    position int NOT NULL
);

-- 6. PROCESSES (The actual cards)
CREATE TABLE IF NOT EXISTS public.processes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid REFERENCES public.tenants(id) ON DELETE CASCADE,
    company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE,
    pipeline_id uuid REFERENCES public.pipelines(id) ON DELETE CASCADE,
    stage_key text NOT NULL,
    priority text CHECK (priority IN ('LOW', 'NORMAL', 'HIGH', 'URGENT')) DEFAULT 'NORMAL',
    contract_value_cents bigint DEFAULT 0,
    assigned_user_id uuid REFERENCES public.users(id),
    sla_due_at timestamptz,
    blocked_reason text,
    blocked_since timestamptz,
    updated_at timestamptz DEFAULT now(),
    created_at timestamptz DEFAULT now()
);

-- SEED STAGES
INSERT INTO public.stages (key, name, position) VALUES
('lead', 'Lead', 1),
('contracted', 'Contratado', 2),
('cnpj', 'CNPJ', 3),
('domain', 'Domínio', 4),
('email', 'E-mail', 5),
('site', 'Site', 6),
('brand', 'Marca', 7),
('accounting', 'Contabilidade', 8),
('completed', 'Concluído', 9)
ON CONFLICT (key) DO NOTHING;
