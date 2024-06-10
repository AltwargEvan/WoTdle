import { CurrentTimeAsEST, timeTilNextDay } from "@/utils/dateutils";
import { Component, createSignal } from "solid-js";
import { usePersistedData } from "@/stores/wotdlePersistedDataStore";
import * as m from "@/paraglide/messages.js";
import { Vehicle } from "@/types/api.types";
import { languageTag } from "@/i18n";
import { i18nApiMap } from "@/utils/WargamingApi";

type Props = {
  tank: Vehicle;
};

const TankOfDayPanel: Component<Props> = ({ tank }) => {
  const [timeTilNext, setTimeTilNext] = createSignal(timeTilNextDay());
  const [today] = createSignal(CurrentTimeAsEST().getUTCDay());
  const [data] = usePersistedData();
  const lang = i18nApiMap[languageTag()];

  setInterval(() => {
    if (today() !== CurrentTimeAsEST().getUTCDay()) {
      window.location.reload();
    }
    setTimeTilNext(timeTilNextDay());
  }, 1000);

  return (
    <div class="rounded relative flex flex-col items-center  select-none p-4 border border-neutral-700 w-full h-[225px] max-w-[1008px] bg-center-top bg-[url(/victory.webp)]">
      <div
        class="absolute left-4 flex flex-col h-full items-center justify-center pb-8"
        style={{ "text-shadow": "1px 1px 2px black" }}
      >
        <span class="sm:text-2xl">{m.victory_nextTank()}</span>
        <span class="sm:text-3xl font-bold">{timeTilNext()}</span>
      </div>
      <div
        class=" sm:h-full absolute items-center justify-center bottom-0 sm:right-4 sm:bottom-auto sm:flex sm:flex-col"
        style={{ "text-shadow": "1px 1px 2px black" }}
      >
        <span class="sm:text-2xl">{m.victory_num_tries()}</span>
        <span class="sm:text-3xl font-bold text-yellow-500">
          {data.dailyVehicleGuesses.length}
        </span>
      </div>
      <span
        class="text-5xl font-bold drop-shadow-2xl tracking-wide"
        style={{ "text-shadow": "1px 1px 2px black" }}
      >
        {m.victory()}
      </span>
      <div class="flex w-full h-full justify-center">
        <div class="relative">
          <img
            src={tank.images.big_icon}
            fetchpriority={"high"}
            class="h-full"
          />
          <span class="absolute right-5 bottom-5 text-2xl">
            {tank.i18n[lang].name}
          </span>
        </div>
      </div>
    </div>
  );
};
export default TankOfDayPanel;
