-- MIGRATION: v3 PATCH (SEED & RLS)
-- Robust seed and permissive RLS for dev continuity

-- 1. ADJUST TABLES FOR ROBUST SEED
ALTER TABLE public.companies ALTER COLUMN owner_id DROP NOT NULL;
ALTER TABLE public.deals ALTER COLUMN owner_id DROP NOT NULL;

-- 2. ENABLE RLS & PERMISSIVE POLICIES
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deal_checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deal_docs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    CREATE POLICY "Full access for authenticated" ON public.companies FOR ALL TO authenticated USING (true);
    CREATE POLICY "Full access for authenticated" ON public.deals FOR ALL TO authenticated USING (true);
    CREATE POLICY "Full access for authenticated" ON public.deal_checklist_items FOR ALL TO authenticated USING (true);
    CREATE POLICY "Full access for authenticated" ON public.deal_docs FOR ALL TO authenticated USING (true);
    CREATE POLICY "Full access for authenticated" ON public.messages_threads FOR ALL TO authenticated USING (true);
    CREATE POLICY "Full access for authenticated" ON public.messages FOR ALL TO authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 3. ROBUST SEED (NO AUTH DEPENDENCY)
DO $$
DECLARE
    v_comp_id uuid;
    v_deal_id uuid;
BEGIN
    -- Company 1
    INSERT INTO public.companies (name, cnpj, status) 
    VALUES ('Restaurante Sabor & Arte', '12.345.678/0001-99', 'ATIVO')
    ON CONFLICT (cnpj) DO NOTHING;
    
    SELECT id INTO v_comp_id FROM public.companies WHERE cnpj = '12.345.678/0001-99';

    -- Deal 1 (CNPJ)
    INSERT INTO public.deals (company_id, stage_key, title, value_cents, priority, sla_due_at, sla_status)
    VALUES (v_comp_id, 'CNPJ', 'Abertura de Filial Paulista', 250000, 'URGENT', now() - interval '1 day', 'breached')
    ON CONFLICT DO NOTHING;

    -- Deal 2 (Lead)
    INSERT INTO public.deals (company_id, stage_key, title, value_cents, priority, sla_due_at, sla_status)
    VALUES (v_comp_id, 'LEAD', 'Novo Contrato Consultoria', 180000, 'NORMAL', now() + interval '5 days', 'ok')
    ON CONFLICT DO NOTHING;

    SELECT id INTO v_deal_id FROM public.deals WHERE title = 'Abertura de Filial Paulista' LIMIT 1;

    -- Checklists
    INSERT INTO public.deal_checklist_items (deal_id, title, done) VALUES 
    (v_deal_id, 'Coletar RG Sócios', true),
    (v_deal_id, 'Assinar Contrato', false)
    ON CONFLICT DO NOTHING;
END $$;
