import { Vehicle } from "@/types/tankopedia.types";

import { createRoot } from "solid-js";
import { createStore } from "solid-js/store";
import { TodaysWotdleData } from "@/resources/todaysWotdleResource";
import { CurrentTimeAsEST, datesAreInSameDay } from "@/utils/dateutils";
import { usePersistedData } from "./wotdlePersistedDataStore";

type GameStateStore =
  | {
      todaysVehicle: Vehicle;
      dateMsSinceEpoch: number;
      victory: boolean;
      tankListNotGuessed: Vehicle[];
      hydrated: true;
    }
  | {
      hydrated: false;
      todaysVehicle: undefined;
      dateMsSinceEpoch: undefined;
      victory: undefined;
      tankListNotGuessed: undefined;
    };

function createWotdleSessionStateStore() {
  const [gameState, setGameState] = createStore<GameStateStore>({
    hydrated: false,
    todaysVehicle: undefined,
    dateMsSinceEpoch: undefined,
    victory: undefined,
    tankListNotGuessed: undefined,
  });

  const hydrate = (data: TodaysWotdleData["data"]) => {
    if (!data) return;
    const [persistedData] = usePersistedData();
    const previousGames = persistedData.previousGames;
    const dailyVehicleGuesses = persistedData.dailyVehicleGuesses;

    const guessedTankIds = new Set<number>();
    dailyVehicleGuesses.forEach((tank) => guessedTankIds.add(tank.tank_id));
    const tankListNotGuessed = data.vehicleList.filter(
      (tank) => !guessedTankIds.has(tank.tank_id)
    );

    const nowEst = CurrentTimeAsEST();
    const lastPlayedGame = previousGames[previousGames.length - 1];

    const alreadyPlayedToday =
      previousGames.length > 0 &&
      datesAreInSameDay(lastPlayedGame.date, nowEst.getTime());

    setGameState("todaysVehicle", data.tankOfDay);
    setGameState("dateMsSinceEpoch", CurrentTimeAsEST().getTime());
    setGameState("victory", alreadyPlayedToday);
    setGameState("tankListNotGuessed", tankListNotGuessed);
    setGameState("hydrated", true);
  };

  return { gameState, hydrate, setGameState };
}

export default createRoot(createWotdleSessionStateStore);
