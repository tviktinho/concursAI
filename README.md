# Concursando - Nova UI (React + Tailwind)

Este repositorio agora reune dois apps React (Vite) separados, ambos em modo MPA para preservar as rotas da versao anterior:

- `apps/web`: experiencia publica - Home, Login/OAuth, Quiz completo, Resultados, Detalhes do historico, Desempenho, Conta e Consentimentos LGPD.
- `apps/admin`: painel administrativo independente - Dashboard com metricas, gerenciamento de Usuarios, Temas, Categorias e Relatorios.

Todos os endpoints continuam exatamente os mesmos do backend atual (`quiz-backend`). Tailwind esta configurado com uma paleta `brand` e utilitarios compartilhados.

## Como rodar localmente

Pre-requisitos: Node 18+.

1. Configure a URL do backend
   - Copie `.env.example` -> `.env` em cada app e ajuste `VITE_API_URL` conforme seu ambiente.
     - `apps/web/.env`
     - `apps/admin/.env`

2. Instale dependencias e suba os servidores (terminais separados)
   - `cd apps/web && npm i && npm run dev`
   - `cd apps/admin && npm i && npm run dev`

3. Navegue (Vite mantem cada pagina como entrada independente)
- Web: `http://localhost:5173/index.html` + `/login.html`, `/quiz.html`, `/resultados.html`, `/history.html`, `/desempenho.html`, `/account.html`, `/consentimentos.html`
- Admin: `http://localhost:5174/index.html` + `/usuarios.html`, `/temas.html`, `/categorias.html`, `/relatorios.html`

## Integracao com o backend existente

1. Backend (`external/quiz-backend`)
   - Garanta `.env.production` ou `.env` com seu banco ja em uso (por exemplo `PORT=4000`, `FRONTEND_URL=http://localhost:5173`, `JWT_SECRET=...`).
   - Postgres e Redis precisam estar disponiveis (ha `docker-compose.yml` no repositorio original, se preferir).

2. Frontend
   - Defina `VITE_API_URL` apontando para o backend (ex.: `http://localhost:4000`).
   - Faca login via `/login.html` -> o token OAuth retornado pelo backend fica armazenado em `localStorage` e e reutilizado em todas as paginas do MPA.

3. Fluxos ja implementados
   - Quiz: consome `/themes`, `/questions`, `/quiz/finish` e redireciona para `/resultados.html`.
   - Resultados e historico: `/history` e `/history/:id`.
   - Desempenho: `/user/stats`.
   - Conta: `/account/me` (edicao de nome) e `/account/tags`.
   - Consentimentos LGPD: `/user/consents`, `/user/export-data`, `/user/delete-account`, `/user/cancel-deletion`, `/user/data-requests`.
   - Painel Admin: metricas em `/admin/dashboard/metrics`, usuarios (`/admin/users`), temas (`/themes` + `/admin/themes/:id`), categorias (`/admin/categories`), relatorios (`/admin/reports`).

### Login manual e usuario de teste

- O login via Google continua disponivel (botao na pagina `/login.html`).
- Um login manual opcional pode ser habilitado/configurado via `VITE_ENABLE_BASIC_LOGIN` (veja `apps/web/.env.example`). Defina `false` para desabilitar rapidamente em producao.
- Para gerar um usuario basico de teste (username `concursando_teste`, senha `Teste@123`), execute:
  - `node scripts/create-test-user.mjs http://localhost:4000`
  - O script utiliza /signup; se o usuario ja existir, apenas informa e sai sem erro.
- Para promover rapidamente o usuario de teste a admin/VIP, habilite `ENABLE_TEST_USER_PROMOTE=true` no backend e (opcionalmente) defina `TEST_PROMOTE_SECRET`. Com a flag ativa, envie `POST /internal/promote-test-user` com `{ "secret": "<TEST_PROMOTE_SECRET>" }`.

## Design system

- Componentes base (botoes, inputs, selects, tabelas, modais, cards) estao em `apps/web/src/components/ui` e `apps/admin/src/components/ui`.
- As paginas principais foram refatoradas para usar esses componentes, garantindo consistencia visual e de interacao.

## Pipeline de CI

- O fluxo `.github/workflows/ci.yml` compila os dois apps (web e admin) a cada push/pull request em `main`/`master`.
- A pipeline executa `npm ci` e `npm run build` para garantir que os projetos seguem compilando antes do deploy.

## Proximos passos sugeridos

- Implementar criacao/adicao de temas com upload (endpoints `POST /admin/themes` e `/admin/themes/:id/add`).
- Integrar o pipeline de build com o provedor de deploy (Render, Vercel etc.) para entrega continua.




