import { createRoot } from "solid-js";
import { createStore } from "solid-js/store";
import { Tank } from "../utils/api";

function createAppState() {
  const [appState, setAppState] = createStore({
    guessedTanks: [] as Tank[],
    notGuessedTanks: [] as Tank[],
    tankOfDay: null as Tank | null,
    hydrated: false,
  });
  return { appState, setAppState };
}

export default createRoot(createAppState);
