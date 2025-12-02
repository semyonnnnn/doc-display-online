import { ApplyStyles } from "/app/ApplyStyles.js";
import { DataExtractor } from "/app/DataExtractor.js";
import { Interactivity } from "/app/Interactivity.js";
import { Timeline } from "./Timeline.js";
import { CityHider } from "./CityHider.js";

const content = document.querySelectorAll(".content")[1];
const outer_tables = content.querySelectorAll(":scope > table");

const data_window = document.createElement("div");
data_window.classList.add("data_window");
data_window.classList.add("hidden");

// PROD ONLY
import template from "../template.html";
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

setTimeout(() => {
  // hide sidebar & expand main
  document.querySelector(
    ".col-lg-4.mt-2.mt-lg-0.order-2.order-lg-1"
  ).style.display = "none";
  const main = document.querySelectorAll(".col-lg-8.order-1.order-lg-1")[0];
  main.classList.replace("col-lg-8", "col-lg-12");

  content.parentElement.appendChild(data_window);

  // Insert template
  const interviewers_container = document.createElement("div");
  interviewers_container.innerHTML = template;
  content.parentElement.parentElement.appendChild(interviewers_container);

  // Now elements exist, safe to init
  Timeline.timeline = interviewers_container.querySelector(".timeline-grid");

  // Create month labels container if missing
  let monthLabels = interviewers_container.querySelector(".month-labels");
  if (!monthLabels) {
    monthLabels = document.createElement("div");
    monthLabels.classList.add("month-labels");
    Timeline.timeline.parentElement.insertBefore(
      monthLabels,
      Timeline.timeline
    );
  }
  Timeline.monthLabels = monthLabels;

  // CityHider elements
  const table = interviewers_container.querySelector("#surveyTable");
  const select = interviewers_container.querySelector("#cityHider");
  if (table && select) {
    CityHider.table = table;
    CityHider.select = select;
    Timeline.init();
    CityHider.init();
  }
}, 0);

// https://66.rosstat.gov.ru/folder/270448
