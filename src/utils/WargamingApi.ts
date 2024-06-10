import { env } from "@/env/server";
import { AvailableLanguageTag, availableLanguageTags } from "@/i18n";
import { resolve } from "vinxi";

export type TankopediaGunModule = {
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

type TankopediaModule = {
  type: string;
  name: string;
  module_id: number;
  next_modules: Array<number> | null;
  price_xp: number;
};

type APIResult<TData> =
  | {
      status: "error";
      error: {
        field: unknown;
        message: string;
        code: number;
        value: string;
      };
    }
  | {
      status: "success";
      meta: {
        count: number;
        page_total: number;
        total: number;
        limit: number;
        page: null | number;
      };
      data: TData;
    };

type TODO = any;

type EncyclopediaI18nVehicle = {
  name: string;
  nation: string;
  tank_id: number;
};
export type EncyclopediaVehicle = {
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
  i18n: VehicleI18N;
};

export type VehicleI18N = Record<
  (typeof WargamingApi.languages)[number],
  { name: string; nation: string }
>;
export const i18nApiMap = {
  en: "en",
  pt: "en",
  cz: "cs",
  de: "de",
  es: "es",
  fr: "fr",
  tr: "tr",
  pl: "pl",
} as const;

export class WargamingApi {
  private static authenticatedEndpoint(path: string) {
    const endpoint = new URL(`https://api.worldoftanks.com/wot/${path}`);
    endpoint.searchParams.append("application_id", env.WOT_APPLICATION_ID);
    return endpoint;
  }

  public static vehicleFields = [
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
  ] as const;

  static languages = ["en", "cs", "de", "es", "fr", "tr", "pl"] as const;

  static async vehicles() {
    const baseData = new Promise<Record<number, EncyclopediaVehicle>>(
      async (resolve, reject) => {
        const endpoint = this.authenticatedEndpoint("encyclopedia/vehicles/");
        endpoint.searchParams.append("fields", this.vehicleFields.join(", "));
        const data = await fetch(endpoint);
        const json = (await data.json()) as APIResult<
          Record<number, EncyclopediaVehicle>
        >;
        if (json.status === "error") {
          reject(json.error);
        } else {
          resolve(json.data);
        }
      }
    );

    const i18nPromises = this.languages.map(
      (lang) =>
        new Promise<
          [
            Record<number, EncyclopediaI18nVehicle>,
            (typeof this.languages)[number]
          ]
        >(async (resolve, reject) => {
          const endpoint = this.authenticatedEndpoint(
            "/encyclopedia/vehicles/"
          );
          endpoint.searchParams.append("fields", "name, tank_id, nation");
          endpoint.searchParams.append("language", lang);
          const data = await fetch(endpoint);
          const json = (await data.json()) as APIResult<
            Record<number, EncyclopediaI18nVehicle>
          >;
          if (json.status === "error") {
            reject(json.error);
          } else {
            resolve([json.data, lang]);
          }
        })
    );

    const [base, ...langs] = await Promise.all([
      baseData,
      ...i18nPromises,
    ] as const);

    const merged: EncyclopediaVehicle[] = Object.entries(base).map(([k, v]) => {
      const key = k as unknown as number;
      const i18n = langs.reduce((acc, [data, lang]) => {
        acc[lang] = {
          name: data[key].name,
          nation: data[key].nation,
        };
        return acc;
      }, {} as VehicleI18N);
      if (key === 1) console.log("i18n", i18n);
      return { ...v, i18n };
    });

    return merged;
  }

  static async modules(moduleIds: number[]) {
    const chunkSize = 100;
    const chunks: number[][] = [];
    for (let i = 0; i < moduleIds.length; i++) {
      const chunkIndex = Math.floor(i / chunkSize);
      if (chunks[chunkIndex] === undefined) {
        chunks[chunkIndex] = [];
      }
      chunks[chunkIndex].push(moduleIds[i]);
    }

    const promises = chunks.map(
      (chunk) =>
        new Promise<Record<number, TankopediaGunModule>>(
          async (resolve, reject) => {
            const endpoint = this.authenticatedEndpoint(
              "encyclopedia/modules/"
            );
            endpoint.searchParams.append("module_id", chunk.join(", "));
            endpoint.searchParams.append("extra", "default_profile");
            endpoint.searchParams.append(
              "fields",
              ["module_id", "name", "default_profile"].join(", ")
            );

            const data = await fetch(endpoint);
            const json = (await data.json()) as APIResult<
              Record<number, TankopediaGunModule>
            >;
            if (json.status === "error") {
              reject(json.error);
            } else {
              resolve(json.data);
            }
          }
        )
    );
    const result = await Promise.all(promises);
    return result.reduce((acc, chunk) => ({ ...acc, ...chunk }));
  }
}
