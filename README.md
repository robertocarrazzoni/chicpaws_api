# chicpaws_api

API de ecommerce em `TypeScript` com `Express`, `Prisma`, `SQLite`, `JWT` e documentação `Swagger`.

## Como rodar

1. Copie `.env.example` para `.env`.
2. Instale as dependências.
3. Gere o client do Prisma.
4. Aplique o schema no SQLite.
5. Rode o seed.
6. Inicie a API.

```bash
npm install
npm run prisma:generate
npm run prisma:push
npm run prisma:seed
npm run dev
```

## Scripts

- `npm run dev` - inicia em modo desenvolvimento
- `npm run build` - compila TypeScript
- `npm run start` - executa o build compilado
- `npm run test` - executa testes de integração
- `npm run prisma:push` - cria o schema no SQLite
- `npm run prisma:seed` - popula dados iniciais

## Endpoints principais

- `GET /api/v1/health`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `GET /api/v1/products`
- `GET /api/v1/products/:id`
- `GET /api/v1/categories`
- `GET /api/v1/cart`
- `POST /api/v1/cart/items`
- `POST /api/v1/orders/checkout`
- `GET /api/v1/orders/me`
- `GET /api/v1/admin/products`
- `POST /api/v1/admin/products`
- `GET /api/v1/admin/orders`

## Credenciais do seed

- Admin: `admin@chicpaws.com`
- Cliente: `cliente@chicpaws.com`
- Senha: `Password@123`
