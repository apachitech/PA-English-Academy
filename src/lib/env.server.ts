import "server-only";
import { z } from "zod";

/** Server-only secrets. Importing this from a client component fails the build. */
const serverSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(20).optional(),
  CERTIFICATE_SIGNING_SECRET: z.string().min(16).optional(),
  PAYMENT_PROVIDER: z.enum(["mock", "flutterwave", "cinetpay"]).default("mock"),
});

export const serverEnv = serverSchema.parse({
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || undefined,
  CERTIFICATE_SIGNING_SECRET: process.env.CERTIFICATE_SIGNING_SECRET || undefined,
  PAYMENT_PROVIDER: process.env.PAYMENT_PROVIDER || undefined,
});
