import { createRoot } from "solid-js";
import { createStore } from "solid-js/store";
import { Tank } from "../utils/api";

function createAppState() {
  const [appState, setAppState] = createStore({
    tankList: [] as Tank[],
    tankGuesses: [] as Tank[],
    tankOfDay: null as Tank | null,
  });
  return { appState, setAppState };
}

export default createRoot(createAppState);
