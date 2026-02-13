
-- Evolução do Schema de Tickets (Cards no estilo Trello)
-- Adiciona suporte a Membros, Etiquetas e Checklists Reais

-- 1. ETIQUETAS (LABELS)
CREATE TABLE IF NOT EXISTS public.labels (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    color text NOT NULL, -- Hex code
    created_at timestamptz DEFAULT now()
);

-- 2. CHECKLISTS DENTRO DOS TICKETS
CREATE TABLE IF NOT EXISTS public.ticket_checklists (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id uuid REFERENCES public.tickets(id) ON DELETE CASCADE,
    title text NOT NULL DEFAULT 'Checklist',
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ticket_checklist_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    checklist_id uuid REFERENCES public.ticket_checklists(id) ON DELETE CASCADE,
    text text NOT NULL,
    is_done boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 3. MEMBROS ATRIBUÍDOS AO CARD (Múltiplos operadores por processo)
CREATE TABLE IF NOT EXISTS public.ticket_members (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id uuid REFERENCES public.tickets(id) ON DELETE CASCADE,
    user_id uuid REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    UNIQUE(ticket_id, user_id)
);

-- 4. ATUALIZAR TABELA DE TICKETS PARA SUPORTAR CAPAS E ETIQUETAS
ALTER TABLE public.tickets ADD COLUMN IF NOT EXISTS cover_url text;
ALTER TABLE public.tickets ADD COLUMN IF NOT EXISTS labels_json jsonb DEFAULT '[]';

-- RLS
ALTER TABLE public.labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for staff on labels" ON public.labels FOR ALL USING (true);
CREATE POLICY "Allow all for staff on checklists" ON public.ticket_checklists FOR ALL USING (true);
CREATE POLICY "Allow all for staff on items" ON public.ticket_checklist_items FOR ALL USING (true);
CREATE POLICY "Allow all for staff on members" ON public.ticket_members FOR ALL USING (true);
