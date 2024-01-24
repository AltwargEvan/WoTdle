import { AppStateLoader } from "@/components/AppStateLoader";
import AppStore from "@/components/AppStore";
import GuessForm from "@/components/GuessForm";
import GuessList from "@/components/GuessList";
import TankOfDayPanel from "@/components/TankOfDayPanel";
import { Show } from "solid-js";

export default function Home() {
  const { appState } = AppStore;
  return (
    <main class="grid justify-center">
      <div class="px-4 flex justify-center ">
        <div class=" px-4 py-2 rounded border-neutral-600 border-2 w-full md:w-max flex flex-col">
          <span class=" text-xl md:text-4xl text-center">
            Guess today's World of Tanks vehicle!
          </span>
          <span class="text-center pt-2 font-thin md:text-xl text-neutral-200">
            Type any vehicle tier 8 - 10 to begin
          </span>
        </div>
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
          <div class="flex justify-center p-4">
            <GuessForm />
          </div>
        </Show>
        <div class="flex justify-center p-4">
          <GuessList />
        </div>
      </AppStateLoader>
    </main>
  );
}
