import { type Component } from "solid-js";
import { Header } from "./components/Header";
import { AppStateLoader } from "./components/AppStateLoader";

const App: Component = () => {
  return (
    <AppStateLoader>
      <div class="font-roboto h-screen w-screen bg-neutral-800 overflow-y-auto flex items-center pt-8 overflow-x-hidden flex-col">
        <Header />
      </div>
    </AppStateLoader>
  );
};

export default App;
