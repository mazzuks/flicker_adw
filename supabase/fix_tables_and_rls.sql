-- SQL para liberar tabelas e remover erros 404/RLS
-- Execute isso no SQL Editor do Supabase

-- 1. Garantir que as tabelas de suporte existam
CREATE TABLE IF NOT EXISTS public.leads (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE,
    form_id uuid,
    name text NOT NULL,
    email text,
    phone text,
    source text,
    tags_json jsonb DEFAULT '[]',
    stage text DEFAULT 'NOVO',
    owner_user_id uuid,
    custom_fields jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 2. Liberar RLS para o script de seed
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anon insert for leads" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon select for leads" ON public.leads FOR SELECT USING (true);

ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anon insert for messages" ON public.ticket_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon select for messages" ON public.ticket_messages FOR SELECT USING (true);
