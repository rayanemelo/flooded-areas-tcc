# 🌧️ TCC - Backend | Monitoramento Colaborativo de Áreas Alagadas

Este é o backend da aplicação de monitoramento colaborativo de áreas alagadas. O sistema permite que usuários relatem pontos de alagamento em tempo real via aplicativo móvel, com envio de fotos, geolocalização e classificação da gravidade.

## 🔗 Repositórios

- Aplicativo (frontend): [tcc-app](https://github.com/rayanemelo/tcc-app)
- Backend (este repositório): [tcc-backend](https://github.com/rayanemelo/tcc-backend)

## Tecnologias Utilizadas

- **Node.js** com **Express**
- **TypeScript**
- **Prisma ORM**
- **PostgreSQL**
- **Clean Architecture**
- **Jest** (testes unitários)
- **Twilio API** (envio de SMS)
- **Cloudinary** (armazenamento de imagens)
- **Geocoding API** (conversão de coordenadas)


## Estrutura e Arquitetura

Este projeto segue a **Clean Architecture**, separando responsabilidades em camadas:
- `controllers/` - Entrada e orquestração das requisições HTTP
- `use-cases/` - Regras de negócio
- `repositories/` - Acesso ao banco de dados via Prisma
- `services/` - Integrações com serviços externos (Twilio, Cloudinary)
- `prisma/` - Migrations e schema do banco
- `tests/` - Testes unitários dos use cases

## Testes

- Tipo: **Unitários**
- Ferramenta: **Jest**

Para executar os testes e verificar a cobertura de código, utilize o comando abaixo:
```bash
yarn test
```

## Como rodar o projeto 
### Pré-requisitos
- Node.js 18+
- Yarn
- PostgreSQL
- Arquivo `.env` com as seguintes variáveis configuradas:
  - URL de conexão com o banco de dados (ex: `postgresql://user:password@localhost:5432/tc_db`)
  - Credenciais do Twilio (ex: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`)
  - Credenciais do Cloudinary (ex: `CLOUDINARY_URL`)

### Instalação local
```
# Clone o projeto
git clone https://github.com/rayanemelo/tcc-backend
cd tcc-backend

# Instale as dependências
yarn

# Gere os arquivos do Prisma
yarn prisma generate

# Rode as migrations do banco
yarn prisma migrate dev

# Criar dados no banco
yarn db:bootstrap

# Inicie a aplicação em modo dev
yarn dev
```
### Rodando com Docker
#### Pré-requisitos
- Docker
- Docker Compose

Execute o comando: 
```
docker compose up --build
```

Isso iniciará os serviços do backend juntamente com o banco de dados PostgreSQL.

