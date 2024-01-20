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

export const fetchTankList = async () => {
  const result = await fetch("https://tanks.gg/api/list");
  const data = (await result.json()) as FetchFullTankListResultType;
  const techTreeTanks = data.tanks.filter(
    (tank) =>
      tank.not_in_shop === false &&
      tank.gold_price === 0 &&
      tank.regions_json.includes("eu")
  );
  return techTreeTanks;
};

export const tankImg = (tank: Tank) =>
  `https://tanks.gg/img/tanks/${tank.nation}-${tank.original_id}.png`;

export const tankTypeImg = (type: Tank["type"]) =>
  `https://tanks.gg/img/class/${type}.png`;

export const tankNationImg = (nation: string) =>
  `https://tanks.gg/img/nations/${nation}.svg`;
