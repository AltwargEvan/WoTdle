import { env } from "@/env/server";
import { Vehicle } from "@/types/api.types";
import { PostgrestSingleResponse, createClient } from "@supabase/supabase-js";
import type { APIEvent } from "@solidjs/start/server";
import { EncyclopediaVehicle, WargamingApi } from "@/utils/WargamingApi";
import { Database } from "@/types/database.types";
import { sendDiscordCronErrorNotification } from "@/server/discord";
import { dateString } from "@/utils/dateutils";
import * as diacritics from "diacritics";

const RUOnlyTanks = ["SU-122V", "K-91 Version II"];
const Mimic_Tanks = [
  ["CS-63", "Hurricane"],
  ["121B", "Monkey King"],
  ["113", "113 Beijing Opera"],
  ["WZ-111 model 5A", "WZ 111 Qilin"],
  ["Vz. 55", "Vz. 55 Gothic Warrior"],
  ["Bat.-Châtillon Bourrasque", "Miel"],
  ["AMX M4 mle. 49 Liberté", "AMX M4 mle. 49"],
  ["Type 59", "Type 59 G"],
  ["Rheinmetall Skorpion", "Rheinmetall Skorpion G"],
  ["Progetto M35 mod. 46", "Mars"],
  ["M47 Patton Improved", "M47 Iron Arnie"],
  ["Chrysler K GF", "Chrysler K"],
  ["T26E5", "T26E5 Patriot"],
  ["T34", "T34 B"],
  ["leKpz M 41 90 mm", "leKpz M 41 90 mm GF"],
  ["STG", "STG Guard"],
  ["IS-6", "IS-6 B"],
  ["Object 252U", "Object 252U Defender"],
  ["SU-130PM", "Forest Spirit"],
  ["Schwarzpanzer 58", "Panzer 58 Mutz", "Panzer 58"],
  ["VK 168.01 (P)", "VK 168.01 Mauerbrecher"],
  ["WZ-111", "WZ-111 Alpine Tiger"],
];

function authorized(request: Request) {
  if (env.NODE_ENV === "development") return true;
  if (env.CRON_SECRET === undefined) return false;
  if (request.headers.get("authorization") !== `Bearer ${env.CRON_SECRET}`)
    return false;
  return true;
}

function cleanVehicleData(vehicles: EncyclopediaVehicle[]) {
  const output = new Array<EncyclopediaVehicle>();
  vehicles.forEach((vehicle) => {
    if (vehicle.name.trim().endsWith("FL")) {
      console.log(
        `Tank ${vehicle.name} is a frontline vehicle. Excluding item from dataset.`
      );
      return;
    } else if (vehicle.name.trim().endsWith("CL")) {
      console.log(
        `Tank ${vehicle.name} is a weird premium tier 10. Excluding item from dataset.`
      );
      return;
    } else if (RUOnlyTanks.includes(vehicle.name)) {
      console.log(
        `Tank ${vehicle.name} is a RU region only vehicle. Excluding item from dataset.`
      );
      return;
    } else {
      output.push(vehicle);
    }
  });
  return output;
}

function getVehicleTopGunModules(vehicles: EncyclopediaVehicle[]) {
  let output = new Array<number>();
  vehicles.forEach((vehicle) => {
    const gunModules = Object.values(vehicle.modules_tree).filter(
      (module) => module.type === "vehicleGun"
    );

    const topGunModule = gunModules.reduce((prev, current) =>
      prev.price_xp > current.price_xp ? prev : current
    );
    vehicle.modules_tree = { 0: topGunModule };
    output.push(topGunModule.module_id);
  });
  return output;
}
function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export async function GET({ request }: APIEvent) {
  if (!authorized(request)) {
    return Response.json({ success: false }, { status: 401 });
  }
  try {
    const vehicles = await WargamingApi.vehicles();
    const cleanedVehicles = cleanVehicleData(vehicles);
    const modulesToFetch = getVehicleTopGunModules(cleanedVehicles);

    const modules = await WargamingApi.modules(modulesToFetch);

    const processedVehicles = cleanedVehicles.reduce((acc, vehicle) => {
      const gunModule = modules[vehicle.modules_tree[0].module_id];
      const alphaDmg = gunModule.default_profile.gun.ammo[0].damage[1];

      const search_name = diacritics.remove(vehicle.name.replaceAll(/[-\s.]/g, ""));
      const search_short_name = diacritics.remove(vehicle.short_name.replaceAll(/[-\s.]/g, ""));

      var mimic_list = [] as Array<string>;

      // If we want, we only need to do this check for the tank of the day
      Mimic_Tanks.forEach( ( tank_list ) => {
        if (tank_list.includes(vehicle.name)) mimic_list = tank_list;
      })

      const data: Vehicle = {
        speed_forward: vehicle.default_profile.speed_forward,
        images: vehicle.images,
        is_gift: vehicle.is_gift,
        is_premium: vehicle.is_premium,
        name: vehicle.name,
        nation: vehicle.nation,
        search_name: search_name,
        search_short_name: search_short_name,
        short_name: vehicle.short_name,
        tag: vehicle.tag,
        tank_id: vehicle.tank_id,
        tier: vehicle.tier,
        type: vehicle.type,
        alphaDmg,
        i18n: vehicle.i18n,
        mimic_list: mimic_list,
      };

      if (acc[vehicle.tier] === undefined) {
        acc[vehicle.tier] = [];
      }
      acc[vehicle.tier].push(data);
      return acc;
    }, [] as Vehicle[][]);

    const tier = randomIntFromInterval(8, 10);
    const index = randomIntFromInterval(0, processedVehicles[tier].length - 1);
    const tankOfDay = processedVehicles[tier][index];

    // For testing purposes
    //return Response.json( { data: processedVehicles }, { status: 200 });

    const supabaseClient = createClient<Database>(
      env.SUPABASE_URL,
      env.SUPABASE_SERVICE_ROLE_KEY
    );

    const updateVehicleData = processedVehicles.map((data, tier) =>
      supabaseClient.from("vehicle_data_v2").upsert({ data, tier })
    );

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dd_mm_yy = dateString(tomorrow);

    const updateDaily = supabaseClient
      .from("daily_data")
      .insert({ date: tomorrow.toJSON(), normal: tankOfDay, dd_mm_yy });

    const results = await Promise.allSettled([
      updateDaily,
      ...updateVehicleData,
    ]);

    const errorMessages = filterSupabaseErrors(results);
    if (errorMessages.length > 0) {
      throw errorMessages.join("\n");
    }

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    if (!error) return;
    try {
      await sendDiscordCronErrorNotification(error.toString());
    } catch {
      await sendDiscordCronErrorNotification("unknown error");
    }

    return Response.json({ success: false }, { status: 500 });
  }
}

function filterSupabaseErrors(
  results: [
    PromiseSettledResult<PostgrestSingleResponse<null>>,
    ...PromiseSettledResult<PostgrestSingleResponse<null>>[]
  ]
) {
  const errorMessages = new Array<string>();

  results.forEach((result) => {
    try {
      if (result.status === "rejected") {
        if (result.reason)
          errorMessages.push(
            `Request Rejects with reason: ${JSON.stringify(result.reason)}`
          );
        return;
      }

      if (!result || !result.value || !result.value.error) {
        return;
      }

      errorMessages.push(JSON.stringify(result.value.error, null, 2));
    } catch (error) {
      console.error(error);
    }
  });
  return errorMessages;
}
