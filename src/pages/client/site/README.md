# SPEC: Engine "Templeteria" (Website Builder Pro)

## 1. Visão Geral

A Templeteria é uma engine de construção de sites integrada ao ecossistema Adworks, focada em permitir que a equipe interna gere presença digital de alta conversão para microempreendedores em segundos, com flexibilidade total via Drag-and-Drop e automação por IA.

## 2. Arquitetura de Dados (JSON Schema)

O "coração" do builder é o `schema_json`. Cada página é uma árvore de componentes.

```json
{
  "version": "1.0",
  "theme": {
    "primaryColor": "#0047FF",
    "fontFamily": "Inter",
    "borderRadius": "12px"
  },
  "sections": [
    {
      "id": "hero_9921",
      "type": "hero",
      "props": {
        "title": "Restaurante Sabor & Arte",
        "subtitle": "Gastronomia contemporânea no coração de SP",
        "ctaText": "Fazer Reserva",
        "imageUrl": "https://images.unsplash.com/..."
      },
      "style": { "paddingTop": "80px", "textAlign": "center" }
    }
  ]
}
```

## 3. Backlog Priorizado (MVP → Fase 2)

### FASE 1: Fundação & Estrutura

- [ ] Implementar Tabelas: `sites`, `pages`, `site_versions` no Supabase.
- [ ] Criar API de CRUD para as seções (Save/Load do JSON).
- [ ] Configurar RLS (Segurança) para isolamento por `client_id`.

### FASE 2: Editor Core (O "Trello" dos Sites)

- [ ] Engine de Renderização: Componente que lê o JSON e desenha o site no Canvas.
- [ ] Drag-and-Drop de Seções: Reordenar blocos usando `@hello-pangea/dnd`.
- [ ] Inspector Lateral: Painel para editar textos e cores do bloco selecionado.

### FASE 3: Publish & Public

- [ ] Rota Pública: `adworks.app/s/:slug` para visualizar o site publicado.
- [ ] Botão "Publicar": Snapshot da versão atual para a versão live.

## 4. Estrutura de Pastas Recomendada

```text
src/
  ├── components/
  │   └── builder/
  │       ├── Canvas.tsx         # Renderizador do site
  │       ├── Sidebar.tsx        # Biblioteca de blocos
  │       ├── Inspector.tsx      # Editor de propriedades
  │       └── blocks/            # Componentes visuais (Hero, Footer...)
  ├── services/
  │   └── siteBuilder.ts         # Lógica de salvamento e IA
  └── pages/
      ├── operator/site.tsx      # Editor (Nível Equipe)
      └── public/SiteView.tsx    # Site final (Nível Consumidor)
```

## 5. Endpoints REST (Supabase Edge Functions)

- `POST /site-manager`: Salvar rascunho.
- `GET /site-manager?id=...`: Carregar rascunho.
- `POST /publish-site`: Tornar a versão atual pública.
- `POST /ai-generator`: Criar rascunho inicial baseado no onboarding.
