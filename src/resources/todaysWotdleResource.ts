import { cache } from "@solidjs/router";
import { createClient } from "@supabase/supabase-js";
import { env } from "@/env/server";
import { Database } from "@/types/database.types";
import { Vehicle } from "@/types/api.types";

const fetchTodaysWotdle = async () => {
  "use server";
  try {
    const supabase = createClient<Database>(
      env.SUPABASE_URL,
      env.SUPABASE_SERVICE_ROLE_KEY
    );
    const dd_mm_yy = new Date()
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        timeZone: "America/New_York",
      })
      .replaceAll("/", "_");

    const [vehicleListSupaRes, tankOfDaySupaRes] = await Promise.all([
      supabase.from("vehicle_data_v2").select("*").gte("tier", 8),
      supabase.from("daily_data").select("*").eq("dd_mm_yy", dd_mm_yy),
    ]);

    if (vehicleListSupaRes.data === null || tankOfDaySupaRes.data === null)
      throw new Error("Failed to fetch data from SupaBase");

    const vehicleList = vehicleListSupaRes.data
      .map((data) => data.data)
      .flat(1) as Vehicle[];

    const tankOfDay = tankOfDaySupaRes.data[0].normal as Vehicle;

    const validateTankOfDay = vehicleList.find(
      (x) => x.tank_id === tankOfDay.tank_id
    );

    if (validateTankOfDay === undefined)
      throw new Error("Failed to find tank of day in vehicleList");
    return {
      data: { vehicleList, tankOfDay },
      error: undefined,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log(errorMessage);
    return {
      data: undefined,
      error: errorMessage,
    };
  }
};

export type TodaysWotdleData = Awaited<ReturnType<typeof fetchTodaysWotdle>>;
export const getTodaysWotdle = cache(fetchTodaysWotdle, "todaysWotdle");
