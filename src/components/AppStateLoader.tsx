import { Component, JSXElement, Match, Switch, createEffect } from "solid-js";
import AppStore from "./AppStore";
import { createAsync } from "@solidjs/router";
import { getAppState } from "@/resources/appStateResource";

export const route = {
  load: () => getAppState(),
};

export const AppStateLoader: Component<{
  children: JSXElement;
}> = (props) => {
  const appData = createAsync(getAppState);
  const { setAppState } = AppStore;

  createEffect(async () => {
    const res = appData();
    if (res === undefined) return;
    if (res.data) {
      const { vehicleList, tankOfDay } = res?.data;
      setAppState("notGuessedTanks", vehicleList);
      setAppState("tankOfDay", tankOfDay);
      setAppState("hydrated", true);
    } else {
      console.error(res.error);
    }
  });

  return (
    <Switch
      fallback={
        <div class="text-xl text-center p-4">Loading... Please wait</div>
      }
    >
      <Match when={appData()?.data}>{props.children}</Match>
      <Match when={appData()?.error}>
        <div class="text-xl text-center p-4">
          Failed to load. Try reloading the page
        </div>
      </Match>
    </Switch>
  );
};
