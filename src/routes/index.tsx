import { AppStateLoader } from "@/components/AppStateLoader";
import GuessForm from "@/components/GuessForm";
import GuessList from "@/components/GuessList";
import TankOfDayPanel from "@/components/TankOfDayPanel";

export default function Home() {
  return (
    <main class="grid justify-center">
      <div class="px-4 flex justify-center ">
        <div class=" p-4 rounded border-neutral-600 border-2 w-full md:w-max flex">
          <span class=" text-xl md:text-4xl">
            Guess today's World of Tanks vehicle!
          </span>
        </div>
      </div>

      <AppStateLoader>
        <div class="flex justify-center p-4">
          <GuessForm />
        </div>
        <div class="flex justify-center p-4">
          <GuessList />
        </div>
      </AppStateLoader>
    </main>
  );
}
