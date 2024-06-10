import { SetStoreFunction, createStore } from "solid-js/store";
import { makePersisted } from "@solid-primitives/storage";
import { JSXElement, createContext, onMount, useContext } from "solid-js";
import wotdleSessionStateStore from "./wotdleSessionStateStore";
import { CurrentTimeAsEST } from "@/utils/dateutils";
import { Vehicle } from "@/types/api.types";

export type GameData = {
  guessCount: number;
  date: number; // iso timestamp ms
  tankId: number;
};

type WotdlePersistedDataStore = {
  dailyVehicleGuesses: Vehicle[];
  previousGames: GameData[];
  lastGuessEpochMs: number;
};

type ContextType = [
  WotdlePersistedDataStore,
  {
    setState: SetStoreFunction<WotdlePersistedDataStore>;
    guessVehicle: (vehicle: Vehicle) => void;
  }
];
const WotdlePersistedDataContext = createContext<ContextType>();

export function WotdlePersistedDataStoreProvider(props: {
  children: JSXElement;
}) {
  const store = createStore<WotdlePersistedDataStore>({
    dailyVehicleGuesses: [],
    previousGames: [],
    lastGuessEpochMs: 0,
  });

  let [state, setState] = store;
  onMount(() => {
    [state, setState] = makePersisted(store, {
      storage: localStorage,
      storageOptions: {},
      name: "wotdle-store",
    });
  });

  const guessVehicle = (tank: Vehicle) => {
    const { gameState, setGameState } = wotdleSessionStateStore;
    if (!gameState.hydrated) return;
    setState("lastGuessEpochMs", CurrentTimeAsEST().getTime());
    setState("dailyVehicleGuesses", (prev) => [tank, ...prev]);
    setGameState(
      "tankListNotGuessed",
      gameState.tankListNotGuessed?.filter((v) => v.tank_id !== tank.tank_id)
    );
    if (tank.tank_id !== gameState.todaysVehicle.tank_id) return;

    setGameState("victory", true);

    const zerodDate = new Date(gameState.dateMsSinceEpoch);
    zerodDate.setUTCHours(0, 0, 0, 0);

    const todaysGameData: GameData = {
      guessCount: state.dailyVehicleGuesses.length,
      date: zerodDate.getTime(),
      tankId: gameState.todaysVehicle.tank_id,
    };
    setState("previousGames", (prev) => [...prev, todaysGameData]);
  };

  const storage: ContextType = [
    state,
    {
      setState,
      guessVehicle,
    },
  ];

  return (
    <WotdlePersistedDataContext.Provider value={storage}>
      {props.children}
    </WotdlePersistedDataContext.Provider>
  );
}

export function usePersistedData() {
  const ctx = useContext(WotdlePersistedDataContext);
  if (!ctx) {
    throw new Error(
      "usePersistedData: cannot find WotdlePersistedDataContext context"
    );
  }
  return ctx;
}
