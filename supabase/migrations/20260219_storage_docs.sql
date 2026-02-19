-- MIGRATION: STORAGE FOUNDATIONS & DOCUMENT MANAGEMENT
-- Purpose: Setup Storage buckets, RLS for files, and enhanced deal_docs table

-- 1. STORAGE BUCKET SETUP
-- Note: Run this in the Supabase Dashboard if the 'storage' schema is not accessible via SQL
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('deal-docs', 'deal-docs', false, 10485760, ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- 2. ENHANCED DOCUMENT TABLE
DROP TABLE IF EXISTS public.deal_docs CASCADE;
CREATE TABLE public.deal_docs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id uuid REFERENCES public.accounts(id) ON DELETE CASCADE,
    deal_id uuid REFERENCES public.deals(id) ON DELETE CASCADE,
    name text NOT NULL,
    storage_path text NOT NULL, -- {account_id}/{deal_id}/{filename}
    file_type text,
    file_size bigint,
    uploaded_by uuid REFERENCES auth.users(id),
    created_at timestamptz DEFAULT now()
);

-- 3. STORAGE RLS POLICIES (Strict Tenant Isolation)
-- Policy: Only users from the same account can select files
CREATE POLICY "tenant_docs_isolation_select" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'deal-docs' AND (storage.foldername(name))[1] = (SELECT account_id::text FROM public.user_profiles WHERE id = auth.uid()));

-- Policy: Only users from the same account can insert files
CREATE POLICY "tenant_docs_isolation_insert" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'deal-docs' AND (storage.foldername(name))[1] = (SELECT account_id::text FROM public.user_profiles WHERE id = auth.uid()));

-- 4. ENABLE RLS ON TABLE
ALTER TABLE public.deal_docs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation_docs" ON public.deal_docs FOR ALL TO authenticated
USING (account_id = (SELECT account_id FROM public.user_profiles WHERE id = auth.uid()));
