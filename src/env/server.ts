import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.string().optional(),
    CRON_SECRET: z.string().optional(),
    WOT_APPLICATION_ID: z.string(),
    //supabase
    SUPABASE_URL: z.string(),
    SUPABASE_SERVICE_ROLE_KEY: z.string(),
    //discord
    DISCORD_BOT_TOKEN: z.string(),
    DISCORD_USER_ID: z.string(),
  },
  runtimeEnv: process.env,
});
