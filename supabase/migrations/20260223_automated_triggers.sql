-- MIGRATION: AUTOMATED NOTIFICATIONS & EMAILS
-- Purpose: Trigger notifications and emails for critical business events.
-- No emojis.

-- 1. TRIGGER FUNCTION: WELCOME NOTIFICATION
CREATE OR REPLACE FUNCTION public.handle_new_user_welcome()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM public.send_notification(
        NEW.account_id,
        'Bem-vindo ao Adworks!',
        'Ola ' || COALESCE(NEW.full_name, 'Usuario') || ', sua conta foi configurada com sucesso. Comece gerindo seus sites ou acompanhando o setup contabil.',
        'system',
        '/app/home',
        NEW.id
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_user_profile_created_welcome
    AFTER INSERT ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_welcome();

-- 2. TRIGGER FUNCTION: DAS GUIDE NOTIFICATION
CREATE OR REPLACE FUNCTION public.handle_new_das_guide()
RETURNS TRIGGER AS $$
DECLARE
    v_owner_id uuid;
BEGIN
    -- Get the owner of the account
    SELECT id INTO v_owner_id FROM public.user_profiles WHERE account_id = NEW.account_id AND role_global = 'CLIENT_OWNER' LIMIT 1;

    PERFORM public.send_notification(
        NEW.account_id,
        'Guia DAS Disponivel',
        'A guia de imposto referente ao mes ' || TO_CHAR(NEW.month_ref, 'MM/YYYY') || ' ja esta disponivel para download.',
        'fiscal',
        '/app/company/das',
        v_owner_id
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_das_guide_published
    AFTER INSERT ON public.das_guides
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_das_guide();

-- 3. TRIGGER FUNCTION: NF REQUEST STATUS CHANGE
CREATE OR REPLACE FUNCTION public.handle_nf_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF (OLD.status IS DISTINCT FROM NEW.status) THEN
        PERFORM public.send_notification(
            NEW.account_id,
            'Atualizacao de Nota Fiscal',
            'Sua solicitacao de nota para o tomador ' || NEW.customer_cnpj_cpf || ' mudou para: ' || UPPER(NEW.status),
            'fiscal',
            '/app/company/nf-requests',
            NEW.requester_id
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_nf_request_status_updated
    AFTER UPDATE OF status ON public.nf_requests
    FOR EACH ROW EXECUTE FUNCTION public.handle_nf_status_change();
