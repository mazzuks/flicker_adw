-- SQL para criar o vínculo e promover o usuário
-- Substitua 'SEU_USER_ID' pelo ID que aparece em Auth > Users no Supabase
-- Substitua 'SEU_EMAIL' pelo seu e-mail

-- 1. Criar o seu perfil se não existir
INSERT INTO public.user_profiles (id, email, full_name, role_global)
VALUES ('SEU_USER_ID', 'SEU_EMAIL', 'Dan Mazzucatto', 'ADWORKS_SUPERADMIN')
ON CONFLICT (id) DO UPDATE SET role_global = 'ADWORKS_SUPERADMIN';

-- 2. Vincular você à empresa de teste (Sabor & Arte)
INSERT INTO public.client_memberships (client_id, user_id, role_in_client)
SELECT id, 'SEU_USER_ID', 'CLIENT_OWNER' 
FROM public.clients 
WHERE name = 'Restaurante Sabor & Arte'
LIMIT 1;
