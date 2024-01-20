import { Component, For, Show } from "solid-js";
import AppStore from "./AppStore";
import { Tank, tankImg, tankNationImg, tankTypeImg } from "../utils/api";
import { romanize } from "../utils/romanize";

const red = "#ef4444" as const;
const green = "#22c55e" as const;
const yellow = "#facc15" as const;
const TankItem: Component<{ tank: Tank }> = ({ tank }) => {
  const {
    appState: { tankOfDay },
  } = AppStore;

  const getTierColor = () => {
    console.log(tankOfDay);
    if (!tankOfDay) return red;
    const diff = Math.abs(tankOfDay.tier - tank.tier);
    if (diff === 0) return green;
    if (diff === 1) return yellow;
    return red;
  };

  return (
    <div class="grid w-full justify-center grid-cols-4 gap-4">
      <div
        style={{
          "background-color": tankOfDay?.id === tank.id ? green : "",
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
        <span class="absolute h-full flex justify-center items-center text-5xl">
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
          {tank.type.charAt(0).toUpperCase() + tank.type.slice(1)}
        </span>
        <img
          src={tankTypeImg(tank.type)}
          class="h-12 pb-0.5"
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
        <span class="absolute h-full flex justify-center items-end">
          {tank.nation}
        </span>
        <img
          src={tankNationImg(tank.nation)}
          class="h-12 py-1"
          elementtiming={""}
          fetchpriority={"high"}
        />
      </div>
    </div>
  );
};

const GuessList: Component = () => {
  const { appState } = AppStore;

  return (
    <Show when={appState.guessedTanks.length > 0}>
      <div class="grid w-5/6 max-w-[60rem] text-center justify-center gap-y-4">
        <div class="grid justify-center grid-cols-4 text-2xl gap-2 md:gap-4 w-full md:w-[35rem]">
          <span class="border-b-2">Vehicle</span>
          <span class="border-b-2">Tier</span>
          <span class="border-b-2">Type</span>
          <span class="border-b-2">Nation</span>
        </div>

        <For each={[...appState.guessedTanks]}>
          {(tank) => <TankItem tank={tank} />}
        </For>
      </div>
    </Show>
  );
};

export default GuessList;
