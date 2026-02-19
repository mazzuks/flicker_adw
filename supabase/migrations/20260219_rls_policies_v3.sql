-- MIGRATION: RLS POLICIES v3
-- Purpose: Enable dev continuity and secure multi-tenancy

-- 1. ENABLE RLS ON ALL CORE TABLES
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deal_checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deal_docs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events_audit ENABLE ROW LEVEL SECURITY;

-- 2. POLICIES: COMPANIES
-- Masters/Operators see all, Clients see only theirs
CREATE POLICY "Staff can do everything on companies" 
ON public.companies FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('SUPERADMIN', 'OPERATOR')
  )
);

CREATE POLICY "Clients see own companies" 
ON public.companies FOR SELECT 
USING (owner_id = auth.uid());

-- 3. POLICIES: DEALS (JOIN via company)
CREATE POLICY "Staff can manage all deals" 
ON public.deals FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('SUPERADMIN', 'OPERATOR')
  )
);

CREATE POLICY "Clients see own deals" 
ON public.deals FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.companies 
    WHERE id = deals.company_id AND owner_id = auth.uid()
  )
);

-- 4. POLICIES: CHECKLISTS & DOCS
CREATE POLICY "Access via deal ownership" 
ON public.deal_checklist_items FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.deals d
    JOIN public.companies c ON d.company_id = c.id
    WHERE d.id = deal_checklist_items.deal_id 
    AND (c.owner_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('SUPERADMIN', 'OPERATOR')))
  )
);

-- 5. RPC SEED FUNCTION
CREATE OR REPLACE FUNCTION public.seed_dev_data(p_companies int default 20)
RETURNS jsonb AS $$
DECLARE
    v_user_id uuid;
    v_comp_id uuid;
    v_deal_id uuid;
    v_stage_keys text[] := ARRAY['LEAD', 'CONTRATADO', 'CNPJ', 'DOMINIO', 'EMAIL', 'SITE', 'MARCA', 'CONTABILIDADE', 'CONCLUIDO'];
    i int;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Must be authenticated to seed data';
    END IF;

    FOR i IN 1..p_companies LOOP
        INSERT INTO public.companies (name, cnpj, status, owner_id)
        VALUES ('Empresa Seed ' || i, '00.000.000/000' || i || '-00', 'LEAD', v_user_id)
        RETURNING id INTO v_comp_id;

        INSERT INTO public.deals (company_id, stage_key, title, value_cents, priority, owner_id, sla_due_at)
        VALUES (v_comp_id, v_stage_keys[(i % 9) + 1], 'Processo ' || i, (random() * 1000000)::bigint, 'NORMAL', v_user_id, now() + (random() * interval '10 days'))
        RETURNING id INTO v_deal_id;
    END LOOP;

    RETURN jsonb_build_object('success', true, 'message', 'Seeded ' || p_companies || ' companies');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
