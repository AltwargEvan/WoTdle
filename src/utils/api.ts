import { cache } from "@solidjs/router";
import { createResource } from "solid-js";
import { seededRandom } from "./seededRandom";
import { todayAsInt } from "./todayAsInt";

export type Tank = {
  gold_price: number;
  id: string;
  name: string;
  nation: string;
  not_in_shop: boolean;
  original_id: string;
  price: string;
  regions_json: string;
  short_name: string;
  slug: string;
  tags: string;
  tier: number;
  type: "light" | "heavy" | "medium" | "spg" | "td";
  vehicle_role?: string;
};
type FetchFullTankListResultType = {
  tanks: Array<Tank>;
  version: `v${number}`;
};

export const getAppData = cache(async () => {
  "use server";
  const result = await fetch("https://tanks.gg/api/list");
  const data = (await result.json()) as FetchFullTankListResultType;
  const tankList = data.tanks.filter(
    (tank) =>
      tank.not_in_shop === false &&
      tank.gold_price === 0 &&
      tank.regions_json.includes("eu")
  );
  const index = Math.floor(seededRandom(todayAsInt()) * tankList.length);
  const tankOfDay = tankList[index];
  return { tankList, tankOfDay };
}, "tankList");

export const tankImg = (tank: Tank) =>
  `https://tanks.gg/img/tanks/${tank.nation}-${tank.original_id}.png`;
