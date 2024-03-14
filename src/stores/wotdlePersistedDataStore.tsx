import { SetStoreFunction, createStore } from "solid-js/store";
import { makePersisted } from "@solid-primitives/storage";
import { Vehicle } from "@/types/tankopedia.types";
import {
  JSXElement,
  Setter,
  createContext,
  onMount,
  useContext,
} from "solid-js";
import wotdleSessionStateStore from "./wotdleSessionStateStore";
import { datesAreConsecutive } from "@/utils/dateutils";

export type GameData = {
  guessCount: number;
  date: number; // iso timestamp ms
  tankId: number;
};

type WotdlePersistedDataStore = {
  dailyVehicleGuesses: Vehicle[];
  previousGames: GameData[];
  currentStreak: number;
  maxStreak: number;
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
    currentStreak: 0,
    maxStreak: 0,
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

    setState("dailyVehicleGuesses", (prev) => [tank, ...prev]);
    setGameState(
      "tankListNotGuessed",
      gameState.tankListNotGuessed?.filter((v) => v.tank_id !== tank.tank_id)
    );
    if (tank.tank_id !== gameState.todaysVehicle.tank_id) return;
    setGameState("victory", true);

    let playedYesterday = false;
    if (state.previousGames.length > 0) {
      playedYesterday = datesAreConsecutive(
        state.previousGames[state.previousGames.length - 1].date,
        gameState.dateMsSinceEpoch
      );
    }

    if (playedYesterday) {
      let newStreak = state.currentStreak + 1;
      setState("currentStreak", newStreak);
      setState(
        "maxStreak",
        newStreak > state.maxStreak ? newStreak : state.maxStreak
      );
    } else {
      setState("currentStreak", 1);
      if (state.maxStreak === 0) setState("maxStreak", 1);
    }

    const todaysGameData: GameData = {
      guessCount: state.dailyVehicleGuesses.length,
      date: gameState.dateMsSinceEpoch,
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
