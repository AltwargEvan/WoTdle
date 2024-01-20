import GuessForm from "@/components/GuessForm";
import GuessList from "@/components/GuessList";

export default function Home() {
  return (
    <main class="grid justify-center gap-4">
      <div class="p-4 md:p-8 rounded border-neutral-600 border-2">
        <span class=" text-xl md:text-4xl">
          Guess today's World of Tanks vehicle!
        </span>
      </div>
      <div class="flex justify-center">
        <GuessForm />
      </div>
      <div class="flex justify-center">
        <GuessList />
      </div>
    </main>
  );
}
