import { TankopediaGunModule, TankopediaModule } from "./tankopedia.types";

export type Vehicle = {
  topGunModule: TankopediaGunModule | undefined;
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
  battles30Days: number;
  search_name: string;
  search_short_name: string;
};
