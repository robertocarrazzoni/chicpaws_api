# Repository Guidelines

## Project Structure & Module Organization
This repository is a TypeScript/Express API. Source code lives in `src/`, grouped by feature under `src/modules/*` with matching `controller.ts`, `service.ts`, `routes.ts`, and `schemas.ts` files. Shared helpers are in `src/utils/`, infrastructure in `src/lib/`, and cross-cutting middleware in `src/middlewares/`. Database schema and seed data live in `prisma/`. End-to-end tests are in `tests/e2e/`, with test helpers in `tests/helpers/`. Build output is generated in `dist/` and should not be edited manually.

## Build, Test, and Development Commands
- `npm run dev`: starts the API in watch mode using `tsx`.
- `npm run build`: compiles TypeScript to `dist/`.
- `npm run start`: runs the compiled server from `dist/server.js`.
- `npm run prisma:generate`: regenerates the Prisma client.
- `npm run prisma:push`: applies the Prisma schema to the local database.
- `npm run prisma:seed`: loads seed data into the database.
- `npm test`: runs the test suite with Vitest.
- `npm run test:e2e`: runs end-to-end tests in `tests/e2e/`.

## Coding Style & Naming Conventions
Use strict TypeScript with explicit types where helpful. Follow the existing style: 2-space indentation, semicolons, double quotes, and small focused modules. Name feature files consistently (`products.service.ts`, `auth.routes.ts`). Prefer descriptive function names such as `createCategory`, `listCategories`, and `asyncHandler`. Keep utility functions in `src/utils/` and avoid duplicating shared logic.

## Testing Guidelines
Vitest is the test runner. Put integration and API tests under `tests/e2e/` and helpers under `tests/helpers/`. Use `.spec.ts` for test files, matching the existing pattern like `auth-and-catalog.spec.ts`. Keep tests independent and rely on the test database setup handled by `npm test` and `npm run test:e2e`.

## Commit & Pull Request Guidelines
The git history currently shows only an initial commit, so no formal commit convention is established. Use short, imperative commit messages, for example: `Add category slug validation`. Pull requests should include a clear summary, the commands run for verification, and notes about any database or environment changes.

## Security & Configuration Tips
Copy `.env.example` to `.env` before running locally. Do not commit secrets or local database files. If you change Prisma models or seed data, regenerate the client and re-run the seed so the API and tests stay aligned.
