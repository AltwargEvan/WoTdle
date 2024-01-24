import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

type TankopediaModule = {
  price_xp: number;
  type: string;
  name: string;
  module_id: number;
  next_modules: Array<number> | null;
};
type TankopediaItem = {
  is_gift: boolean;
  name: string;
  short_name: string;
  modules_tree: Record<number, TankopediaModule>;
  nation: string;

  is_premium: boolean;
  images: {
    small_icon: string;
    contour_icon: string;
    big_icon: string;
  };
  tag: string;
  default_profile: {
    speed_forward: number;
  };
  tier: number;
  type: string;
  tank_id: number;
};
type TankopediaResult = {
  status: string;
  meta: {
    count: number;
    page_total: number;
    total: number;
    limit: number;
    page: null | number;
  };
  data: Record<number, TankopediaItem>;
};

type TankopediaGunModule = {
  image: string;
  module_id: number;
  name: string;
  default_profile: {
    gun: {
      ammo: {
        damage: number[];
        penetration: number[];
        type: number[];
      }[];
    };
  };
};

type TankopediaModulesEndpointResult = {
  status: string;
  meta: {
    count: number;
    page_total: number;
    total: number;
    limit: number;
    page: null | number;
  };
  data: Record<number, TankopediaGunModule>;
};

type TomatoGGResult = {
  tank_id: number;
  name: string;
  nation: string;
  tier: number;
  class: string;
  image: string;
  big_image: string;
  battles: number;
  winrate: number;
  player_winrate: number;
  winrate_differential: number;
  damage: number;
  sniper_damage: number;
  frags: number;
  shots_fired: number;
  direct_hits: number;
  penetrations: number;
  hit_rate: number;
  pen_rate: number;
  spotting_assist: number;
  tracking_assist: number;
  spots: number;
  damage_blocked: number;
  damage_received: number;
  potential_damage_received: number;
  base_capture_points: number;
  base_defense_points: number;
  life_time: number;
  survival: number;
  distance_traveled: number;
  wn8: number;
  isPrem: false;
}[];

// process env
const WOT_APPLICATION_ID = process.env.WOT_APPLICATION_ID;
const TOMATO_GG_HIDDEN_ENDPOINT = process.env.TOMATO_GG_HIDDEN_ENDPOINT;
if (WOT_APPLICATION_ID === undefined || TOMATO_GG_HIDDEN_ENDPOINT === undefined)
  throw new Error("Failed to parse environment variables");

// fetch data
const handleFetchWargamingData = new Promise<TankopediaResult>(async (res) => {
  const TankopediaVehicles = new URL(
    "https://api.worldoftanks.eu/wot/encyclopedia/vehicles/"
  );
  TankopediaVehicles.searchParams.append("application_id", WOT_APPLICATION_ID);
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
  // fs.writeFileSync(__dirname + "/data/tankopedia.json", JSON.stringify(json));
  res(json as TankopediaResult);
});

const handleFetchTomatoGGData = new Promise<TomatoGGResult>(async (res) => {
  const data = await fetch(TOMATO_GG_HIDDEN_ENDPOINT);
  const json = await data.json();
  // fs.writeFileSync(__dirname + "/data/tomatogg.json", JSON.stringify(json));
  res(json as TomatoGGResult);
});

const [tankopediaData, tomtatoggData] = await Promise.all([
  handleFetchWargamingData,
  handleFetchTomatoGGData,
]);

// merge data and get gun calibers not included by original tankopedia request
const tomatoggDataMap = new Map<number, number>(); // id => battles past 30 days
tomtatoggData.forEach((tank) => {
  if (tank.tier >= 8) {
    tomatoggDataMap.set(tank.tank_id, tank.battles);
  }
});

const moduleIdsToFetch = new Array();

const mergedData = Object.values(tankopediaData.data).map((tank) => {
  // match battles 30 days
  const battles30Days = tomatoggDataMap.get(tank.tank_id);
  const modules = Object.values(tank.modules_tree);
  // get top gun module. add to fetch list
  const gunModules = modules.filter((module) => module.type === "vehicleGun");
  const topGunModule = gunModules.reduce((prev, current) => {
    return prev.price_xp > current.price_xp ? prev : current;
  });
  moduleIdsToFetch.push(topGunModule.module_id);

  // generate search names
  const search_name = tank.name.replaceAll(/[-\s.]/g, "");
  const search_short_name = tank.short_name.replaceAll(/[-\s.]/g, "");
  return {
    ...tank,
    battles30Days,
    search_name,
    search_short_name,
    topGunModule: {
      module_id: topGunModule.module_id,
    },
  };
});

const moduleChunks = new Array<Array<string>>();
const chunkSize = 100;
for (let i = 0; i < moduleIdsToFetch.length; i += chunkSize) {
  const chunk = moduleIdsToFetch.slice(i, i + chunkSize);
  moduleChunks.push(chunk);
}

const modulePromises = moduleChunks.map(
  (chunk) =>
    new Promise<TankopediaModulesEndpointResult>(async (resolve) => {
      const tankopediaModulesEndpoint = new URL(
        "https://api.worldoftanks.eu/wot/encyclopedia/modules/"
      );
      tankopediaModulesEndpoint.searchParams.append(
        "application_id",
        WOT_APPLICATION_ID
      );
      tankopediaModulesEndpoint.searchParams.append(
        "module_id",
        chunk.join(", ")
      );

      tankopediaModulesEndpoint.searchParams.append("extra", "default_profile");

      tankopediaModulesEndpoint.searchParams.append(
        "fields",
        ["image", "module_id", "name", "default_profile"].join(", ")
      );

      const result = await fetch(tankopediaModulesEndpoint);
      const data = await result.json();
      resolve(data as TankopediaModulesEndpointResult);
    })
);

const gunModulesData = await Promise.all(modulePromises);
const gunModules = new Map<number, TankopediaGunModule>();
gunModulesData.forEach((res) =>
  Object.values(res.data).forEach((module) =>
    gunModules.set(module.module_id, module)
  )
);

const vehicleList = mergedData.map((tank) => {
  const gunModule = gunModules.get(tank.topGunModule.module_id);
  return {
    ...tank,
    topGunModule: gunModule,
  };
});

export type Vehicle = (typeof vehicleList)[number];

fs.writeFileSync(
  __dirname + "/data/vehicleList.json",
  JSON.stringify(vehicleList)
);

console.log("Successfully fetched and merged external vehicle data");
console.log("Finished prebuild step");
