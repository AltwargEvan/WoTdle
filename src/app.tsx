import { Suspense } from "solid-js";
import { FileRoutes } from "@solidjs/start/router";
import { Router } from "@solidjs/router";
import Nav from "./components/Nav";
import "./app.css";
import { WotdlePersistedDataStoreProvider } from "./stores/wotdlePersistedDataStore";

const App = () => {
  return (
    <WotdlePersistedDataStoreProvider>
      <Router
        root={(props) => (
          <div
            class="font-roboto h-screen w-screen bg-neutral-800 overflow-y-auto flex items-center  overflow-x-hidden flex-col text-white"
            style={{
              background: `url(background.jpg)`,
              "background-position": "center",
              "background-repeat": "repeat-y",
              "background-size": "cover",
            }}
          >
            <Nav />

            <Suspense>{props.children}</Suspense>
          </div>
        )}
      >
        <FileRoutes />
      </Router>
    </WotdlePersistedDataStoreProvider>
  );
};

export default App;
