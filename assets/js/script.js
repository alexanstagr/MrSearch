import { engines } from "./engines.js";

document.addEventListener("DOMContentLoaded", () => {
  const input = document.querySelector(".searcher input");
  const iconEl = document.querySelector(".icon");

  let engineSelected = null;
  let queryTyped = false;

  function getEngineFavIcon(domain) {
    const faviconUrl = `https://www.google.com/s2/favicons?sz=48&domain_url=${encodeURIComponent(
      domain
    )}`;
    iconEl.style.backgroundImage = `url("${faviconUrl}")`;
  }

  function resetEngine() {
    engineSelected = null;
    queryTyped = false;
    iconEl.style.backgroundImage = "";
    iconEl.setAttribute("data-engine", "");
    input.placeholder = "Type trigger...";
    localStorage.removeItem("engineSelected");
  }

  const stored = localStorage.getItem("engineSelected");

  if (stored) {
    engineSelected = JSON.parse(stored);
  } else {
    engineSelected = engines.find((engine) => engine.engine === "Google");
    localStorage.setItem("engineSelected", JSON.stringify(engineSelected));
  }

  getEngineFavIcon(engineSelected.domain);
  iconEl.setAttribute("data-engine", engineSelected.engine.toLowerCase());
  input.placeholder = `${engineSelected.engine}`;

  input.addEventListener("input", (event) => {
    const value = event.target.value.trim().toLowerCase();

    const matchedEngine = engines.find((engine) => value === engine.trigger);

    if (matchedEngine) {
      engineSelected = matchedEngine;
      queryTyped = false;
      getEngineFavIcon(engineSelected.domain);
      iconEl.setAttribute("data-engine", engineSelected.engine.toLowerCase());
      input.value = "";
      input.placeholder = `${engineSelected.engine}`;

      localStorage.setItem("engineSelected", JSON.stringify(engineSelected));
    } else if (engineSelected) {
      queryTyped = true;
    }
  });


  input.addEventListener("keydown", (e) => {
    if (e.key === "Backspace" && input.value.trim() === "") {
      resetEngine();
      return;
    }

    // performs search
    if (e.key === "Enter" && engineSelected && input.value.trim()) {
      const searchTerm = input.value.trim();
      const finalUrl = `${engineSelected.endpoint}${encodeURIComponent(
        searchTerm
      )}`;
      window.open(finalUrl, "_blank");
      window.close();
    }
  });
});
