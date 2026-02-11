
-- Tabela para gerenciar a fila de emails (evita perda de dados se a API de email falhar)
CREATE TABLE IF NOT EXISTS public.email_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id uuid REFERENCES public.notifications(id),
  to_email text NOT NULL,
  subject text NOT NULL,
  body_html text NOT NULL,
  status text DEFAULT 'PENDING', -- PENDING, SENT, FAILED
  error_message text,
  created_at timestamptz DEFAULT now(),
  sent_at timestamptz
);

-- Habilitar RLS na fila de email (apenas leitura interna)
ALTER TABLE public.email_queue ENABLE ROW LEVEL SECURITY;

-- Função que prepara o email baseado na notificação
CREATE OR REPLACE FUNCTION public.queue_notification_email()
RETURNS TRIGGER AS $$
DECLARE
  v_user_email text;
BEGIN
  -- 1. Buscar o email do usuário
  SELECT email INTO v_user_email
  FROM public.user_profiles
  WHERE id = NEW.user_id;

  -- 2. Inserir na fila de email (simulação por enquanto)
  IF v_user_email IS NOT NULL THEN
    INSERT INTO public.email_queue (
      notification_id,
      to_email,
      subject,
      body_html
    ) VALUES (
      NEW.id,
      v_user_email,
      NEW.title,
      '<html><body><h2>' || NEW.title || '</h2><p>' || NEW.body || '</p><hr><p>Acesse seu painel Adworks para ver detalhes.</p></body></html>'
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para disparar sempre que uma notificação for criada
DROP TRIGGER IF EXISTS trigger_queue_email ON public.notifications;
CREATE TRIGGER trigger_queue_email
  AFTER INSERT ON public.notifications
  FOR EACH ROW
  EXECUTE FUNCTION public.queue_notification_email();
