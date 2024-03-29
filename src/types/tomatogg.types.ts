export type TomatoGGResult = {
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
