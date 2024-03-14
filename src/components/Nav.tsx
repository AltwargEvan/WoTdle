import { Component, Show, createSignal } from "solid-js";
import Statistics from "./StatisticsModal";

export const Nav: Component = () => {
  const [showStats, setShowStats] = createSignal(false);

  return (
    <>
      <div class="sticky z-50 top-0 flex min-h-20 items-center select-none bg-neutral-900 w-full justify-between border-b border-neutral-600">
        <div class="w-full" />
        <div class="flex gap-4 justify-center items-center w-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1104.586 1511.305"
            class="h-9"
          >
            <g fill="white">
              <path d="M980.83 320.625L880.432 218.694 772.637 112.111H331.949L226.946 218.694 126.548 320.625h321.275v920.68l105.875 104.697 105.855-104.697v-920.68h.02z" />
              <path d="M876.758 420.251H775.692v410.793L670.098 935.38l74.357 72.191 75.098 72.943 161.602-159.801.037-500.462zM331.726 831.044V420.251H126.201v500.462l161.664 159.801 75.099-72.943 74.312-72.191z" />
              <path d="M316.11 55.984L56.036 315.941V946.07l496.271 487.021 496.251-487.021V315.96L788.496 55.984H316.11zM8.304 284.584L284.914 8.24 293.096 0h518.379l8.18 8.24 276.629 276.344 8.303 8.316v676.439l-8.406 8.229-524.299 514.538-19.574 19.197-19.6-19.197L8.429 977.571 0 969.341V292.905l8.304-8.321z" />
            </g>
          </svg>
          <h1 class="text-white  text-4xl tracking-tighter font-bold">
            WoTdle
          </h1>
        </div>
        <div class="w-full flex justify-end items-center">
          <button class="pr-6" onClick={() => setShowStats(true)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="hover:stroke-white stroke-neutral-200"
            >
              <line x1="18" x2="18" y1="20" y2="10" />
              <line x1="12" x2="12" y1="20" y2="4" />
              <line x1="6" x2="6" y1="20" y2="14" />
            </svg>
          </button>
        </div>
      </div>
      <Statistics hide={() => setShowStats(false)} visible={showStats} />
    </>
  );
};

export default Nav;
