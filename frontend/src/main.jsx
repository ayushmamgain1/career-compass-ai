import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { store } from "./app/store";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{
            style: {
              background: "var(--color-ink-raised)",
              border: "1px solid var(--color-ink-line)",
              color: "var(--color-parchment)",
            },
          }}
        />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);