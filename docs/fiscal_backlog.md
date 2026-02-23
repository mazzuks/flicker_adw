# 🎯 Adworks Accountancy & Fiscal - Sprint Map (Priorities)

Baseado no cruzamento entre o estado técnico atual do repo e as novas demandas contábeis.

---

## 🔥 Prioridade 1: O Alicerce do "Dia a Dia"
*Foco: Alto valor percebido com baixo esforço técnico. Ideal para dar sensação de produto completo.*

1.  **Checklist de Ativação Contábil** (🎧 Operador / 👤 Cliente)
    - [ ] Tabela: `account_activation_checklist`
    - [ ] Campos: CNAE, Regime, Certificado, Conta PJ, Portais.
    - [ ] UI: Barra de progresso na home do cliente.

2.  **Gestão de Identidade Digital & Bancária** (👤 Cliente)
    - [ ] Campo de status do Certificado Digital (Emitido, Validade, Renovação).
    - [ ] Slot para link da Conta Bancária PJ.

3.  **Agenda Fiscal Base** (👤 Cliente)
    - [ ] Tabela: `fiscal_calendar_events`
    - [ ] Eventos padrão: DAS (Todo dia 20), FGTS, Pró-labore.

---

## 🚀 Prioridade 2: O Motor Fiscal (Operacional)
*Foco: Criar o canal de serviço entre o cliente e o time Adworks.*

1.  **Módulo de Notas Fiscais (NF)** (👤 Cliente / 🎧 Operador)
    - [ ] **Solicitador**: Formulário para o cliente pedir emissão.
    - [ ] **Validador**: Tela para o operador aprovar e subir o PDF da nota emitida.

2.  **Central de Guias (DAS)** (🎧 Operador)
    - [ ] Fila de apuração mensal.
    - [ ] Botão de upload de guia para o cliente baixar na dashboard dele.

3.  **Fila de Atendimento Fiscal** (🎧 Operador)
    - [ ] Interface estilo "Work Queue" para o time contábil não perder prazos.

---

## 💰 Prioridade 3: BI & Escala (Master)
*Foco: Métricas de crescimento e monetização secundária.*

1.  **Dashboard Financeiro do Cliente** (👤 Cliente)
    - [ ] Visualização de faturamento e impostos (Manual inicialmente).

2.  **Dashboard Master (Product BI)** (🛡️ Admin)
    - [ ] Queries de Receita, Churn e Ticket Médio.

3.  **Módulo Upsell (Conta Azul)** (👤 Cliente)
    - [ ] Ativação comercial e link externo de parceria.

---

## 🛠️ Notas de Implementação
- **Modo Manual:** Começaremos com o operador fazendo o trabalho "pesado" fora e subindo o resultado (PDF/Status) no sistema.
- **Isolamento:** Tudo continuará respeitando o `account_id` (Multi-tenancy).
- **Sem Gambiarra:** Cada tabela nova seguirá o padrão de tipos e RLS que já selamos no projeto.
