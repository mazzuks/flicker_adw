/*
  # Automatic Triggers for Tickets and Notifications

  ## Overview
  Creates database functions and triggers to automatically:
  - Create CNPJ ticket when onboarding is completed
  - Create INPI ticket when brand registration is requested
  - Create notifications when documents are invalidated
  - Create notifications when ticket status changes
  - Create tasks when documents need to be resubmitted

  ## Functions Created
  1. `create_cnpj_ticket_on_onboarding_complete` - Creates CNPJ ticket
  2. `create_inpi_ticket_if_requested` - Creates INPI ticket
  3. `notify_on_document_status_change` - Notifies on document changes
  4. `notify_on_ticket_status_change` - Notifies on ticket changes

  ## Triggers
  - Fires when all onboarding steps are SUBMITTED
  - Fires when document status changes to INVALID
  - Fires when ticket status changes to WAITING_CLIENT
*/

-- Function to create CNPJ ticket when onboarding is completed
CREATE OR REPLACE FUNCTION create_cnpj_ticket_on_onboarding_complete()
RETURNS TRIGGER AS $$
DECLARE
  v_client_id uuid;
  v_all_submitted boolean;
  v_ticket_exists boolean;
BEGIN
  v_client_id := NEW.client_id;
  
  SELECT COUNT(*) = 0 INTO v_all_submitted
  FROM onboarding_steps
  WHERE client_id = v_client_id
  AND status NOT IN ('SUBMITTED', 'APPROVED');
  
  SELECT EXISTS(
    SELECT 1 FROM tickets
    WHERE client_id = v_client_id
    AND type = 'TICKET_CNPJ'
  ) INTO v_ticket_exists;
  
  IF v_all_submitted AND NOT v_ticket_exists THEN
    INSERT INTO tickets (
      client_id,
      type,
      status,
      priority,
      sla_due_at,
      data_json
    ) VALUES (
      v_client_id,
      'TICKET_CNPJ',
      'NEW',
      'NORMAL',
      NOW() + INTERVAL '15 days',
      '{}'::jsonb
    );
    
    INSERT INTO notifications (
      client_id,
      user_id,
      type,
      title,
      body,
      entity_type,
      entity_id
    )
    SELECT
      v_client_id,
      cm.user_id,
      'STATUS_CHANGED',
      'Processo de CNPJ iniciado',
      'Recebemos todas as informações! Nossa equipe já começou o processo de abertura do seu CNPJ.',
      'onboarding',
      v_client_id
    FROM client_memberships cm
    WHERE cm.client_id = v_client_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create INPI ticket if brand registration requested
CREATE OR REPLACE FUNCTION create_inpi_ticket_if_requested()
RETURNS TRIGGER AS $$
DECLARE
  v_wants_brand text;
  v_ticket_exists boolean;
BEGIN
  v_wants_brand := NEW.data_json->>'wants_brand';
  
  IF NEW.step_key = 'brand' AND v_wants_brand = 'yes' AND NEW.status = 'IN_PROGRESS' THEN
    SELECT EXISTS(
      SELECT 1 FROM tickets
      WHERE client_id = NEW.client_id
      AND type = 'TICKET_INPI'
    ) INTO v_ticket_exists;
    
    IF NOT v_ticket_exists THEN
      INSERT INTO tickets (
        client_id,
        type,
        status,
        priority,
        sla_due_at,
        data_json
      ) VALUES (
        NEW.client_id,
        'TICKET_INPI',
        'NEW',
        'NORMAL',
        NOW() + INTERVAL '30 days',
        NEW.data_json
      );
      
      INSERT INTO notifications (
        client_id,
        user_id,
        type,
        title,
        body,
        entity_type,
        entity_id
      )
      SELECT
        NEW.client_id,
        cm.user_id,
        'STATUS_CHANGED',
        'Registro de marca solicitado',
        'Sua solicitação de registro de marca foi recebida. Em breve entraremos em contato.',
        'ticket',
        NEW.client_id
      FROM client_memberships cm
      WHERE cm.client_id = NEW.client_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to notify on document status change
