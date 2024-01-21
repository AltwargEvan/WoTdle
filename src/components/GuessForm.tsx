import { BiSolidRightArrow } from "solid-icons/bi";
import { Component, For, Show, createSignal } from "solid-js";
import AppStore from "./AppStore";
import Fuse, { FuseResult } from "fuse.js";
import { Tank, tankImg } from "../utils/api";

type InputEvent = globalThis.InputEvent & {
  currentTarget: HTMLInputElement;
  target: HTMLInputElement;
};

const GuessForm: Component = () => {
  const [guess, setGuess] = createSignal("");
  const [searchResults, setSearchResults] = createSignal(
    null as FuseResult<Tank>[] | null
  );

  const { appState, guessTank } = AppStore;

  const handleChangeInput = (e: InputEvent) => {
    e.preventDefault();
    setGuess(e.target.value);
    if (e.target.value.length === 0) return setSearchResults(null);
    const fuse = new Fuse([...appState.notGuessedTanks.values()], {
      keys: ["short_name", "name", "search_Name", "search_short_name"],
      threshold: 0.1,
      isCaseSensitive: false,
    });
    const result = fuse.search(e.target.value);
    setSearchResults(result);
  };

  const handleFormSubmit = (e: Event) => {
    e.preventDefault();
    const tank = searchResults()?.at(0)?.item;
    if (tank !== undefined) handleGuessTank(tank);
  };

  const handleGuessTank = (tank: Tank) => {
    guessTank(tank);
    setGuess("");
    setSearchResults(null);
  };

  return (
    <div class="w-full md:w-96 relative">
      <form class="flex pb-1" onSubmit={handleFormSubmit}>
        <input
          id="tank"
          type="text"
          class="flex  h-16 w-full border-neutral-600 rounded-l border-2 border-input bg-transparent px-4 py-1  placeholder:text-muted-foreground focus-visible:outline-none text-xl"
          placeholder="Type vehicle name..."
          onInput={handleChangeInput}
          value={guess()}
        />
        <button class="border-neutral-600 border-t-2 border-r-2 border-b-2 rounded-tr px-3 hover:bg-stone-800">
          <BiSolidRightArrow size={48} />
        </button>
      </form>
      <Show when={searchResults()?.length === 0}>
        <div class="absolute z-50 bg-neutral-800 border border-neutral-600  h-10 flex justify-center items-center text-lg">
          <span>No Vehicle Found.</span>
        </div>
      </Show>
      <Show when={searchResults()?.length}>
        <div class="absolute z-50 bg-neutral-800 border border-neutral-600 text-lg  overflow-y-auto max-h-64 rounded  w-full">
          <For each={searchResults()}>
            {({ item: tank }) => (
              <div
                class="w-full   hover:bg-neutral-700 hover:cursor-pointer flex items-center gap-4"
                onClick={() => handleGuessTank(tank)}
              >
                <img
                  src={tankImg(tank)}
                  class="h-14"
                  elementtiming={""}
                  fetchpriority={"high"}
                />
                <span> {tank.name}</span>
              </div>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
};
export default GuessForm;
