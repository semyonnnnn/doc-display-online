import { ApplyStyles } from "/app/ApplyStyles.js";
import { DataExtractor } from "/app/DataExtractor.js";
import { Interactivity } from "/app/Interactivity.js";
import { Timeline } from "./Timeline.js";
import { CityHider } from "./CityHider.js";

import template from "../template.html";

const content = document.querySelectorAll(".content")[1];
const outer_tables = content.querySelectorAll(":scope > table");

const data_window = document.createElement("div");
data_window.classList.add("data_window");
data_window.classList.add("hidden");

// PROD ONLY
import vacancies_styles from "./styles/vacancies.css";
import interviewers_styles from "./styles/interviewers.css";
import general_styles from "./styles/general.css";

const styleTag = document.createElement("style");
styleTag.textContent = vacancies_styles + interviewers_styles + general_styles;

document.head.appendChild(styleTag);

//PROD ONLY

ApplyStyles.init(outer_tables, content);
Interactivity.init(content);
DataExtractor.init(data_window);

document.addEventListener("DOMContentLoaded", () => {
  Timeline.init();
  CityHider.init();
});

setTimeout(() => {
  document.querySelector(
    ".col-lg-4.mt-2.mt-lg-0.order-2.order-lg-1"
  ).style.display = "none";
  const main = document.querySelectorAll(".col-lg-8.order-1.order-lg-1")[0];
  main.classList.remove("col-lg-8");
  main.classList.add("col-lg-12");

  content.parentElement.appendChild(data_window);

  ///////////////////////////////////////////////

  //PROD ONLY
  const interviewers_container = document.createElement("div");
  interviewers_container.innerHTML = template;

  content.parentElement.parentElement.appendChild(interviewers_container);
  //PROD ONLY
}, 0);

// https://66.rosstat.gov.ru/folder/270448