CREATE OR REPLACE FUNCTION notify_on_document_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status AND NEW.status IN ('INVALID', 'APPROVED') THEN
    INSERT INTO notifications (
      client_id,
      user_id,
      type,
      title,
      body,
      entity_type,
      entity_id
    )
    SELECT
      NEW.client_id,
      cm.user_id,
      CASE 
        WHEN NEW.status = 'APPROVED' THEN 'DOC_APPROVED'
        ELSE 'DOC_REQUIRED'
      END,
      CASE 
        WHEN NEW.status = 'APPROVED' THEN 'Documento aprovado'
        ELSE 'Documento precisa ser reenviado'
      END,
      CASE 
        WHEN NEW.status = 'APPROVED' THEN 'O documento "' || NEW.filename || '" foi aprovado.'
        ELSE 'O documento "' || NEW.filename || '" precisa ser reenviado. Verifique os comentários.'
      END,
      'document',
      NEW.id
    FROM client_memberships cm
    WHERE cm.client_id = NEW.client_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to notify on ticket status change
CREATE OR REPLACE FUNCTION notify_on_ticket_status_change()
RETURNS TRIGGER AS $$
DECLARE
  v_status_label text;
  v_ticket_type_label text;
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    v_status_label := CASE NEW.status
      WHEN 'NEW' THEN 'Novo'
      WHEN 'WAITING_CLIENT' THEN 'Aguardando você'
      WHEN 'IN_PROGRESS' THEN 'Em andamento'
      WHEN 'SUBMITTED' THEN 'Enviado'
      WHEN 'APPROVED' THEN 'Aprovado'
      WHEN 'DONE' THEN 'Concluído'
      ELSE NEW.status
    END;
    
    v_ticket_type_label := CASE NEW.type
      WHEN 'TICKET_CNPJ' THEN 'Abertura de CNPJ'
      WHEN 'TICKET_INPI' THEN 'Registro de Marca'
      WHEN 'TICKET_FISCAL' THEN 'Fiscal'
      ELSE NEW.type
    END;
    
    INSERT INTO notifications (
      client_id,
      user_id,
      type,
      title,
      body,
      entity_type,
      entity_id
    )
    SELECT
      NEW.client_id,
      cm.user_id,
      'STATUS_CHANGED',
      v_ticket_type_label || ': ' || v_status_label,
      CASE 
        WHEN NEW.status = 'WAITING_CLIENT' THEN 'Precisamos de informações adicionais. Acesse a aba Mensagens.'
        WHEN NEW.status = 'APPROVED' THEN 'Seu processo foi aprovado!'
        WHEN NEW.status = 'DONE' THEN 'Processo concluído com sucesso!'
        ELSE 'O status mudou para: ' || v_status_label
      END,
      'ticket',
      NEW.id
    FROM client_memberships cm
    WHERE cm.client_id = NEW.client_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers
DROP TRIGGER IF EXISTS trigger_create_cnpj_ticket ON onboarding_steps;
CREATE TRIGGER trigger_create_cnpj_ticket
  AFTER UPDATE ON onboarding_steps
  FOR EACH ROW
  EXECUTE FUNCTION create_cnpj_ticket_on_onboarding_complete();

DROP TRIGGER IF EXISTS trigger_create_inpi_ticket ON onboarding_steps;
CREATE TRIGGER trigger_create_inpi_ticket
  AFTER UPDATE ON onboarding_steps
  FOR EACH ROW
  EXECUTE FUNCTION create_inpi_ticket_if_requested();

DROP TRIGGER IF EXISTS trigger_notify_document_change ON documents;
CREATE TRIGGER trigger_notify_document_change
  AFTER UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION notify_on_document_status_change();

DROP TRIGGER IF EXISTS trigger_notify_ticket_change ON tickets;
CREATE TRIGGER trigger_notify_ticket_change
  AFTER UPDATE ON tickets
  FOR EACH ROW
  EXECUTE FUNCTION notify_on_ticket_status_change();
