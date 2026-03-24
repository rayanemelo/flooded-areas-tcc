# Flooded Areas TCC

Monorepo do projeto de TCC para monitoramento, registro e acompanhamento de áreas alagadas. O repositório concentra quatro frentes principais:

- `app`: aplicativo mobile em React Native/Expo para usuários finais.
- `backend`: API principal responsável por autenticação, regras de negócio, notificações e persistência.
- `admin`: painel web para administração e operação.
- `ia`: serviço separado para análise de imagens e sinais de veracidade.

## Estrutura

```text
.
├── admin/    # painel web em Next.js
├── app/      # aplicativo mobile em Expo Router
├── backend/  # API em Node.js + Express + Prisma
├── ia/       # serviço Python para analise de imagens
```

## Stack

### Mobile (`app`)

- Expo 54
- React Native 0.81
- Expo Router
- React Query
- Axios
- Zustand

### Backend (`backend`)

- Node.js
- Express
- Prisma
- PostgreSQL
- Zod
- JWT

### Admin (`admin`)

- Next.js 16
- React 19
- React Query
- Tailwind CSS
- Radix UI

### IA (`ia`)

- Python
- FastAPI/Uvicorn
- Integração com modelos vision-language
 

## Fluxos principais do projeto

- Registro e consulta de áreas alagadas.
- Autenticação de usuários por telefone.
- Histórico e notificações.
- Preferências de alerta por Estado e cidade.
- Painel administrativo para acompanhamento e gestão.
- Análise de imagens com apoio de IA.

## Licença

Projeto público para fins acadêmicos.
