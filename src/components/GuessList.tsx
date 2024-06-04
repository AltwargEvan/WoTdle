import { Component, For, Match, Show, Switch, createEffect } from "solid-js";
import AppStore from "../stores/wotdleSessionStateStore";
import { Vehicle } from "@/types/tankopedia.types";
import { capitalizeFirstLetter, romanize } from "@/utils/stringUtils";
import { twMerge } from "tailwind-merge";
import { usePersistedData } from "@/stores/wotdlePersistedDataStore";
import { RawDictionary, t } from "@/i18n";

const TankItem: Component<{ tank: Vehicle }> = ({ tank }) => {
  const {
    gameState: { todaysVehicle },
  } = AppStore;

  const tankAlpha = () => tank.alphaDmg;
  const getAlphaDamageColor = () => {
    if (!todaysVehicle) return "bg-zinc-900";
    const todDmg = todaysVehicle.alphaDmg;
    const diff = Math.abs(todDmg - tankAlpha());
    if (diff === 0) return "bg-correct";
    if (diff <= 50) return "bg-partialCorrect";
    return "bg-zinc-900";
  };

  // const getBattles30DColor = () => {
  //   if (!todaysVehicle) return "bg-zinc-900";
  //   if (todaysVehicle.battles30Days! === tank.battles30Days!)
  //     return "bg-correct";
  //   const percentDiff =
  //     (Math.abs(todaysVehicle.battles30Days! - tank.battles30Days!) /
  //       ((todaysVehicle.battles30Days! + tank.battles30Days!) / 2)) *
  //     100;
  //   if (percentDiff <= 25) return "bg-partialCorrect";
  //   return "bg-zinc-900";
  // };

  return (
    <div class="grid justify-center grid-cols-5 gap-2 text-sm sm:text-base ">
      <div
        class={twMerge(
          "select-none relative border rounded-sm border-neutral-700 flex justify-center py-1",
          todaysVehicle?.tank_id === tank.tank_id ? "bg-correct" : "bg-zinc-900"
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
          tank.nation === todaysVehicle?.nation ? "bg-correct" : "bg-zinc-900"
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
          todaysVehicle?.tier === tank.tier ? "bg-correct" : "bg-zinc-900"
        )}
      >
        <span class="absolute h-full flex justify-center items-center text-3xl sm:text-4xl">
          {romanize(tank.tier)}
        </span>
      </div>
      <div
        class={twMerge(
          "select-none relative border rounded-sm border-neutral-700 flex justify-center",
          tank.type === todaysVehicle?.type ? "bg-correct" : "bg-zinc-900"
        )}
      >
        <span class="absolute h-full flex justify-center items-end">
          {t(
            `guessList.tankType.${
              tank.type as keyof RawDictionary["guessList"]["tankType"]
            }`
          )}
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
      {/* <div
        class={twMerge(
          "select-none relative border rounded-sm border-neutral-700 flex justify-center",
          getBattles30DColor()
        )}
      >
        <span class="absolute h-full flex justify-center items-center text-xl sm:text-2xl">
          <Switch fallback={<></>}>
            <Match when={todaysVehicle!.battles30Days! > tank.battles30Days!}>
              &gt;
            </Match>
            <Match when={todaysVehicle!.battles30Days! < tank.battles30Days!}>
              &lt;
            </Match>
          </Switch>
          {tank.battles30Days}
        </span>
      </div> */}
    </div>
  );
};

const GuessList: Component = () => {
  const [data] = usePersistedData();

  return (
    <Show when={data.dailyVehicleGuesses.length > 0}>
      <div class="grid text-center justify-center gap-y-2">
        <div class="grid justify-center grid-cols-5  text-lg text-neutral-200 gap-2">
          <span class="border-b-2 border-neutral-300">
            {t("guessList.vehicle")}
          </span>
          <span class="border-b-2 border-neutral-300">
            {" "}
            {t("guessList.nation")}
          </span>
          <span class="border-b-2 border-neutral-300">
            {" "}
            {t("guessList.tier")}
          </span>
          <span class="border-b-2 border-neutral-300">
            {" "}
            {t("guessList.type")}
          </span>
          <span class="border-b-2 border-neutral-300">
            {t("guessList.damage")}
          </span>
          {/* <div class="flex border-b-2 flex-col relative">
            <span class="bg-neutral-800">Battles Played</span>
            <span class="text-sm text-neutral-300 font-thin absolute text-center w-full -top-3.5 h-5 overflow-hidden">
              Last 30 Days
            </span>
          </div> */}
        </div>
        <For each={data.dailyVehicleGuesses}>
          {(tank) => <TankItem tank={tank} />}
        </For>
      </div>
    </Show>
  );
};

export default GuessList;
