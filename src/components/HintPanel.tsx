import {
  Component,
  Match,
  Show,
  Switch,
  createMemo,
  createSignal,
} from "solid-js";
import { twMerge } from "tailwind-merge";
import AppStore from "../stores/wotdleSessionStateStore";
import { usePersistedData } from "@/stores/wotdlePersistedDataStore";
import * as m from "@/paraglide/messages.js";
import { splitInto2Lines } from "@/utils/splitInto2Lines";

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
      "relative flex  items-center flex-col group select-none",
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

  const text = createMemo(() => {
    const data = splitInto2Lines(props.text, 18);
    if (data.length === 1) return <span>{data.at(0)}</span>;
    else
      return (
        <>
          <span class="-my-2 pt-2">{data.at(0)}</span>
          <span>{data.at(1)}</span>
        </>
      );
  });
  return (
    <div class={containerClass()} onClick={handleClick}>
      <img
        src={props.src}
        class={imageClass()}
        style={{ filter: imageFilter() }}
      />
      <div class="flex flex-col items-center text-center">
        {text()}
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
      <div class="pt-3 text-neutral-300 justify-around grid grid-cols-3">
        <HintButton
          src="/engine.png"
          text={m.hint_top_speed()}
          triesToEnable={3}
          onClick={handleClickHint("Speed")}
        />
        <HintButton
          src="/premium.png"
          text={m.hint_store_type()}
          triesToEnable={5}
          onClick={handleClickHint("Premium")}
        />
        <HintButton
          src="/tanksilhouette.png"
          text={m.hint_tank_icon()}
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
