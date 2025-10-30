import { ApplyStyles } from "/app/ApplyStyles.js";

// ---------- Imports after XLSX is ready ----------
// import { DataExtractor } from "/app/DataExtractor.js";
// import { ConfigBuild } from "/app/ConfigBuild.js";
import { Interactivity } from "/app/Interactivity.js";

// ---------- main code ----------
const parent = document.getElementById("script_vacs_25_09_2025").parentElement;

ApplyStyles.init();

// const config = await DataExtractor.init();

// ConfigBuild.build(config, parent);

Interactivity.interact();
