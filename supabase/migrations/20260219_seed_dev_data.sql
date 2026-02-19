-- MIGRATION: SEED DEV DATA FUNCTION
-- Purpose: Populate system with realistic test data via RPC

-- 1. DROP IF EXISTS TO ENSURE FRESH REGISTRATION
DROP FUNCTION IF EXISTS public.seed_dev_data(int);

-- 2. CREATE FUNCTION
CREATE OR REPLACE FUNCTION public.seed_dev_data(p_companies int DEFAULT 20)
RETURNS jsonb AS $$
DECLARE
    v_user_id uuid;
    v_comp_id uuid;
    v_deal_id uuid;
    v_thread_id uuid;
    v_stage_keys text[] := ARRAY['LEAD', 'CONTRATADO', 'CNPJ', 'DOMINIO', 'EMAIL', 'SITE', 'MARCA', 'CONTABILIDADE', 'CONCLUIDO'];
    v_priorities text[] := ARRAY['LOW', 'NORMAL', 'HIGH', 'URGENT'];
    i int;
    j int;
    v_num_checklist int;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Must be authenticated to seed data';
    END IF;

    FOR i IN 1..p_companies LOOP
        -- Create Company
        INSERT INTO public.companies (name, cnpj, status, owner_id)
        VALUES (
            'Empresa de Teste ' || i, 
            LPAD(i::text, 14, '0'), 
            CASE WHEN i % 9 = 0 THEN 'DONE' ELSE 'ACTIVE' END, 
            v_user_id
        )
        RETURNING id INTO v_comp_id;

        -- Create Deal (Process)
        INSERT INTO public.deals (
            company_id, 
            stage_key, 
            title, 
            value_cents, 
            priority, 
            owner_id, 
            sla_due_at,
            sla_status
        )
        VALUES (
            v_comp_id, 
            v_stage_keys[(i % 9) + 1], 
            'Processo de Abertura #' || i, 
            (random() * 500000 + 100000)::bigint, 
            v_priorities[(i % 4) + 1], 
            v_user_id, 
            now() + (random() * interval '10 days' - interval '5 days'),
            CASE 
                WHEN (i % 3) = 0 THEN 'breached'
                WHEN (i % 3) = 1 THEN 'warning'
                ELSE 'ok'
            END
        )
        RETURNING id INTO v_deal_id;

        -- Create Checklists
        v_num_checklist := (random() * 5)::int;
        IF v_num_checklist > 0 THEN
            FOR j IN 1..v_num_checklist LOOP
                INSERT INTO public.deal_checklist_items (deal_id, title, done)
                VALUES (v_deal_id, 'Tarefa de Verificação ' || j, random() > 0.5);
            END LOOP;
        END IF;

        -- Create Thread & Initial Messages
        INSERT INTO public.messages_threads (company_id) VALUES (v_comp_id) RETURNING id INTO v_thread_id;
        
        INSERT INTO public.messages (thread_id, author_id, body) VALUES 
        (v_thread_id, v_user_id, 'Bem-vindo ao sistema Adworks! Iniciamos seu processo.'),
        (v_thread_id, v_user_id, 'Por favor, verifique a aba de documentos.');

    END LOOP;

    -- Update companies status if needed based on stages
    UPDATE public.companies SET status = 'DONE' WHERE id IN (SELECT company_id FROM deals WHERE stage_key = 'CONCLUIDO');

    RETURN jsonb_build_object(
        'success', true, 
        'message', 'Seeded ' || p_companies || ' companies and associated processes'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. GRANT PERMISSION
GRANT EXECUTE ON FUNCTION public.seed_dev_data TO authenticated;
