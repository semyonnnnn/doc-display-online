import { DataExtractor } from "/app/DataExtractor.js";
import { ConfigBuild } from "/app/ConfigBuild.js";
import { Interactivity } from "/app/Interactivity.js";

//webpack only
import cssText from "./styles/styles.css";

const parent = document.getElementById("script_vacs_25_09_2025").parentElement;
const config = await DataExtractor.init();

ConfigBuild.build(config, parent);

//webpack only
const styleTag = document.createElement("style");
styleTag.textContent = cssText;
document.head.appendChild(styleTag);

Interactivity.interact(config);
