import { env } from "@/env/server";
import { Vehicle } from "@/types/api.types";
import { createClient } from "@supabase/supabase-js";
import type { APIEvent } from "@solidjs/start/server";
import { EncyclopediaVehicle, WargamingApi } from "@/utils/WargamingApi";
import { Client, GatewayIntentBits } from "discord.js";
import { Database } from "@/types/database.types";

const RUOnlyTanks = ["SU-122V", "K-91 Version II"];

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

function dateString(date: Date) {
  date.setDate(date.getDate());
  return date
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      timeZone: "America/New_York",
    })
    .replaceAll("/", "_");
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

      const search_name = vehicle.name.replaceAll(/[-\s.]/g, "");
      const search_short_name = vehicle.short_name.replaceAll(/[-\s.]/g, "");

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

    const [updateDailyRes, ...updateVehicleDataRes] = await Promise.all([
      updateDaily,
      ...updateVehicleData,
    ]);

    if (updateDailyRes.error) {
      throw ["Failed to update daily data", updateDailyRes.error];
    }

    const updateVehicleDataError = updateVehicleDataRes.find(
      (res) => res.error !== null
    );
    if (updateVehicleDataError) {
      throw ["Failed to update vehicle data", updateVehicleDataError];
    }

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    try {
      console.error(error);
      const discord = new Client({
        intents: [GatewayIntentBits.DirectMessages],
      });
      await discord.login(env.DISCORD_BOT_TOKEN);
      const user = await discord.users.fetch(env.DISCORD_USER_ID);
      user.send(
        `Failed to update Wotdle Data for ${new Date().toLocaleDateString(
          "en-GB",
          {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
            timeZone: "America/New_York",
          }
        )} with error" \n\n\`\`\`${JSON.stringify(error)}\`\`\``
      );
    } catch (discordError) {
      console.error(discordError);
    } finally {
      return Response.json({ success: false }, { status: 500 });
    }
  }
}
