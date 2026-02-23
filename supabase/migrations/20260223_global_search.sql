-- MIGRATION: GLOBAL SEARCH RPC
-- Purpose: Support multi-table search for the AppShell command center.
-- No emojis.

CREATE OR REPLACE FUNCTION public.global_search(p_query text)
RETURNS jsonb AS $$
DECLARE
    v_results jsonb := '[]'::jsonb;
    v_user_acc uuid;
BEGIN
    -- 1. Get user's account context
    SELECT account_id INTO v_user_acc FROM public.user_profiles WHERE id = auth.uid();

    -- 2. Search Companies
    WITH comp_search AS (
        SELECT 
            id, 
            name as title, 
            cnpj as subtitle, 
            'company' as type,
            '/app/companies' as path
        FROM public.companies
        WHERE account_id = v_user_acc
        AND (name ILIKE '%' || p_query || '%' OR cnpj ILIKE '%' || p_query || '%')
        LIMIT 5
    ),
    -- 3. Search Sites
    site_search AS (
        SELECT 
            id, 
            name as title, 
            slug as subtitle, 
            'site' as type,
            '/app/templeteria/sites' as path
        FROM public.templeteria_sites
        WHERE account_id = v_user_acc
        AND (name ILIKE '%' || p_query || '%' OR slug ILIKE '%' || p_query || '%')
        LIMIT 5
    )
    -- 4. Combine Results
    SELECT jsonb_agg(r) INTO v_results FROM (
        SELECT * FROM comp_search
        UNION ALL
        SELECT * FROM site_search
    ) r;

    RETURN COALESCE(v_results, '[]'::jsonb);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.global_search TO authenticated;
