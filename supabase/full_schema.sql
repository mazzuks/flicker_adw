-- SQL Completo para criação do banco de dados Adworks
-- Execute este script no SQL Editor do Supabase para resolver os erros 404.

-- 1. ENUMS
DO $$ BEGIN
    CREATE TYPE user_role_global AS ENUM (
        'ADWORKS_SUPERADMIN', 'ADWORKS_ADMIN', 'ADWORKS_ACCOUNT_MANAGER', 
        'OPERATOR_ACCOUNTING', 'OPERATOR_INPI', 'CLIENT_OWNER', 'CLIENT_USER', 'CLIENT_VIEWER'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE client_status AS ENUM ('ONBOARDING', 'ACTIVE', 'SUSPENDED', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE onboarding_step_status AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'SUBMITTED', 'NEEDS_FIX', 'APPROVED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE document_status AS ENUM ('RECEIVED', 'INVALID', 'APPROVED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE ticket_type AS ENUM ('TICKET_CNPJ', 'TICKET_INPI', 'TICKET_FISCAL');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE ticket_status AS ENUM (
        'NEW', 'WAITING_CLIENT', 'READY', 'IN_PROGRESS', 'SUBMITTED', 
        'PENDING_EXTERNAL', 'APPROVED', 'REJECTED', 'DONE'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE ticket_priority AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2. TABLES
CREATE TABLE IF NOT EXISTS user_profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id),
    email text UNIQUE NOT NULL,
    full_name text,
    role_global user_role_global DEFAULT 'CLIENT_OWNER',
    avatar_url text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS clients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    slug text UNIQUE NOT NULL,
    plan text DEFAULT 'FREE',
    status client_status DEFAULT 'ONBOARDING',
    fantasy_name text,
    cnpj text,
    segment text,
    city text,
    state text,
    address_json jsonb DEFAULT '{}',
    contacts_json jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS client_memberships (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
    user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
    role_in_client text NOT NULL,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS onboarding_steps (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
    step_key text NOT NULL,
    status onboarding_step_status DEFAULT 'NOT_STARTED',
    data_json jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(client_id, step_key)
);

CREATE TABLE IF NOT EXISTS documents (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
    category text NOT NULL,
    filename text NOT NULL,
    storage_path text NOT NULL,
    file_size bigint,
    mime_type text,
    status document_status DEFAULT 'RECEIVED',
    uploaded_by uuid REFERENCES user_profiles(id),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tickets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
    type ticket_type NOT NULL,
    status ticket_status DEFAULT 'NEW',
    priority ticket_priority DEFAULT 'NORMAL',
    assigned_to uuid REFERENCES user_profiles(id),
    sla_due_at timestamptz,
    data_json jsonb DEFAULT '{}',
    timeline jsonb DEFAULT '[]',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
    user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
    type text NOT NULL,
    title text NOT NULL,
    body text NOT NULL,
    entity_type text,
    entity_id text,
    read_at timestamptz,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ticket_messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id uuid REFERENCES tickets(id) ON DELETE CASCADE,
    author_user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
    message text NOT NULL,
    visibility text DEFAULT 'CLIENT', -- CLIENT or INTERNAL
    attachments_json jsonb DEFAULT '[]',
    created_at timestamptz DEFAULT now()
);

-- 3. TRIGGERS & FUNCTIONS (AUTOMATION)

CREATE OR REPLACE FUNCTION create_cnpj_ticket_on_onboarding_complete()
RETURNS TRIGGER AS $$
DECLARE
  v_client_id uuid;
  v_all_submitted boolean;
  v_ticket_exists boolean;
BEGIN
  v_client_id := NEW.client_id;
  SELECT COUNT(*) = 0 INTO v_all_submitted FROM onboarding_steps
  WHERE client_id = v_client_id AND status NOT IN ('SUBMITTED', 'APPROVED');
  SELECT EXISTS(SELECT 1 FROM tickets WHERE client_id = v_client_id AND type = 'TICKET_CNPJ') INTO v_ticket_exists;
  IF v_all_submitted AND NOT v_ticket_exists THEN
    INSERT INTO tickets (client_id, type, status, priority, sla_due_at)
    VALUES (v_client_id, 'TICKET_CNPJ', 'NEW', 'NORMAL', NOW() + INTERVAL '15 days');
    INSERT INTO notifications (client_id, user_id, type, title, body, entity_type, entity_id)
    SELECT v_client_id, cm.user_id, 'STATUS_CHANGED', 'Processo de CNPJ iniciado', 'Recebemos todas as informações!', 'onboarding', v_client_id
    FROM client_memberships cm WHERE cm.client_id = v_client_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_create_cnpj_ticket AFTER UPDATE ON onboarding_steps FOR EACH ROW EXECUTE FUNCTION create_cnpj_ticket_on_onboarding_complete();

-- (Adicione os outros triggers de INPI e Documentos aqui se desejar, seguindo o mesmo padrão)

-- 4. RLS (Row Level Security) - IMPORTANTE
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;

-- Exemplo de política: Usuário vê seu próprio perfil
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
