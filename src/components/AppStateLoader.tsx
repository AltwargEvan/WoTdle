import { Component, JSXElement, Show, createEffect, onMount } from "solid-js";
import { seededRandom } from "../utils/seededRandom";
import { todayAsInt } from "../utils/todayAsInt";
import AppStore from "./AppStore";
import { getTankList } from "../utils/api";
import { createAsync } from "@solidjs/router";

export const route = {
  load: () => getTankList(),
};
export const AppStateLoader: Component<{
  children: JSXElement;
}> = (props) => {
  const tankList = createAsync(getTankList);
  const { setAppState } = AppStore;
  createEffect(() => {
    const tanks = tankList();
    if (tanks === undefined) return;
    setAppState("notGuessedTanks", tanks);
    const index = Math.floor(seededRandom(todayAsInt()) * tankList.length);
    const tankOfDay = tanks[index];
    console.log(tankOfDay);
    setAppState("tankOfDay", tankOfDay);
    setAppState("hydrated", true);
  });

  return (
    <Show
      when={tankList() !== undefined}
      fallback={<div class="text-xl">Loading... Please wait</div>}
    >
      {props.children}
    </Show>
  );
};
