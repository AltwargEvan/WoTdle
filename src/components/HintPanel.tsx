import { Component, Match, Show, Switch, createSignal } from "solid-js";
import { twMerge } from "tailwind-merge";
import AppStore from "./AppStore";

type Hint = "Speed" | "Premium" | "Icon" | undefined;
type HintButtonProps = {
  src: string;
  text: string;
  triesToEnable: number;
  onClick: () => void;
};

const HintButton: Component<HintButtonProps> = (props) => {
  const { appState } = AppStore;

  const enabled = () => appState.numGuesses() >= props.triesToEnable;
  const containerStyle = () =>
    twMerge(
      "relative flex  items-center flex-col h-20 group select-none",
      enabled() ? "hover:cursor-pointer" : ""
    );
  const imageStyle = () =>
    twMerge(
      "h-[3.25rem]",
      enabled()
        ? "group-hover:h-14 transition-[height]"
        : "grayscale opacity-50",
      props.src === "tanksilhouette.png" ? "invert" : ""
    );

  const handleClick = () => {
    if (enabled()) props.onClick();
  };

  return (
    <div class={containerStyle()} onClick={handleClick}>
      <img src={props.src} class={imageStyle()} />
      <span>{props.text}</span>
    </div>
  );
};

export const HintPanel: Component = () => {
  const { appState } = AppStore;

  const [hint, setHint] = createSignal<Hint>();
  const handleClickHint = (newHint: Hint) => () => {
    if (hint() === newHint) setHint(undefined);
    else setHint(newHint);
  };

  return (
    <>
      <div class="pt-2 md:text-large text-neutral-300  justify-around w-full grid grid-cols-3">
        <HintButton
          src="engine.png"
          text="Top Speed Clue"
          triesToEnable={3}
          onClick={handleClickHint("Speed")}
        />
        <HintButton
          src="premium.png"
          text="Store Type Clue"
          triesToEnable={5}
          onClick={handleClickHint("Premium")}
        />
        <HintButton
          src="tanksilhouette.png"
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
                {appState.tankOfDay?.default_profile.speed_forward} km/h
              </Match>
              <Match when={hint() === "Premium"}>
                <Switch>
                  <Match when={appState.tankOfDay?.is_gift}>Reward Tank</Match>
                  <Match when={appState.tankOfDay?.is_premium}>
                    Premium Tank
                  </Match>

                  <Match when={!appState.tankOfDay?.is_premium}>
                    Tech Tree Tank
                  </Match>
                </Switch>
              </Match>
              <Match when={hint() === "Icon"}>
                <img
                  src={appState.tankOfDay?.images.contour_icon}
                  class="h-9"
                />
              </Match>
            </Switch>
          </div>
        </div>
      </Show>
    </>
  );
};
