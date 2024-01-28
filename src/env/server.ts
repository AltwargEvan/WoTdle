import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    CRON_SECRET: z.string().optional(),
    WOT_APPLICATION_ID: z.string(),
    TOMATO_GG_HIDDEN_ENDPOINT: z.string(),
    SUPABASE_URL: z.string(),
    SUPABASE_SERVICE_ROLE_KEY: z.string(),
  },
  runtimeEnv: process.env,
});
