import { env } from "@/env/server";
import { Database } from "@/types/database.types";
import { dateString } from "@/utils/dateutils";
import type { APIEvent } from "@solidjs/start/server";
import { createClient } from "@supabase/supabase-js";

export async function POST({ request }: APIEvent) {
  const supabaseClient = createClient<Database>(
    env.SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY
  );

  const row_id = dateString(new Date());
  console.log("row id", row_id);
  const { data, error } = await supabaseClient.rpc("incrementnormalwins", {
    row_id: row_id,
  });

  return Response.json({ data }, { status: 200 });
}
