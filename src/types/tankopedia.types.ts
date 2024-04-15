export type TankopediaModule = {
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

type TankopediaResult<T> = {
  status: string;
  meta: {
    count: number;
    page_total: number;
    total: number;
    limit: number;
    page: null | number;
  };
  data: T;
};

export type TankopediaVehicleResult = TankopediaResult<
  Record<number, TankopediaItem>
>;

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

export type TankopediaModulesResult = TankopediaResult<
  Record<number, TankopediaGunModule>
>;

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
  battles30Days: number;
  search_name: string;
  search_short_name: string;
  alphaDmg: number;
};

export type VehicleFat = Vehicle & {
  default_profile: {
    speed_forward: number;
  };
  topGunModule: TankopediaGunModule | undefined;
};
