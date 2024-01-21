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
        <div class=" p-4 rounded border-neutral-600 border-2 w-full md:w-max flex">
          <span class=" text-xl md:text-4xl">
            Guess today's World of Tanks vehicle!
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
