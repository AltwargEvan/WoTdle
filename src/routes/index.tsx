import GuessForm from "@/components/GuessForm";
import TankOfDayPanel from "@/components/TankOfDayPanel";
import { getTodaysWotdle } from "@/resources/todaysWotdleResource";
import { createAsync } from "@solidjs/router";
import { Match, Show, Switch, createEffect, createSignal } from "solid-js";
import gameStateStore from "@/stores/wotdleSessionStateStore";
import PromptPanel from "@/components/PromptPanel";
import GuessList from "@/components/GuessList";

export const route = {
  load: () => getTodaysWotdle(),
};

export default function Home() {
  const todaysWotdleResource = createAsync(() => getTodaysWotdle());
  const [loadState, setLoadState] = createSignal<"Loading" | "Ready" | "Error">(
    "Loading"
  );
  const { hydrate } = gameStateStore;

  createEffect(() => {
    const res = todaysWotdleResource();
    if (res === undefined) return;
    else if (res.data) {
      setLoadState("Ready");
      hydrate(res.data);
    } else if (res.error) {
      setLoadState("Error");
    }
  }, []);

  return (
    <main class="flex flex-col p-2 items-center w-full gap-2">
      <Switch>
        <Match when={loadState() === "Ready"}>
          <PromptPanel />
          <VictoryPanel />
          <div class="flex justify-center p-4">
            <GuessList />
          </div>
        </Match>
        <Match when={loadState() === "Error"}>
          <div>Failed to load thing here</div>
        </Match>
      </Switch>
    </main>
  );
}

const VictoryPanel = () => {
  if (!gameStateStore.gameState.hydrated) return;
  return (
    <Show
      when={!gameStateStore.gameState.victory}
      fallback={
        <div class="flex justify-center items-center w-screen p-4">
          <TankOfDayPanel tank={gameStateStore.gameState.todaysVehicle} />
        </div>
      }
    >
      <GuessForm />
    </Show>
  );
};
