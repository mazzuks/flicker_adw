-- MIGRATION: FISCAL DAS 5.0 (Manual Guide Upload)
-- Purpose: Support manual DAS guide management with storage integration.
-- No emojis.

-- 1. STORAGE BUCKET SETUP
-- Ensure bucket exists for DAS guides
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('das-guides', 'das-guides', false, 10485760, ARRAY['application/pdf'])
ON CONFLICT (id) DO NOTHING;

-- 2. DAS GUIDES TABLE
CREATE TABLE IF NOT EXISTS public.das_guides (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id uuid REFERENCES public.accounts(id) ON DELETE CASCADE NOT NULL,
    month_ref date NOT NULL, -- Reference: YYYY-MM-01
    storage_path text NOT NULL,
    status text NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'replaced')),
    created_by uuid REFERENCES auth.users(id),
    created_at timestamptz DEFAULT now(),
    CONSTRAINT das_guides_account_month_unique UNIQUE (account_id, month_ref)
);

-- 3. RLS POLICIES (Strict Tenant Isolation)
ALTER TABLE public.das_guides ENABLE ROW LEVEL SECURITY;

-- Cliente: SELECT own account
CREATE POLICY "users_view_own_das_guides" ON public.das_guides
    FOR SELECT TO authenticated
    USING (account_id = (SELECT account_id FROM public.user_profiles WHERE id = auth.uid()));

-- Operador/Admin: ALL
CREATE POLICY "operators_manage_das_guides" ON public.das_guides
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role_global LIKE 'ADWORKS_%'));

-- Storage Policies
CREATE POLICY "tenant_das_isolation_select" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'das-guides' AND (storage.foldername(name))[1] = (SELECT account_id::text FROM public.user_profiles WHERE id = auth.uid()));

CREATE POLICY "tenant_das_isolation_insert" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'das-guides' AND (storage.foldername(name))[1] = (SELECT account_id::text FROM public.user_profiles WHERE id = auth.uid()));

-- 4. GRANTS
GRANT ALL ON public.das_guides TO authenticated;
