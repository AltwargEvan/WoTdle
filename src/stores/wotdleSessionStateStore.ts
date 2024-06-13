import { createRoot } from "solid-js";
import { createStore } from "solid-js/store";
import { TodaysWotdleData } from "@/resources/todaysWotdleResource";
import { CurrentTimeAsEST, datesAreInSameDay } from "@/utils/dateutils";
import { LATEST_VERSION, usePersistedData } from "./wotdlePersistedDataStore";
import { Vehicle } from "@/types/api.types";

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
    if (!data || gameState.hydrated) return;
    const [persistedData, setters] = usePersistedData();
    const previousGames = persistedData.previousGames;

    const nowEst = CurrentTimeAsEST();
    const lastPlayedGame = previousGames[previousGames.length - 1];

    let tankListNotGuessed = data.vehicleList;
    const userWonToday =
      previousGames.length > 0 &&
      datesAreInSameDay(lastPlayedGame.date, nowEst.getTime());

    const userPlayedToday = datesAreInSameDay(
      persistedData.lastGuessEpochMs,
      nowEst.getTime()
    );

    if (persistedData.version !== LATEST_VERSION) {
      setters.setState("dailyVehicleGuesses", []);
      setters.setState("version", LATEST_VERSION);
    } else if (userWonToday || userPlayedToday) {
      const dailyVehicleGuesses = persistedData.dailyVehicleGuesses;
      const guessedTankIds = new Set<number>();
      dailyVehicleGuesses.forEach((tank) => guessedTankIds.add(tank.tank_id));
      tankListNotGuessed = data.vehicleList.filter(
        (tank) => !guessedTankIds.has(tank.tank_id)
      );
    } else {
      setters.setState("dailyVehicleGuesses", []);
    }

    setGameState("todaysVehicle", data.tankOfDay);
    setGameState("dateMsSinceEpoch", CurrentTimeAsEST().getTime());
    setGameState("victory", userWonToday);
    setGameState("tankListNotGuessed", tankListNotGuessed);
    setGameState("hydrated", true);
  };

  return { gameState, hydrate, setGameState };
}

export default createRoot(createWotdleSessionStateStore);
