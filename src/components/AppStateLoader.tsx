import { Component, JSXElement, Show, createEffect, onMount } from "solid-js";
import AppStore from "./AppStore";
import { getAppData, getTankData } from "../utils/api";
import { createAsync } from "@solidjs/router";

export const route = {
  load: () => getAppData(),
};
export const AppStateLoader: Component<{
  children: JSXElement;
}> = (props) => {
  const appData = createAsync(getAppData);
  const { setAppState } = AppStore;

  createEffect(async () => {
    const data = appData();
    if (!data) return;
    const { tankList, tankOfDay } = data;
    setAppState("notGuessedTanks", tankList);
    setAppState("tankOfDay", tankOfDay);
    setAppState("hydrated", true);

    const tankOfDayData = await getTankData(tankOfDay);
    setAppState("tankOfDayData", tankOfDayData);
  });

  return (
    <Show
      when={appData() !== undefined}
      fallback={<div class="text-xl">Loading... Please wait</div>}
    >
      {props.children}
    </Show>
  );
};
