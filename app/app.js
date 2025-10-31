import { ApplyStyles } from "/app/ApplyStyles.js";
import { DataExtractor } from "/app/DataExtractor.js";
import { Interactivity } from "/app/Interactivity.js";

// const parent = document.getElementById("script_vacs_25_09_2025").parentElement;

const table = document.querySelector("table");

import cssText from "./styles/styles.css";

const styleTag = document.createElement("style");
styleTag.textContent = cssText;
document.head.appendChild(styleTag);

ApplyStyles.init(table);
DataExtractor.init(table);
Interactivity.init();
