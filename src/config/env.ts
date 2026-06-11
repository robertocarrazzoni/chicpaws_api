import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  JWT_SECRET: z.string().min(16).default("change-me-now-please-32-chars-min"),
  DATABASE_URL: z.string().min(1).default("file:./dev.db")
});

export const env = envSchema.parse(process.env);
