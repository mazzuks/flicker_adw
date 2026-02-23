-- MIGRATION: FISCAL & ACCOUNTANCY MODULES (Agenda + Checklist)
-- Purpose: Implement the database structures for Fiscal Agenda and Accounting Checklist.
-- No emojis.

-- 1. FISCAL AGENDA TABLE
CREATE TABLE IF NOT EXISTS public.fiscal_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id uuid REFERENCES public.accounts(id) ON DELETE CASCADE NOT NULL,
    type text NOT NULL CHECK (type IN ('imposto', 'documento', 'pro_labore')),
    title text NOT NULL,
    due_date date NOT NULL,
    recurring boolean DEFAULT false,
    recurrence_rule text, -- ex: 'monthly'
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'done', 'overdue')),
    created_by uuid REFERENCES auth.users(id),
    created_at timestamptz DEFAULT now()
);

-- 2. ACCOUNTANCY CHECKLIST TABLE
CREATE TABLE IF NOT EXISTS public.account_checklist (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id uuid REFERENCES public.accounts(id) ON DELETE CASCADE NOT NULL UNIQUE,
    cnae_validado boolean DEFAULT false,
    regime_definido boolean DEFAULT false,
    certificado_emitido boolean DEFAULT false,
    conta_bancaria_criada boolean DEFAULT false,
    portal_fiscal_ativo boolean DEFAULT false,
    notes text,
    updated_by uuid REFERENCES auth.users(id),
    updated_at timestamptz DEFAULT now()
);

-- 3. TRIGGER FOR AUTOMATIC CHECKLIST CREATION
-- When a new account is created, automatically create its accounting checklist.
CREATE OR REPLACE FUNCTION public.handle_new_account_checklist()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.account_checklist (account_id)
    VALUES (NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_account_created_checklist ON public.accounts;
CREATE TRIGGER on_account_created_checklist
    AFTER INSERT ON public.accounts
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_account_checklist();

-- 4. RLS POLICIES
ALTER TABLE public.fiscal_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_checklist ENABLE ROW LEVEL SECURITY;

-- Fiscal Events Policies
CREATE POLICY "users_view_own_account_fiscal_events" ON public.fiscal_events
    FOR SELECT TO authenticated
    USING (account_id = (SELECT account_id FROM public.user_profiles WHERE id = auth.uid()));

CREATE POLICY "operators_manage_fiscal_events" ON public.fiscal_events
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role_global LIKE 'ADWORKS_%'));

-- Account Checklist Policies
CREATE POLICY "users_view_own_account_checklist" ON public.account_checklist
    FOR SELECT TO authenticated
    USING (account_id = (SELECT account_id FROM public.user_profiles WHERE id = auth.uid()));

CREATE POLICY "operators_manage_account_checklist" ON public.account_checklist
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role_global LIKE 'ADWORKS_%'));

-- 5. GRANTS
GRANT ALL ON public.fiscal_events TO authenticated;
GRANT ALL ON public.account_checklist TO authenticated;
