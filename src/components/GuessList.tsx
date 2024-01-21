import { Component, For, Show } from "solid-js";
import AppStore from "./AppStore";
import { Tank, tankImg, tankRole } from "../utils/api";
import { romanize } from "../utils/romanize";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";

const red = "#ef4444" as const;
const green = "#22c55e" as const;
const yellow = "#facc15" as const;
const TankItem: Component<{ tank: Tank }> = ({ tank }) => {
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

  const role = tankRole(tank);
  const todRole = tankRole(tankOfDay!);
  return (
    <div class="grid w-full justify-center grid-cols-5 gap-4 text-sm sm:text-xl">
      <div
        style={{
          "background-color": tankOfDay?.id === tank.id ? green : red,
        }}
        class=" select-none relative border rounded border-neutral-700 flex justify-center py-1"
      >
        <span class="absolute h-full flex justify-center items-center">
          {tank.name}
        </span>
        <img
          src={tankImg(tank)}
          class="h-14"
          elementtiming={""}
          fetchpriority={"high"}
        />
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
          {capitalizeFirstLetter(tank.type)}
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
          "background-color": role.role === todRole.role ? green : red,
        }}
        class="select-none relative border rounded border-neutral-700 flex justify-center "
      >
        <img
          src={role.icon}
          class="h-12 py-1"
          elementtiming={""}
          fetchpriority={"high"}
        />
        <span class="absolute h-full flex justify-center items-end">
          {role.text}
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
        <div class="grid justify-center grid-cols-5  text-xl sm:text-2xl gap-2 md:gap-4 w-full md:w-[35rem]">
          <span class="border-b-2">Vehicle</span>
          <span class="border-b-2">Tier</span>
          <span class="border-b-2">Type</span>
          <span class="border-b-2">Nation</span>
          <span class="border-b-2">Role</span>
        </div>

        <For each={[...appState.guessedTanks]}>
          {(tank) => <TankItem tank={tank} />}
        </For>
      </div>
    </Show>
  );
};

export default GuessList;
