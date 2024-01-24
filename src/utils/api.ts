"use server";
import { cache } from "@solidjs/router";
import { seededRandom } from "./seededRandom";
import { todayAsInt } from "./dateutils";
import vehicleList from "@/data/vehicleList.json";
import { Vehicle } from "@/prebuild";

export const getAppData = cache(async () => {
  "use server";
  const index = Math.floor(seededRandom(todayAsInt()) * vehicleList.length);
  const tankOfDay = vehicleList[index] as unknown as Vehicle;
  return { tankList: vehicleList as unknown as Vehicle[], tankOfDay };
}, "tankList");
