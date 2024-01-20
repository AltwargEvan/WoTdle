import { Show, type Component } from "solid-js";
import { Header } from "./components/Header";
import { AppStateLoader } from "./components/AppStateLoader";
import GuessForm from "./components/GuessForm";
import AppStore from "./components/AppStore";

const App: Component = () => {
  const { appState } = AppStore;
  return (
    <AppStateLoader>
      <div class="font-roboto h-screen w-screen bg-neutral-800 overflow-y-auto flex items-center pt-8 overflow-x-hidden flex-col text-white gap-4">
        <Header />

        <div class="p-4 md:p-8 rounded border-neutral-600 border-2">
          <span class=" text-xl md:text-4xl">
            Guess today's World of Tanks vehicle!
          </span>
        </div>
        <Show
          when={appState.tankList.length > 0}
          fallback={<div>Loading... Please wait</div>}
        >
          <GuessForm />
        </Show>
      </div>
    </AppStateLoader>
  );
};

export default App;
