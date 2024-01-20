import GuessForm from "@/components/GuessForm";
import GuessList from "@/components/GuessList";
import { A } from "@solidjs/router";

export default function Home() {
  return (
    <main>
      <div class="p-4 md:p-8 rounded border-neutral-600 border-2">
        <span class=" text-xl md:text-4xl">
          Guess today's World of Tanks vehicle!
        </span>
      </div>
      {/* <GuessForm /> */}
      {/* <GuessList /> */}
    </main>
  );
}
