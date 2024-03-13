import { Component, For, Show } from "solid-js";
import AppStore from "./AppStore";
import { Vehicle } from "@/types/tankopedia.types";
import { capitalizeFirstLetter, romanize } from "@/utils/stringUtils";
import { twMerge } from "tailwind-merge";

const TankLabelMap: Record<string, string> = {
  lightTank: "Light",
  heavyTank: "Heavy",
  mediumTank: "Medium",
  "AT-SPG": "TD",
  SPG: "SPG",
} as const;

const TankItem: Component<{ tank: Vehicle }> = ({ tank }) => {
  const {
    appState: { tankOfDay },
  } = AppStore;

  const tankAlpha = () =>
    tank.topGunModule?.default_profile.gun.ammo[0].damage[1]!;
  const getAlphaDamageColor = () => {
    if (!tankOfDay) return "bg-zinc-900";
    const todDmg =
      tankOfDay.topGunModule?.default_profile.gun.ammo[0].damage[1] ?? 0;

    const diff = Math.abs(todDmg - tankAlpha());
    if (diff === 0) return "bg-correct";
    if (diff <= 50) return "bg-partialCorrect";
    return "bg-zinc-900";
  };
  const getBattles30DColor = () => {
    if (!tankOfDay) return "bg-zinc-900";
    if (tankOfDay.battles30Days! === tank.battles30Days!) return "bg-correct";
    const percentDiff =
      (Math.abs(tankOfDay.battles30Days! - tank.battles30Days!) /
        ((tankOfDay.battles30Days! + tank.battles30Days!) / 2)) *
      100;
    if (percentDiff <= 25) return "bg-partialCorrect";
    return "bg-zinc-900";
  };

  return (
    <div class="grid justify-center grid-cols-6 gap-2 text-sm sm:text-base ">
      <div
        class={twMerge(
          "select-none relative border rounded-sm border-neutral-700 flex justify-center py-1",
          tankOfDay?.tank_id === tank.tank_id ? "bg-correct" : "bg-zinc-900"
        )}
      >
        <span class="absolute h-full flex justify-center items-center ">
          {tank.name}
        </span>
        <img src={tank.images.big_icon} class="h-14" fetchpriority={"high"} />
      </div>
      <div
        class={twMerge(
          "select-none relative border rounded-sm border-neutral-700 flex justify-center",
          tank.nation === tankOfDay?.nation ? "bg-correct" : "bg-zinc-900"
        )}
      >
        <img
          src={`${tank.nation}.svg`}
          class="h-14 p-2 pb-4"
          fetchpriority={"high"}
        />
        <span class="absolute h-full flex justify-center items-end ">
          {capitalizeFirstLetter(tank.nation)}
        </span>
      </div>
      <div
        class={twMerge(
          "select-none relative border rounded-sm border-neutral-700 flex justify-center",
          tankOfDay?.tier === tank.tier ? "bg-correct" : "bg-zinc-900"
        )}
      >
        <span class="absolute h-full flex justify-center items-center text-3xl sm:text-4xl">
          {romanize(tank.tier)}
        </span>
      </div>
      <div
        class={twMerge(
          "select-none relative border rounded-sm border-neutral-700 flex justify-center",
          tank.type === tankOfDay?.type ? "bg-correct" : "bg-zinc-900"
        )}
      >
        <span class="absolute h-full flex justify-center items-end">
          {TankLabelMap[tank.type]}
        </span>
        <img src={`${tank.type}.png`} class="h-14" fetchpriority={"high"} />
      </div>

      <div
        class={twMerge(
          "select-none relative border rounded-sm border-neutral-700 flex justify-center",
          getAlphaDamageColor()
        )}
      >
        <span class="absolute h-full flex justify-center items-center sm:text-4xl text-xl">
          {tankAlpha()}
        </span>
      </div>
      <div
        class={twMerge(
          "select-none relative border rounded-sm border-neutral-700 flex justify-center",
          getBattles30DColor()
        )}
      >
        <span class="absolute h-full flex justify-center items-center text-xl sm:text-2xl">
          {tank.battles30Days}
        </span>
      </div>
    </div>
  );
};

const GuessList: Component = () => {
  const { appState } = AppStore;

  return (
    <Show when={appState.guessedTanks.length > 0}>
      <div class="grid text-center justify-center gap-y-2">
        <div class="grid justify-center grid-cols-6  text-lg text-neutral-200 gap-2">
          <span class="border-b-2 border-neutral-300">Vehicle</span>
          <span class="border-b-2 border-neutral-300">Nation</span>
          <span class="border-b-2 border-neutral-300">Tier</span>
          <span class="border-b-2 border-neutral-300">Type</span>
          <span class="border-b-2 border-neutral-300">Alpha Damage</span>
          <div class="flex border-b-2 flex-col relative">
            <span class="bg-neutral-800">Battles Played</span>
            <span class="text-sm text-neutral-300 font-thin absolute text-center w-full -top-3.5 h-5 overflow-hidden">
              Last 30 Days
            </span>
          </div>
        </div>
        <For each={[...appState.guessedTanks]}>
          {(tank) => <TankItem tank={tank} />}
        </For>
      </div>
    </Show>
  );
};

export default GuessList;
