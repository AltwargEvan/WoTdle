import { usePersistedData } from "@/stores/wotdlePersistedDataStore";
import { clientOnly } from "@solidjs/start";
import { Component } from "solid-js";

const Graph = clientOnly(() => import("./StatGraph"));

const Statistics: Component<{ hide: VoidFunction }> = ({ hide }) => {
  const [wotdlePersistedData] = usePersistedData();

  const currentStreak = wotdlePersistedData.currentStreak;
  const maxStreak = wotdlePersistedData.maxStreak;

  const averageGuesses =
    wotdlePersistedData.previousGames.length !== 0
      ? wotdlePersistedData.previousGames.reduce(
          (acc, game) => (acc += game.guessCount),
          0
        ) / wotdlePersistedData.previousGames.length
      : 0;

  const data = wotdlePersistedData.previousGames.map(
    (game) => [game.date, game.guessCount] as [number, number]
  );

  return (
    <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
      <div class="flex min-h-full justify-center text-center items-start pt-[5.5rem] w-full">
        <div class="p-2 w-full h-full  md:h-auto md:w-[800px] bg-neutral-950 border border-neutral-600 relative transform overflow-hidden rounded shadow-xl transition-all">
          <button onClick={hide} class="absolute top-2 right-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
          <h2 class="text-2xl">Statistics</h2>
          <div class="grid grid-cols-4">
            <h4>Games Won</h4>
            <h4>Average Guesses</h4>
            <h4>Current Streak</h4>
            <h4>Max Streak</h4>
            <span class="text-3xl">
              {wotdlePersistedData.previousGames.length}
            </span>
            <span class="text-3xl">{averageGuesses}</span>
            <span class="text-3xl">{currentStreak}</span>
            <span class="text-3xl">{maxStreak}</span>
          </div>
          <Graph data={data} />
        </div>
      </div>
    </div>
  );
};
export default Statistics;
