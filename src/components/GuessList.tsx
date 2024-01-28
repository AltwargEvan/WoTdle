import { Component, For, Show } from "solid-js";
import AppStore from "./AppStore";
import { Vehicle } from "@/types/tankopedia.types";
import { capitalizeFirstLetter, romanize } from "@/utils/stringUtils";

const red = "#ef4444" as const;
const green = "#22c55e" as const;
const yellow = "#facc15" as const;
const TankItem: Component<{ tank: Vehicle }> = ({ tank }) => {
  const {
    appState: { tankOfDay },
  } = AppStore;

  const getTierColor = () => {
    if (!tankOfDay) return red;
    const diff = Math.abs(tankOfDay.tier - tank.tier);
    if (diff === 0) return green;
    if (diff === 1) return yellow;
    return red;
  };
  const tankAlpha = () =>
    tank.topGunModule?.default_profile.gun.ammo[0].damage[1]!;
  const getAlphaDamageColor = () => {
    if (!tankOfDay) return red;
    const todDmg =
      tankOfDay.topGunModule?.default_profile.gun.ammo[0].damage[1] ?? 0;

    const diff = Math.abs(todDmg - tankAlpha());
    if (diff === 0) return green;
    if (diff <= 50) return yellow;
    return red;
  };

  const getBattles30DColor = () => {
    if (!tankOfDay) return red;
    if (tankOfDay.battles30Days! === tank.battles30Days!) return green;
    const percentDiff =
      (Math.abs(tankOfDay.battles30Days! - tank.battles30Days!) /
        ((tankOfDay.battles30Days! + tank.battles30Days!) / 2)) *
      100;
    if (percentDiff <= 20) return yellow;
    return red;
  };

  const getTankTypeLabel = () => {
    switch (tank.type) {
      case "lightTank":
        return "Light";
      case "heavyTank":
        return "Heavy";
      case "mediumTank":
        return "Medium";
      case "AT-SPG":
        return "TD";
      case "SPG":
        return "SPG";
    }
  };
  return (
    <div class="grid w-full justify-center grid-cols-6 gap-4 text-sm sm:text-xl max-w-[70rem]">
      <div
        style={{
          "background-color": tankOfDay?.tank_id === tank.tank_id ? green : red,
        }}
        class=" select-none relative border rounded border-neutral-700 flex justify-center py-1"
      >
        <span class="absolute h-full flex justify-center items-center">
          {tank.name}
        </span>
        <img
          src={tank.images.big_icon}
          class="h-14"
          elementtiming={""}
          fetchpriority={"high"}
        />
      </div>
      <div
        style={{
          "background-color": tank.nation === tankOfDay?.nation ? green : red,
        }}
        class="select-none relative border rounded border-neutral-700 flex justify-center"
      >
        <img
          src={`${tank.nation}.svg`}
          class="h-14 p-2 pb-4"
          elementtiming={""}
          fetchpriority={"high"}
        />
        <span class="absolute h-full flex justify-center items-end">
          {capitalizeFirstLetter(tank.nation)}
        </span>
      </div>
      <div
        style={{
          "background-color": getTierColor(),
        }}
        class=" select-none relative border rounded border-neutral-700 flex justify-center"
      >
        <span class="absolute h-full flex justify-center items-center text-3xl sm:text-5xl">
          {romanize(tank.tier)}
        </span>
      </div>
      <div
        style={{
          "background-color": tank.type === tankOfDay?.type ? green : red,
        }}
        class=" select-none relative border rounded border-neutral-700 flex justify-center"
      >
        <span class="absolute h-full flex justify-center items-end">
          {getTankTypeLabel()}
        </span>
        <img
          src={`${tank.type}.png`}
          class="h-14"
          elementtiming={""}
          fetchpriority={"high"}
        />
      </div>

      <div
        style={{
          "background-color": getAlphaDamageColor(),
        }}
        class=" select-none relative border rounded border-neutral-700 flex justify-center"
      >
        <span class="absolute h-full flex justify-center items-center md:text-5xl text-3xl">
          {tankAlpha()}
        </span>
      </div>
      <div
        style={{
          "background-color": getBattles30DColor(),
        }}
        class=" select-none relative border rounded border-neutral-700 flex justify-center"
      >
        <span class="absolute h-full flex justify-center items-center text-3xl">
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
      <div class="grid text-center justify-center gap-y-4">
        <div class="grid justify-center grid-cols-6  text-xl sm:text-2xl gap-2 md:gap-4 w-full max-w-[70rem]">
          <span class="border-b-2">Vehicle</span>
          <span class="border-b-2">Nation</span>
          <span class="border-b-2">Tier</span>
          <span class="border-b-2">Type</span>
          <span class="border-b-2">Alpha Damage</span>
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
