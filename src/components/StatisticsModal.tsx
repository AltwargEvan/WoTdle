import { usePersistedData } from "@/stores/wotdlePersistedDataStore";
import { CurrentTimeAsEST, datesAreConsecutive } from "@/utils/dateutils";
import { clientOnly } from "@solidjs/start";
import { Accessor, Component, Show } from "solid-js";
import { Transition } from "solid-transition-group";

const Graph = clientOnly(() => import("./StatGraph"));

const Statistics: Component<{
  hide: VoidFunction;
  visible: Accessor<boolean>;
}> = ({ hide, visible }) => {
  const [wotdlePersistedData] = usePersistedData();

  const averageGuesses = () =>
    wotdlePersistedData.previousGames.length !== 0
      ? wotdlePersistedData.previousGames.reduce(
          (acc, game) => (acc += game.guessCount),
          0
        ) / wotdlePersistedData.previousGames.length
      : 0;

  const data = () =>
    wotdlePersistedData.previousGames.map(
      (game) => [game.date, game.guessCount] as [number, number]
    );

  const maxStreak = () => {
    if (wotdlePersistedData.previousGames.length === 0) return 0;
    let max = 1;
    let current = 1;
    for (let i = 0; i < wotdlePersistedData.previousGames.length - 1; i++) {
      if (
        datesAreConsecutive(
          wotdlePersistedData.previousGames[i].date,
          wotdlePersistedData.previousGames[i + 1].date
        )
      ) {
        current++;
        if (current > max) max = current;
      } else {
        if (current > max) max = current;
        current = 1;
      }
    }

    return max;
  };

  const currentStreak = () => {
    if (wotdlePersistedData.previousGames.length === 0) return 0;

    let streak = 1;
    let i = wotdlePersistedData.previousGames.length - 1;

    while (
      i >= 1 &&
      datesAreConsecutive(
        wotdlePersistedData.previousGames[i - 1].date,
        wotdlePersistedData.previousGames[i].date
      )
    ) {
      streak++;
      i--;
    }
    return streak;
  };

  return (
    <Transition
      onEnter={(el, done) => {
        const a = el.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: 100,
        });
        a.finished.then(done);
      }}
      onExit={(el, done) => {
        const a = el.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: 100,
        });
        a.finished.then(done);
      }}
    >
      <Show when={visible()}>
        <div
          class="relative z-[100]"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div class="bg-neutral-950 fixed inset-0  transition-opacity"></div>
          <div class="fixed inset-0  w-screen overflow-y-auto">
            <div class="flex min-h-full justify-center text-center items-start pt-[10rem] w-full">
              <div class="pt-8 p-2 w-full h-full  md:h-auto md:w-[800px]  relative transform overflow-hidden rounded shadow-xl transition-all">
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
                <h2 class="text-2xl pb-4">Statistics</h2>
                <div class="grid grid-cols-4">
                  <h4>Games Won</h4>
                  <h4>Average Guesses</h4>
                  <h4>Current Streak</h4>
                  <h4>Max Streak</h4>
                  <span class="text-3xl">
                    {wotdlePersistedData.previousGames.length}
                  </span>
                  <span class="text-3xl">{averageGuesses()}</span>
                  <span class="text-3xl">{currentStreak()}</span>
                  <span class="text-3xl">{maxStreak()}</span>
                </div>
                <Graph data={data()} />
              </div>
            </div>
          </div>
        </div>
      </Show>
    </Transition>
  );
};
export default Statistics;
