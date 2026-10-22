import { z } from "zod";

/**
 * Public (browser-safe) environment. Only NEXT_PUBLIC_* values belong here.
 * Values are read with literal `process.env.X` so Next.js can inline them.
 */
const publicSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(20).optional(),
  NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
  NEXT_PUBLIC_FEATURE_PHONE_OTP: z
    .enum(["true", "false"])
    .default("false")
    .transform((v) => v === "true"),
  NEXT_PUBLIC_FEATURE_GOOGLE_AUTH: z
    .enum(["true", "false"])
    .default("true")
    .transform((v) => v === "true"),
});

const parsed = publicSchema.safeParse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || undefined,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || undefined,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || undefined,
  NEXT_PUBLIC_FEATURE_PHONE_OTP: process.env.NEXT_PUBLIC_FEATURE_PHONE_OTP || undefined,
  NEXT_PUBLIC_FEATURE_GOOGLE_AUTH: process.env.NEXT_PUBLIC_FEATURE_GOOGLE_AUTH || undefined,
});

if (!parsed.success) {
  // Fail loudly in dev; never print secret values.
  console.error("❌ Invalid public environment variables:", z.treeifyError(parsed.error));
  throw new Error("Invalid public environment variables");
}

export const env = parsed.data;

export const isSupabaseConfigured = Boolean(
  env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export const features = {
  phoneOtp: env.NEXT_PUBLIC_FEATURE_PHONE_OTP,
  googleAuth: env.NEXT_PUBLIC_FEATURE_GOOGLE_AUTH,
} as const;
