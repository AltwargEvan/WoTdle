import { Component, Match, Show, Switch, createSignal } from "solid-js";
import { twMerge } from "tailwind-merge";
import AppStore from "../stores/wotdleSessionStateStore";
import { usePersistedData } from "@/stores/wotdlePersistedDataStore";
import * as m from "@/paraglide/messages.js";

type Hint = "Speed" | "Premium" | "Icon" | undefined;
type HintButtonProps = {
  src: string;
  text: string;
  triesToEnable: number;
  onClick: () => void;
};

const HintButton: Component<HintButtonProps> = (props) => {
  const [data] = usePersistedData();

  const triesRemaining = () =>
    props.triesToEnable - data.dailyVehicleGuesses.length;
  const enabled = () => data.dailyVehicleGuesses.length >= props.triesToEnable;
  const containerClass = () =>
    twMerge(
      "relative flex  items-center flex-col group select-none h-24",
      enabled() ? "hover:cursor-pointer" : ""
    );
  const imageClass = () =>
    twMerge(
      "h-[3.25rem]",
      enabled()
        ? "group-hover:h-14 transition-[height]"
        : "grayscale opacity-50"
    );

  const imageFilter = () =>
    enabled() ? "drop-shadow(0 0 0.5rem #fbbf24) " : undefined;

  const handleClick = () => {
    if (enabled()) props.onClick();
  };

  return (
    <div class={containerClass()} onClick={handleClick}>
      <img
        src={props.src}
        class={imageClass()}
        style={{ filter: imageFilter() }}
      />
      <div class="flex flex-col items-center">
        <span>{props.text}</span>
        <Show when={triesRemaining() > 0}>
          <span class="text-xs text-thin">
            {m.hint_tries_remaining({ tries: triesRemaining() })}
          </span>
        </Show>
      </div>
    </div>
  );
};

export const HintPanel: Component = () => {
  const todaysVehicle = AppStore.gameState.todaysVehicle;

  const [hint, setHint] = createSignal<Hint>();
  const handleClickHint = (newHint: Hint) => () => {
    if (hint() === newHint) setHint(undefined);
    else setHint(newHint);
  };

  if (!todaysVehicle) return;
  return (
    <>
      <div class="pt-2 text-neutral-300 justify-around grid grid-cols-3">
        <HintButton
          src="/engine.png"
          text="Top Speed Clue"
          triesToEnable={3}
          onClick={handleClickHint("Speed")}
        />
        <HintButton
          src="/premium.png"
          text="Store Type Clue"
          triesToEnable={5}
          onClick={handleClickHint("Premium")}
        />
        <HintButton
          src="/tanksilhouette.png"
          text="Tank Icon Clue"
          triesToEnable={7}
          onClick={handleClickHint("Icon")}
        />
      </div>
      <Show when={hint() !== undefined}>
        <div class="flex justify-center text-3xl pt-3 pb-2">
          <div class="py-2 px-4 rounded border border-neutral-600 h-14 flex items-center justify-center">
            <Switch>
              <Match when={hint() === "Speed"}>
                {todaysVehicle.speed_forward} {m.hint_speed()}
              </Match>
              <Match when={hint() === "Premium"}>
                <Switch>
                  <Match when={todaysVehicle.is_gift}>
                    {m.tank_type_reward()}
                  </Match>
                  <Match when={todaysVehicle.is_premium}>
                    {" "}
                    {m.tank_type_premium()}
                  </Match>
                  <Match when={!todaysVehicle.is_premium}>
                    {" "}
                    {m.tank_type_techtree()}
                  </Match>
                </Switch>
              </Match>
              <Match when={hint() === "Icon"}>
                <img src={todaysVehicle.images.contour_icon} />
              </Match>
            </Switch>
          </div>
        </div>
      </Show>
    </>
  );
};
