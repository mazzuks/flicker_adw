
-- RESET TOTAL DA FUNÇÃO PARA GARANTIR COMPATIBILIDADE
DROP FUNCTION IF EXISTS public.seed_dev_data(p_companies int);
DROP FUNCTION IF EXISTS public.seed_dev_data();

CREATE OR REPLACE FUNCTION public.seed_dev_data()
RETURNS jsonb AS $$
DECLARE
    v_user_id uuid;
    v_comp_id uuid;
    v_deal_id uuid;
    v_thread_id uuid;
    v_stage_keys text[] := ARRAY['LEAD', 'CONTRATADO', 'CNPJ', 'DOMINIO', 'EMAIL', 'SITE', 'MARCA', 'CONTABILIDADE', 'CONCLUIDO'];
    v_priorities text[] := ARRAY['LOW', 'NORMAL', 'HIGH', 'URGENT'];
    i int;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Must be authenticated to seed data';
    END IF;

    -- Criar 20 empresas e processos
    FOR i IN 1..20 LOOP
        INSERT INTO public.companies (name, cnpj, status, owner_id)
        VALUES ('Empresa de Teste #' || i, LPAD(i::text, 14, '0'), 'ACTIVE', v_user_id)
        RETURNING id INTO v_comp_id;

        INSERT INTO public.deals (company_id, stage_key, title, value_cents, priority, owner_id, sla_due_at, sla_status)
        VALUES (v_comp_id, v_stage_keys[(i % 9) + 1], 'Projeto de Expansão #' || i, 250000, v_priorities[(i % 4) + 1], v_user_id, now() + (random() * interval '5 days'), 'ok')
        RETURNING id INTO v_deal_id;

        INSERT INTO public.messages_threads (company_id) VALUES (v_comp_id) RETURNING id INTO v_thread_id;
        INSERT INTO public.messages (thread_id, author_id, body) VALUES (v_thread_id, v_user_id, 'Iniciando atendimento.');
    END LOOP;

    RETURN jsonb_build_object('success', true, 'message', '20 empresas criadas');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.seed_dev_data() TO authenticated;
