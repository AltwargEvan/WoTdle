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

// Review lower tiered tanks on this list
const MimicTanks = [
  [5265, 52625],        // CS-63, Hurricane
  [63537, 58673],       // 121B, Monkey King
  [5425, 62513],        // 113, 113 Beijing Opera
  [6193, 62257],        // WZ-111 model 5A, WZ 111 Qilin
  [2929, 52081],        // Vz. 55, Vz. 55 Gothic Warrior
  [57409, 57409],       // Bat.-Châtillon Bourrasque, Miel
  [62017, 62785],       // AMX M4 mle. 49 Liberté, AMX M4 mle. 49
  [49, 561],            // Type 59, Type 59 G
  [62481, 50193],       // Rheinmetall Skorpion, Rheinmetall Skorpion G
  [51361, 52129],       // Progetto M35 mod. 46, Mars
  [32801, 33057],       // M47 Patton Improved, M47 Iron Arnie
  [58657, 58657],       // Chrysler K GF, Chrysler K
  [58913, 59169],       // T26E5, T26E5 Patriot
  [2849, 59425],        // T34, T34 B
  [64017, 50961],       // leKpz M 41 90 mm, leKpz M 41 90 mm GF
  [47617, 47361],       // STG, STG Guard
  [9217, 49409],        // IS-6, IS-6 B
  [49665, 48641],       // Object 252U, Object 252U Defender
  [45057, 27905],       // SU-130PM, Forest Spirit
  [49937, 64273, 63761], // Schwarzpanzer 58, Panzer 58 Mutz, Panzer 58
  [48913, 48145],       // VK 168.01 (P), VK 168.01 Mauerbrecher
  [817, 65073],         // WZ-111, WZ-111 Alpine Tiger
  [14673, 62545],       // Charioteer, Charioteer Nomad
  [63809, 63297],       // AMX 13 57, AMX 13 57 GF
  [513, 31233, 46593, 59137], // IS, IS-2 shielded, IS-2M, IS-2 (USSR)
  [1105, 55889],        // Cromwell, Cromwell B
  [1313, 49697, 56097, 59681, 10017], // M4A3E8 Sherman, M4A3(76)W Sherman, M4A3E8 Fury, M4A3E8 Thunderbolt VII, M4A3E2 Sherman Jumbo
  [51345, 59393, 2561, 58113],       // T-34-85 Rudy (PL), T-34-85 Rudy (USSR), T-34-85, T-34-85M
  [54017, 51201],       // KV-220-2, KV-220-2 Beta Test
  [51473, 54033],       // Pz.Kpfw. V/IV, Pz.Kpfw. V/IV Alpha
  [10497, 64769],       // KV-2, KV-2 (R)
  [18193, 45585],       // Pz.Kpfw. IV Ausf. H, Pz.Kpfw. IV Ausf. H Ankou
  [4689, 62801],        // Churchill VII, Churchill Crocodile
  [2625, 56897],        // ARL 44, Char de transition
  [33025, 37889],       // KV-1Sh, KV-1SA
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

    MimicTanks.forEach( ( mimic_list ) => {
      if (mimic_list.includes(tankOfDay.tank_id)) tankOfDay.mimic_list = mimic_list;
    });

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
