import { ApplyStyles } from "/app/ApplyStyles.js";
import { DataExtractor } from "/app/DataExtractor.js";
import { Interactivity } from "/app/Interactivity.js";

// const parent = document.getElementById("script_vacs_25_09_2025").parentElement;

const table = document.querySelector("table");
table.classList.add("table");

const data_window = document.createElement("div");
data_window.classList.add("data_window");
data_window.classList.add("hidden");
table.appendChild(data_window);

//PROD ONLY
import cssText from "./styles/styles.css";
const styleTag = document.createElement("style");
styleTag.textContent = cssText;
document.head.appendChild(styleTag);
//PROD ONLY

ApplyStyles.init(table);
DataExtractor.init(table, data_window);
Interactivity.init();

document
  .querySelector("sidebar")
  .parentElement.parentElement.parentElement.classList.add("hidden");

setTimeout(() => {
  const main = document.querySelectorAll(".col-lg-8.order-1.order-lg-1");
  main.classList.remove("col-lg-8");
  main.classList.add("col-lg-12");
}, 0);
