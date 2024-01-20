import { BiSolidRightArrow } from "solid-icons/bi";
import { Component, For, Match, Show, Switch, createSignal } from "solid-js";
import AppStore from "./AppStore";
import Fuse, { FuseResult } from "fuse.js";
import { Tank, tankImg } from "../utils/api";

type InputEvent = globalThis.InputEvent & {
  currentTarget: HTMLInputElement;
  target: HTMLInputElement;
};

const GuessForm: Component = () => {
  const [searchResults, setSearchResults] = createSignal(
    null as FuseResult<Tank>[] | null
  );

  const { appState } = AppStore;

  const fuse = new Fuse(appState.notGuessedTanks, {
    keys: ["short_name", "name"],
    threshold: 0.5,
    isCaseSensitive: false,
    distance: 1,
  });

  const handleChangeInput = (e: InputEvent) => {
    if (e.target.value.length === 0) return setSearchResults(null);
    const result = fuse.search(e.target.value);
    setSearchResults(result);
  };

  return (
    <div>
      <form class="flex w-[20rem] pb-1">
        <input
          type="text"
          class="flex  h-16 w-full border-neutral-600 rounded-l border border-input bg-transparent px-4 py-1  placeholder:text-muted-foreground focus-visible:outline-none text-xl"
          placeholder="Type vehicle name..."
          onInput={handleChangeInput}
        />
        <button class="border-neutral-600 border-t border-r border-b rounded-tr px-3 hover:bg-stone-800">
          <BiSolidRightArrow size={48} />
        </button>
      </form>
      <Show when={searchResults()?.length === 0}>
        <div class="absolute z-50 bg-neutral-800 border border-neutral-600 w-[20rem] h-10 flex justify-center items-center text-lg">
          <span>No Vehicle Found.</span>
        </div>
      </Show>
      <Show when={searchResults()?.length}>
        <div class="absolute z-50 bg-neutral-800 border border-neutral-600 w-[20rem]  text-lg  overflow-y-auto max-h-64 rounded">
          <For each={searchResults()}>
            {({ item: tank }) => (
              <div class="p-2 hover:bg-neutral-700 hover:cursor-pointer flex items-center gap-4">
                <img src={tankImg(tank)} class="h-14" />
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
