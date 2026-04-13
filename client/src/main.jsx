import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./context/ThemeContext";

// Export the mount function for .NET integration
window.renderQuizHub = (elementId) => {
  const el = document.getElementById(elementId);
  if (el) {
    ReactDOM.createRoot(el).render(
      <ThemeProvider>
        <App />
      </ThemeProvider>
    );
  } else {
    console.error(`Element with id ${elementId} not found`);
  }
};

// Fallback for local Vite dev server
const rootEl = document.getElementById("root");
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}