-- Desabilitar RLS temporariamente para popular dados de teste ou criar políticas mais permissivas para o anon role
-- ATENÇÃO: Em produção, o RLS deve ser configurado com cuidado.

-- Política para permitir que qualquer pessoa (incluindo o script com anon key) insira clientes para teste
-- (Remova ou restrinja isso antes de ir para produção real)
CREATE POLICY "Allow anonymous inserts for testing" ON public.clients FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous inserts for steps" ON public.onboarding_steps FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous inserts for tickets" ON public.tickets FOR INSERT WITH CHECK (true);

-- Permitir leitura geral para vermos os resultados no Dashboard enquanto testamos
CREATE POLICY "Allow anonymous select for testing" ON public.clients FOR SELECT USING (true);
CREATE POLICY "Allow anonymous select for steps" ON public.onboarding_steps FOR SELECT USING (true);
CREATE POLICY "Allow anonymous select for tickets" ON public.tickets FOR SELECT USING (true);
CREATE POLICY "Allow anonymous select for profiles" ON public.user_profiles FOR SELECT USING (true);
CREATE POLICY "Allow anonymous select for memberships" ON public.client_memberships FOR SELECT USING (true);
