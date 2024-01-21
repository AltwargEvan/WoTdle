import { Suspense } from "solid-js";
import { FileRoutes } from "@solidjs/start";
import { Router } from "@solidjs/router";
import Nav from "./components/Nav";
import "./app.css";

const App = () => {
  return (
    <Router
      root={(props) => (
        <div class="font-roboto h-screen w-screen bg-neutral-800 overflow-y-auto flex items-center pt-8 overflow-x-hidden flex-col text-white gap-4">
          <Nav />
          <Suspense>{props.children}</Suspense>
        </div>
      )}
    >
      <FileRoutes />
    </Router>
  );
};

export default App;
