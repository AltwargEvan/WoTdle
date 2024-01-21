import { createRoot } from "solid-js";
import { createStore } from "solid-js/store";
import { Tank, TankData } from "../utils/api";

function createAppState() {
  const [appState, setAppState] = createStore({
    guessedTanks: [] as Tank[],
    notGuessedTanks: [] as Tank[],
    tankOfDay: null as Tank | null,
    hydrated: false,
    numGuesses: () => appState.guessedTanks.length,
    victory: false,
  });

  const guessTank = (tank: Tank) => {
    setAppState("guessedTanks", (prev) => [tank, ...prev]);
    setAppState("notGuessedTanks", (prev) =>
      prev.filter((x) => x.id !== tank.id)
    );
    if (tank.id === appState.tankOfDay?.id) setAppState("victory", true);
  };

  return { appState, setAppState, guessTank };
}

export default createRoot(createAppState);
