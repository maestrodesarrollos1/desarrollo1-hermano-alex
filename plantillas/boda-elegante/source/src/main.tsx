import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import i18n from "./i18n/config";
import { applyTemplateTheme } from "./config/template-values";

const restoreSpaFallbackPath = () => {
  try {
    const fallbackPath = window.sessionStorage.getItem("spa-fallback-path");
    if (!fallbackPath) return;

    window.sessionStorage.removeItem("spa-fallback-path");
    const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;

    if (fallbackPath !== currentPath) {
      window.history.replaceState(null, "", fallbackPath);
    }
  } catch (error) {
    console.warn("Could not restore SPA fallback path:", error);
  }
};

// Wait for i18n to be ready, then render and enable scroll animations
const renderApp = () => {
  try {
    restoreSpaFallbackPath();
    applyTemplateTheme();

    // Add js-loaded class to enable scroll animations (elements visible by default until this)
    document.body.classList.add('js-loaded');
    
    createRoot(document.getElementById("root")!).render(<App />);
  } catch (error) {
    console.error('Failed to render app:', error);
    // Fallback: show basic content
    const root = document.getElementById("root");
    if (root) {
      root.innerHTML = '<div style="text-align:center;padding:2rem;">Loading...</div>';
    }
  }
};

// Ensure i18n is initialized before rendering - with timeout fallback
const initTimeout = setTimeout(() => {
  console.warn('i18n initialization timeout, rendering anyway');
  renderApp();
}, 3000);

if (i18n.isInitialized) {
  clearTimeout(initTimeout);
  renderApp();
} else {
  i18n.on('initialized', () => {
    clearTimeout(initTimeout);
    renderApp();
  });
}
