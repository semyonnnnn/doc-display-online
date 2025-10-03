// ---------- Load XLSX first ----------
async function loadXLSX() {
  return new Promise((resolve, reject) => {
    if (window.XLSX) return resolve(window.XLSX);

    const script = document.createElement("script");
    script.src =
      "https://cdn.sheetjs.com/xlsx-0.18.5/package/dist/xlsx.full.min.js";
    script.type = "text/javascript";
    script.async = false; // executes in order
    script.onload = () => resolve(window.XLSX);
    script.onerror = () => reject(new Error("Failed to load XLSX"));

    const head = document.head || document.getElementsByTagName("head")[0];
    head.insertBefore(script, head.firstChild);
  });
}

// Wait until XLSX is loaded before anything else
await loadXLSX();

// ---------- Imports after XLSX is ready ----------
import { DataExtractor } from "/app/DataExtractor.js";
import { ConfigBuild } from "/app/ConfigBuild.js";
import { Interactivity } from "/app/Interactivity.js";

// webpack only: import CSS as text
import cssText from "./styles/styles.css";

// ---------- Your main code ----------
const parent = document.getElementById("script_vacs_25_09_2025").parentElement;
const config = await DataExtractor.init();

ConfigBuild.build(config, parent);

// Append CSS
const styleTag = document.createElement("style");
styleTag.textContent = cssText;
document.head.appendChild(styleTag);

Interactivity.interact(config);
