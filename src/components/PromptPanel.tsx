import { Show } from "solid-js";
import { HintPanel } from "./HintPanel";
import { usePersistedData } from "@/stores/wotdlePersistedDataStore";

const PromptPanel = () => {
  const [data] = usePersistedData();

  return (
    <div class="w-full sm:w-[450px] px-4 grid items-center bg-neutral-900 rounded border-neutral-600 border p-4 ">
      <h3 class="text-xl text-center">Guess today's World of Tanks vehicle!</h3>
      <Show
        when={data.dailyVehicleGuesses.length > 0}
        fallback={
          <span class="text-center pt-2 font-thin text-neutral-200">
            Type any vehicle tier 8 - 10 to begin
          </span>
        }
      >
        <HintPanel />
      </Show>
    </div>
  );
};

export default PromptPanel;
