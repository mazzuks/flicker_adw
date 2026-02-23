-- MIGRATION: UPSELL MODULE (Conta Azul)
-- Purpose: Add commercial partner activation logic.
-- No emojis.

ALTER TABLE public.accounts
ADD COLUMN IF NOT EXISTS financial_system_enabled boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS financial_system_partner text DEFAULT 'conta_azul';

-- GRANT
GRANT ALL ON public.accounts TO authenticated;
