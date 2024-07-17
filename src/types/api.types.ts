import { VehicleI18N } from "@/utils/WargamingApi";

export type Vehicle = {
  is_gift: boolean;
  name: string;
  short_name: string;
  nation: string;
  is_premium: boolean;
  images: {
    small_icon: string;
    contour_icon: string;
    big_icon: string;
  };
  tag: string;
  speed_forward: number;
  tier: number;
  type: string;
  tank_id: number;
  search_name: string;
  search_short_name: string;
  alphaDmg: number;
  i18n: VehicleI18N;
  mimic_list?: number[];
};
