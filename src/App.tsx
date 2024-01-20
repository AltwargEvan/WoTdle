import type { Component } from "solid-js";

const App: Component = () => {
  return (
    <div class="font-roboto h-screen w-screen bg-neutral-800 overflow-y-auto flex justify-center pt-8">
      <div class="flex items-center h-16 gap-4">
        <h1 class="text-white  text-6xl">WoTdle</h1>
      </div>
    </div>
  );
};

export default App;
