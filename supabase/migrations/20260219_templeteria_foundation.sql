
-- SCHEMA PARA O MÓDULO TEMPLETERIA (CRIADOR DE SITES)

-- 1. TABELA DE SITES
CREATE TABLE IF NOT EXISTS public.sites (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE,
    name text NOT NULL,
    subdomain text UNIQUE, -- Ex: sabor-e-arte
    custom_domain text UNIQUE, -- Ex: saborearte.com.br
    status text DEFAULT 'DRAFT', -- DRAFT, PUBLISHED, ARCHIVED
    theme_config jsonb DEFAULT '{}', -- Cores globais, fontes
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 2. TABELA DE PÁGINAS
CREATE TABLE IF NOT EXISTS public.pages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id uuid REFERENCES public.sites(id) ON DELETE CASCADE,
    title text NOT NULL,
    slug text NOT NULL, -- Ex: /home, /contato
    is_home boolean DEFAULT false,
    schema_json jsonb DEFAULT '{"sections": []}', -- A árvore de componentes
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(site_id, slug)
);

-- 3. VERSÕES DE PUBLICAÇÃO (Snapshot para Rollback)
CREATE TABLE IF NOT EXISTS public.site_versions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id uuid REFERENCES public.sites(id) ON DELETE CASCADE,
    version_number serial,
    schema_snapshot jsonb NOT NULL,
    created_by uuid REFERENCES public.user_profiles(id),
    created_at timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Equipe Adworks acessa sites" ON public.sites FOR ALL USING (true);
CREATE POLICY "Equipe Adworks acessa pages" ON public.pages FOR ALL USING (true);
CREATE POLICY "Clientes veem próprio site" ON public.sites FOR SELECT USING (EXISTS (SELECT 1 FROM client_memberships WHERE client_id = sites.client_id AND user_id = auth.uid()));
