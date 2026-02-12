-- SQL para o Sistema de Assinaturas (Módulo de Receita)
-- Este script define a estrutura de planos, assinaturas e histórico de pagamentos.

-- 1. ENUMS para o Sistema de Assinaturas
DO $$ BEGIN
    CREATE TYPE subscription_status AS ENUM ('TRIAL', 'ACTIVE', 'PAST_DUE', 'CANCELED', 'UNPAID');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2. TABELA DE PLANOS
CREATE TABLE IF NOT EXISTS public.plans (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL, -- Ex: 'Básico', 'Premium', 'Escala'
    description text,
    price numeric NOT NULL DEFAULT 0,
    interval text DEFAULT 'month', -- 'month' or 'year'
    features_json jsonb DEFAULT '[]', -- Lista de o que está incluso
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now()
);

-- 3. TABELA DE ASSINATURAS (Vínculo Cliente x Plano)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE,
    plan_id uuid REFERENCES public.plans(id),
    status subscription_status DEFAULT 'ACTIVE',
    current_period_start timestamptz DEFAULT now(),
    current_period_end timestamptz,
    cancel_at_period_end boolean DEFAULT false,
    external_id text, -- ID no gateway de pagamento (PagBank/Stripe)
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 4. TABELA DE PAGAMENTOS (Invoices)
CREATE TABLE IF NOT EXISTS public.payments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE,
    subscription_id uuid REFERENCES public.subscriptions(id),
    amount numeric NOT NULL,
    status payment_status DEFAULT 'PENDING',
    payment_method text, -- 'PIX', 'CREDIT_CARD', 'BOLETO'
    invoice_url text, -- Link para o boleto ou recibo
    paid_at timestamptz,
    external_reference text, -- ID da transação no gateway
    created_at timestamptz DEFAULT now()
);

-- 5. RLS (Habilitar segurança)
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- POLICIES: Clientes veem suas próprias assinaturas e pagamentos
CREATE POLICY "Clients view own subscription" ON subscriptions FOR SELECT USING (EXISTS (SELECT 1 FROM client_memberships WHERE client_id = subscriptions.client_id AND user_id = auth.uid()));
CREATE POLICY "Clients view own payments" ON payments FOR SELECT USING (EXISTS (SELECT 1 FROM client_memberships WHERE client_id = payments.client_id AND user_id = auth.uid()));
CREATE POLICY "Plans are viewable by all" ON plans FOR SELECT USING (true);

-- 6. DADOS INICIAIS (SEED)
INSERT INTO plans (name, description, price, features_json) VALUES 
('Essencial', 'Abertura de CNPJ e Gestão Fiscal básica', 197.00, '["CNPJ", "Contabilidade", "Suporte"]'),
('Pro', 'Ideal para empresas em crescimento', 397.00, '["CNPJ", "Marca INPI", "CRM", "Site", "Suporte VIP"]');
