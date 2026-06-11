import { execSync } from "node:child_process";

process.env.NODE_ENV = "test";
process.env.DATABASE_URL = "file:./prisma/test.db";

execSync("npx prisma db push", {
  stdio: "inherit",
  env: process.env
});
