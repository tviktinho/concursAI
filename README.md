# Concursando — Nova UI (React + Tailwind)

Este repositório agora contém dois apps React (Vite) separados e configurados como MPA:

- `apps/web`: site público (home, login, quiz, resultados, desempenho)
- `apps/admin`: painel administrativo separado

Mantemos os mesmos endpoints do backend existente. Tailwind está configurado com um tema inicial (`brand`).

## Como rodar

Pré‑requisitos: Node 18+.

1) Configure a URL do backend:

- Copie `.env.example` para `.env` dentro de cada app e ajuste `VITE_API_URL`.
  - `apps/web/.env`
  - `apps/admin/.env`

2) Instale dependências e rode os servidores de dev (em terminais separados):

- `cd apps/web && npm i && npm run dev`
- `cd apps/admin && npm i && npm run dev`

3) Acesse no navegador:

- Web: `http://localhost:5173/index.html` (e demais páginas: `/login.html`, `/quiz.html`, `/resultados.html`, `/desempenho.html`)
- Admin: `http://localhost:5174/index.html` (e `/usuarios.html`)

Observação: com Vite MPA, cada página é um `.html` de entrada na raiz do app.

## Próximos passos

- Integrar login OAuth com o backend (`/auth/google`) salvando o token de sessão.
- Implementar fluxo do Quiz e Resultados consumindo os endpoints atuais.
- Montar o Design System base (Buttons, Inputs, Modals, Tabelas) com acessibilidade.
- Separar build/deploy no Render para `web` e `admin`.
