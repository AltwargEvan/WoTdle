import { type Component, Suspense, JSXElement } from "solid-js";
// import { AppStateLoader } from "./components/AppStateLoader";
// import GuessForm from "./components/GuessForm";
import AppStore from "./components/AppStore";
// import GuessList from "./components/GuessList";
import "./app.css";
import { FileRoutes } from "@solidjs/start";
import { RouteSectionProps, Router } from "@solidjs/router";
import Nav from "./components/Nav";
import { AppStateLoader } from "./components/AppStateLoader";

const Root: Component<RouteSectionProps<unknown>> = (props) => {
  return (
    <div class="font-roboto h-screen w-screen bg-neutral-800 overflow-y-auto flex items-center pt-8 overflow-x-hidden flex-col text-white gap-4">
      <Nav />
      <Suspense>{props.children}</Suspense>
    </div>
  );
};
const App = () => {
  return (
    <Router root={Root}>
      <FileRoutes />
    </Router>
  );
};

export default App;
