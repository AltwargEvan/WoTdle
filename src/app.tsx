import { Suspense } from "solid-js";
import { FileRoutes } from "@solidjs/start/router";
import { Router } from "@solidjs/router";
import Nav from "./components/Nav";
import "./app.css";
import { WotdlePersistedDataStoreProvider } from "./stores/wotdlePersistedDataStore";
import {
  LanguageTagProvider,
  sourceLanguageTag,
  useLocationLanguageTag,
} from "./i18n";

const App = () => {
  const url_language_tag = useLocationLanguageTag();
  const language_tag = url_language_tag ?? sourceLanguageTag;

  return (
    <WotdlePersistedDataStoreProvider>
      <Router
        base={url_language_tag}
        root={(props) => (
          <LanguageTagProvider value={language_tag}>
            <main
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
            </main>
          </LanguageTagProvider>
        )}
      >
        <FileRoutes />
      </Router>
    </WotdlePersistedDataStoreProvider>
  );
};

export default App;
