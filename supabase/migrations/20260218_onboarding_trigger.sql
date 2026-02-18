
-- Função para disparar a automação quando o onboarding é finalizado
CREATE OR REPLACE FUNCTION public.handle_onboarding_completion()
RETURNS TRIGGER AS $$
DECLARE
  v_all_approved boolean;
BEGIN
  -- Verificar se todos os 12 passos estão APPROVED ou SUBMITTED
  SELECT COUNT(*) = 0 INTO v_all_approved
  FROM onboarding_steps
  WHERE client_id = NEW.client_id
  AND status NOT IN ('APPROVED', 'SUBMITTED');

  -- Se tudo estiver pronto, chama a automação via Webhook Interno
  -- (Poderia ser um Edge Function call direto via HTTP se configurado)
  IF v_all_approved THEN
    -- Aqui apenas logamos ou inserimos em uma fila de processamento
    INSERT INTO public.audit_logs (
      client_id,
      action,
      entity_type,
      meta_json
    ) VALUES (
      NEW.client_id,
      'ONBOARDING_COMPLETED_AUTO_TRIGGER',
      'onboarding',
      jsonb_build_object('timestamp', now())
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para monitorar a finalização
DROP TRIGGER IF EXISTS trigger_onboarding_automation ON public.onboarding_steps;
CREATE TRIGGER trigger_onboarding_automation
  AFTER UPDATE ON public.onboarding_steps
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_onboarding_completion();
