import { cache } from "@solidjs/router";
import { seededRandom } from "./seededRandom";
import { todayAsInt } from "./todayAsInt";
import { capitalizeFirstLetter } from "./capitalizeFirstLetter";

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

export type TankData = {
  description: string;
};
export const getTankData = async (tank: Tank) => {
  const result = await fetch(`https://tanks.gg/api/tank/${tank.slug}`);
  const data = await result.json();
  return data;
};

export const tankImg = (tank: Tank) =>
  `https://tanks.gg/img/tanks/${tank.nation}-${tank.original_id}.png`;

export const tankRole = (tank: Tank) => {
  let role = undefined as undefined | string;
  let icon = undefined as undefined | string;
  let text = undefined as undefined | string;
  const roleUnparsed = tank.tags
    .split(",")
    .find((x) => x.startsWith("role"))
    ?.split("_");
  if (roleUnparsed) {
    role = roleUnparsed[roleUnparsed?.length - 1];
    switch (role) {
      case "assault":
      case "sniper":
      case "support":
      case "wheeled":
      case "SPG":
        text = capitalizeFirstLetter(role);
        break;
      case "universal":
        text = "Versatile";
        break;
      case "break":
        text = "Breakthrough";
        break;
      default:
    }
    icon = `role_${role}.png`;
  }
  console.log(role, text, icon);

  return { role, icon, text };
};
