import { Component, For, Show } from "solid-js";
import AppStore from "../stores/wotdleSessionStateStore";
import { capitalizeFirstLetter, romanize } from "@/utils/stringUtils";
import { twMerge } from "tailwind-merge";
import { usePersistedData } from "@/stores/wotdlePersistedDataStore";
import * as m from "@/paraglide/messages.js";
import { languageTag } from "@/i18n";
import { i18nApiMap } from "@/utils/WargamingApi";
import { Vehicle } from "@/types/api.types";
import { splitInto2Lines } from "@/utils/splitInto2Lines";
import { translateNation } from "@/utils/i18nNation";

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

  const getTankIconColor = () => {
    if (!todaysVehicle) return "bg-zinc-900";
    if (todaysVehicle.tank_id === tank.tank_id) return "bg-correct";
    if (todaysVehicle.mimic_list !== undefined &&
      todaysVehicle.mimic_list.includes(tank.tank_id)) return "bg-partialCorrect";
    return "bg-zinc-900";
  }

  const tankType = () => {
    switch (tank.type) {
      case "SPG":
        return m.tank_type_SPG();
      case "mediumTank":
        return m.tank_type_medium();
      case "AT-SPG":
        return m.tank_type_tank_destroyer();
      case "lightTank":
        return m.tank_type_light();
      case "heavyTank":
        return m.tank_type_heavy();
    }
  };
  const lang = i18nApiMap[languageTag()];

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
          "select-none relative border rounded-sm border-neutral-700 flex justify-center py-1 ",
          getTankIconColor()
        )}
      >
        <span class="absolute h-full flex justify-center items-center text-outline">
          {tank.i18n[lang].name}
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
          src={`/${tank.nation}.svg`}
          class="h-[4rem] pt-0.5 pb-4"
          fetchpriority={"high"}
        />
        <span class="absolute h-full flex justify-center items-end text-outline">
          {translateNation(tank.nation)}
        </span>
      </div>
      <div
        class={twMerge(
          "select-none relative border rounded-sm border-neutral-700 flex justify-center",
          todaysVehicle?.tier === tank.tier ? "bg-correct" : "bg-zinc-900"
        )}
      >
        <span class="absolute h-full flex justify-center items-center text-3xl sm:text-4xl text-outline">
          {romanize(tank.tier)}
        </span>
      </div>
      <div
        class={twMerge(
          "select-none relative border rounded-sm border-neutral-700 flex justify-center",
          tank.type === todaysVehicle?.type ? "bg-correct" : "bg-zinc-900"
        )}
      >
        <span class="absolute h-full flex justify-center items-end text-outline">
          {tankType()}
        </span>
        <img src={`/${tank.type}.png`} class="h-14" fetchpriority={"high"} />
      </div>

      <div
        class={twMerge(
          "select-none relative border rounded-sm border-neutral-700 flex justify-center ",
          getAlphaDamageColor()
        )}
      >
        <span class="absolute h-full flex justify-center items-center sm:text-4xl text-xl text-outline">
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

  const alphaDmgClass = twMerge(
    "border-b-2 border-neutral-300",
    languageTag() === "pl" ? "text-sm pt-1.5" : "text-lg"
  );
  return (
    <Show when={data.dailyVehicleGuesses.length > 0}>
      <div class="grid text-center justify-center gap-y-2">
        <div class="grid justify-center grid-cols-5  text-lg text-neutral-200 gap-2 md:w-[600px]">
          <span class="border-b-2 border-neutral-300">
            {m.guess_list_vehicle()}
          </span>
          <span class="border-b-2 border-neutral-300">
            {" "}
            {m.guess_list_nation()}
          </span>
          <span class="border-b-2 border-neutral-300">
            {" "}
            {m.guess_list_tier()}
          </span>
          <span class="border-b-2 border-neutral-300">
            {m.guess_list_type()}
          </span>
          <span class={alphaDmgClass}>{m.guess_list_damage()}</span>
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
