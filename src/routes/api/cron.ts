import { env } from "@/env/server";
import { type Vehicle } from "@/types/supabase.types";
import {
  type TankopediaGunModule,
  type TankopediaModulesResult,
  type TankopediaVehicleResult,
} from "@/types/tankopedia.types";
import { type TomatoGGResult } from "@/types/tomatogg.types";
import { seededRandom } from "@/utils/seededRandom";
import { createClient } from "@supabase/supabase-js";

async function fetchTankopediaVehicles() {
  const TankopediaVehicles = new URL(
    "https://api.worldoftanks.eu/wot/encyclopedia/vehicles/"
  );
  TankopediaVehicles.searchParams.append(
    "application_id",
    env.WOT_APPLICATION_ID
  );
  TankopediaVehicles.searchParams.append(
    "fields",
    [
      "is_premium",
      "tag",
      "images",
      "tank_id",
      "type",
      "short_name",
      "modules_tree.name",
      "modules_tree.type",
      "modules_tree.price_xp",
      "modules_tree.module_id",
      "modules_tree.next_modules",
      "nation",
      "tier",
      "is_gift",
      "name",
      "default_profile.speed_forward",
    ].join(", ")
  );
  TankopediaVehicles.searchParams.append("tier", "8, 9, 10");
  const data = await fetch(TankopediaVehicles);
  const json = await data.json();
  return json as TankopediaVehicleResult;
}
async function fetchTankopediaModules(moduleIds: Array<number>) {
  const tankopediaModulesEndpoint = new URL(
    "https://api.worldoftanks.eu/wot/encyclopedia/modules/"
  );
  tankopediaModulesEndpoint.searchParams.append(
    "application_id",
    env.WOT_APPLICATION_ID
  );
  tankopediaModulesEndpoint.searchParams.append(
    "module_id",
    moduleIds.join(", ")
  );

  tankopediaModulesEndpoint.searchParams.append("extra", "default_profile");

  tankopediaModulesEndpoint.searchParams.append(
    "fields",
    ["image", "module_id", "name", "default_profile"].join(", ")
  );

  const result = await fetch(tankopediaModulesEndpoint);
  const data = await result.json();
  return data;
}
async function handleTomatoGGData() {
  const data = await fetch(env.TOMATO_GG_HIDDEN_ENDPOINT);
  const json = await data.json();
  return json as TomatoGGResult;
}

export async function GET(req: Request) {
  // Prevent unauthorized access
  if (req.headers.get("Authorization") !== `Bearer ${env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  // fetch data
  const [tankopediaData, tomtatoggData] = await Promise.all([
    fetchTankopediaVehicles(),
    handleTomatoGGData(),
  ]);

  // merge data and get gun calibers not included by original tankopedia request
  const tomatoggDataMap = new Map<number, number>(); // id => battles past 30 days
  tomtatoggData.forEach((tank) => {
    if (tank.tier >= 8) {
      tomatoggDataMap.set(tank.tank_id, tank.battles);
    }
  });
  const moduleIdsToFetch = new Array<number>();
  const tankopediaWithBattlesPlayedAndModuleIds = new Array<Vehicle>();

  Object.values(tankopediaData.data).forEach((tank) => {
    // match battles 30 days
    const battles30Days = tomatoggDataMap.get(tank.tank_id);
    if (battles30Days === undefined)
      return console.log(
        `Tank ${tank.name} has no battles within past 30 days. Excluding item from dataset.`
      );
    // match gun module
    const modules = Object.values(tank.modules_tree);
    const gunModules = modules.filter((module) => module.type === "vehicleGun");
    const topGunModule = gunModules.reduce((prev, current) => {
      return prev.price_xp > current.price_xp ? prev : current;
    });
    moduleIdsToFetch.push(topGunModule.module_id);

    const search_name = tank.name.replaceAll(/[-\s.]/g, "");
    const search_short_name = tank.short_name.replaceAll(/[-\s.]/g, "");
    tankopediaWithBattlesPlayedAndModuleIds.push({
      ...tank,
      battles30Days,
      search_name,
      search_short_name,
      topGunModule: {
        module_id: topGunModule.module_id,
        image: "",
        name: "",
        default_profile: {
          gun: {
            ammo: [],
          },
        },
      },
    });
  });

  const modulePromises = new Array<Promise<TankopediaModulesResult>>();
  const chunkSize = 100;
  for (let i = 0; i < moduleIdsToFetch.length; i += chunkSize) {
    const chunk = moduleIdsToFetch.slice(i, i + chunkSize);
    modulePromises.push(fetchTankopediaModules(chunk));
  }

  const gunModulesData = await Promise.all(modulePromises);
  const gunModules = new Map<number, TankopediaGunModule>();
  gunModulesData.forEach((res) =>
    Object.values(res.data).forEach((module) =>
      gunModules.set(module.module_id, module)
    )
  );

  const vehicleList: Array<Vehicle> =
    tankopediaWithBattlesPlayedAndModuleIds.map((tank) => {
      const gunModule = gunModules.get(tank.topGunModule?.module_id ?? -1);
      return {
        ...tank,
        topGunModule: gunModule,
      };
    });

  // pick tank of day for tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowLocalString = tomorrow.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
  const dd_mm_yy = structuredClone(tomorrowLocalString).replaceAll("/", "_");
  const tomorrowInt = parseInt(
    structuredClone(tomorrowLocalString).replaceAll("_", "")
  );
  const index = Math.floor(seededRandom(tomorrowInt) * vehicleList.length);
  const tankOfDay = vehicleList[index];
  const supabaseClient = createClient(
    env.SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY
  );

  // update supabase vehicle list data and tank of day for tomorrow
  await Promise.allSettled([
    supabaseClient.from("vehicle_data").insert({ dd_mm_yy, data: vehicleList }),
    supabaseClient.from("tank_of_day").insert({
      dd_mm_yy,
      win_count: 0,
      tank_id: tankOfDay.tank_id,
      tank_name: tankOfDay.name,
    }),
  ]);
  return new Response("Update Success", { status: 200 });
}
