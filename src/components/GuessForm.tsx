import { Component, For, Show, createMemo, createSignal } from "solid-js";
import AppStore from "../stores/wotdleSessionStateStore";
import Fuse, { FuseResult } from "fuse.js";
// load directive. this is required for some reason??
import clickOutside from "@/utils/clickOutside";
import { usePersistedData } from "@/stores/wotdlePersistedDataStore";
import * as m from "@/paraglide/messages.js";
import { Vehicle } from "@/types/api.types";
import { i18nApiMap } from "@/utils/WargamingApi";
import { languageTag } from "@/i18n";
import * as diacritics from "diacritics";

clickOutside;

type InputEvent = globalThis.InputEvent & {
  currentTarget: HTMLInputElement;
  target: HTMLInputElement;
};

const GuessForm: Component = () => {
  const [guess, setGuess] = createSignal("");
  const [showSearch, setShowSearch] = createSignal(false);
  const [searchResults, setSearchResults] = createSignal(
    null as FuseResult<Vehicle>[] | null
  );
  const lang = i18nApiMap[languageTag()];

  const { gameState } = AppStore;
  const [_, persistedMutators] = usePersistedData();
  const fuse = createMemo(() => {
    if (!gameState.hydrated) return;
    const fuse = new Fuse([...gameState.tankListNotGuessed.values()], {
      keys: [
        "short_name",
        "name",
        "search_name",
        "search_short_name",
        "no_accent_name",
        `i18n.${lang}.name`,
      ],
      threshold: 0.15,
      isCaseSensitive: false,
    });
    return fuse;
  });
  if (!gameState.hydrated) return;

  const handleChangeInput = (e: InputEvent) => {
    e.preventDefault();
    setGuess(e.target.value);
    if (e.target.value.length === 0) return setSearchResults(null);

    const result = fuse()!.search(e.target.value);
    setSearchResults(result);
  };

  const handleFormSubmit = (e: Event) => {
    e.preventDefault();
    const tank = searchResults()?.at(0)?.item;
    if (tank !== undefined) {
      handleGuessTank(tank);
    }
  };

  const handleGuessTank = (tank: Vehicle) => {
    persistedMutators.guessVehicle(tank);
    setGuess("");
    setSearchResults(null);
    fuse()?.remove((x) => x.tank_id === tank.tank_id);
  };

  return (
    <div class="w-full sm:w-96 relative" onClick={() => setShowSearch(true)}>
      <form class="flex pb-1 " onSubmit={handleFormSubmit}>
        <input
          id="tank"
          type="text"
          class="flex bg-neutral-900  h-14 w-full border-neutral-600  rounded-l border border-input px-4 py-1  placeholder:text-muted-foreground focus-visible:outline-none text-neutral-200"
          placeholder={m.prompt_placeholder()}
          onInput={handleChangeInput}
          value={guess()}
        />
        <button class="bg-neutral-900 border-neutral-600 border-t border-r border-b rounded-r px-3 hover:bg-neutral-950">
          <svg
            fill="currentColor"
            stroke-width="0"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            height="48"
            width="48"
            style="overflow: visible; color: currentcolor;"
          >
            <path d="M5.536 21.886a1.004 1.004 0 0 0 1.033-.064l13-9a1 1 0 0 0 0-1.644l-13-9A1 1 0 0 0 5 3v18a1 1 0 0 0 .536.886z"></path>
          </svg>
        </button>
      </form>
      <Show when={showSearch() && searchResults()?.length === 0}>
        <div class="select-none text-center absolute z-50 bg-neutral-900 border border-neutral-600  py-2 px-4 w-full rounded">
          <span>{m.guess_form_not_found()}</span>
        </div>
      </Show>
      <Show when={showSearch() && searchResults()?.length}>
        <div class="absolute z-50 select-none bg-neutral-900 border border-neutral-600 text-lg  overflow-y-auto max-h-64 rounded  w-full">
          <For each={searchResults()}>
            {({ item: tank }) => (
              <div
                class="w-full   hover:bg-neutral-950 hover:cursor-pointer flex items-center gap-4"
                onClick={() => handleGuessTank(tank)}
              >
                <img
                  src={tank.images.big_icon}
                  class="h-20 pl-2 py-2"
                  fetchpriority={"high"}
                />
                <span> {tank.i18n[lang].name}</span>
              </div>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
};
export default GuessForm;
