import { Vehicle } from "@/types/supabase.types";
import { createRoot } from "solid-js";
import { createStore } from "solid-js/store";

function createAppState() {
  const [appState, setAppState] = createStore({
    guessedTanks: [] as Vehicle[],
    notGuessedTanks: [] as Vehicle[],
    tankOfDay: null as Vehicle | null,
    hydrated: false,
    numGuesses: () => appState.guessedTanks.length,
    victory: false,
  });

  const guessTank = (tank: Vehicle) => {
    setAppState("guessedTanks", (prev) => [tank, ...prev]);
    setAppState("notGuessedTanks", (prev) =>
      prev.filter((x) => x.tank_id !== tank.tank_id)
    );
    if (tank.tank_id === appState.tankOfDay?.tank_id)
      setAppState("victory", true);
  };

  return { appState, setAppState, guessTank };
}

export default createRoot(createAppState);
