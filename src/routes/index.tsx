import { AppStateLoader } from "@/components/AppStateLoader";
import AppStore from "@/components/AppStore";
import GuessForm from "@/components/GuessForm";
import GuessList from "@/components/GuessList";
import { HintPanel } from "@/components/HintPanel";
import TankOfDayPanel from "@/components/TankOfDayPanel";
import { Show } from "solid-js";

export default function Home() {
  const { appState } = AppStore;
  return (
    <main class="flex flex-col p-2 items-center w-full gap-2">
      <div class="w-full sm:w-[450px] px-4 grid items-center bg-neutral-900 rounded border-neutral-600 border p-4 ">
        <span class="text-xl text-center">
          Guess today's World of Tanks vehicle!
        </span>
        <Show
          when={appState.guessedTanks.length > 0}
          fallback={
            <span class="text-center pt-2 font-thin text-neutral-200">
              Type any vehicle tier 8 - 10 to begin
            </span>
          }
        >
          <HintPanel />
        </Show>
      </div>

      <AppStateLoader>
        <Show
          when={!appState.victory}
          fallback={
            <div class="flex justify-center items-center w-screen p-4">
              <TankOfDayPanel tank={appState.tankOfDay!} />
            </div>
          }
        >
          <GuessForm />
        </Show>
        <div class="flex justify-center p-4">
          <GuessList />
        </div>
      </AppStateLoader>
    </main>
  );
}
