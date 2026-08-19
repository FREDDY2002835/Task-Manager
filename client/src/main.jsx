import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

import "./index.css";
import "./styles/theme.css";

import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import { registerSW } from "virtual:pwa-register";

// Registers the service worker that makes the app installable and
// lets it receive push notifications even when the tab is closed.
// autoUpdate: silently activates new versions on next load.
registerSW({ immediate: true });

ReactDOM.createRoot(document.getElementById("root")).render(

  <React.StrictMode>

    <BrowserRouter>

      <AuthProvider>

        <LanguageProvider>

          <ThemeProvider>

            <App />

          </ThemeProvider>

        </LanguageProvider>

      </AuthProvider>

    </BrowserRouter>

  </React.StrictMode>

);