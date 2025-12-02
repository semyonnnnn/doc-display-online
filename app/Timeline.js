import { data } from "./data.js";
import { Months } from "./Months.js";
import { links } from "./links.js";

const monthMap = {
  января: "Январь",
  февраля: "Февраль",
  марта: "Март",
  апреля: "Апрель",
  мая: "Май",
  июня: "Июнь",
  июля: "Июль",
  августа: "Август",
  сентября: "Сентябрь",
  октября: "Октябрь",
  ноября: "Ноябрь",
  декабря: "Декабрь",
};

const alphaChanel = ".9";

const colorShadows = [
  `rgba(155, 246, 255, ${alphaChanel})`, // 1
  `rgba(202, 255, 191, ${alphaChanel})`, // 2
  `rgba(255, 214, 182, ${alphaChanel})`, // 3
  `rgba(255, 214, 165, ${alphaChanel})`, // 4
  `rgba(255, 173, 173, ${alphaChanel})`, // 5
  `rgba(114, 221, 247, ${alphaChanel})`, // 6
  `rgba(194, 169, 239, ${alphaChanel})`, // 7
];

export const Timeline = {
  timeline: document.querySelector(".timeline-grid"),
  monthLabels: document.querySelector(".month-labels"),
  currentPage: 0,
  monthsPerPage: 6, // show half a year at a time

  init() {
    if (!this.timeline || !this.monthLabels) {
      console.warn("Timeline or month-labels element not found!");
      return;
    }

    this.renderPage();

    document.getElementById("nextBtn").addEventListener("click", () => {
      this.currentPage++;
      if (this.currentPage * this.monthsPerPage >= Months.months.length) {
        this.currentPage = 0;
      }
      this.renderPage();
    });

    document.getElementById("prevBtn").addEventListener("click", () => {
      this.currentPage--;
      if (this.currentPage < 0) {
        this.currentPage = 1;
      }
      this.renderPage();
    });
  },

  renderPage() {
    // clear previous timeline and labels
    this.timeline.innerHTML = "";
    this.monthLabels.innerHTML = "";

    const startMonthIndex = this.currentPage * this.monthsPerPage;
    const endMonthIndex = Math.min(
      startMonthIndex + this.monthsPerPage,
      Months.months.length
    );

    // render month labels
    for (let i = startMonthIndex; i < endMonthIndex; i++) {
      const wrapper = document.createElement("div");
      wrapper.classList.add("month-wrapper");

      const label = document.createElement("div");
      label.classList.add("month-name");
      label.textContent = Months.months[i].name;

      wrapper.appendChild(label);
      this.monthLabels.appendChild(wrapper);
    }

    // collect table row ids once
    const tableIds = new Set(
      Array.from(document.querySelectorAll("#surveyTable tbody tr")).map(
        (r) => r.id
      )
    );

    const tableRows = Array.from(
      document.querySelectorAll("#surveyTable tbody tr")
    );

    const hiddenRows = tableRows.filter((tableRow) =>
      tableRow.classList.contains("hidden")
    );

    const hiddenIds = hiddenRows.map((r) => r.id);

    // render timeline bars for periods that intersect this page
    data.forEach((item, itemIndex) => {
      item.periods.forEach((period) => {
        const [startDay, startMonthGen] = period.start.split(" ");
        const [endDay, endMonthGen] = period.end.split(" ");

        const startMonth = Months.months.findIndex(
          (m) => m.name === monthMap[startMonthGen]
        );
        const endMonth = Months.months.findIndex(
          (m) => m.name === monthMap[endMonthGen]
        );

        // skip bars that are completely outside current page
        if (endMonth < startMonthIndex || startMonth >= endMonthIndex) return;

        const durationDays = this.calculateDuration(
          +startDay,
          startMonth,
          +endDay,
          endMonth
        );

        const pos = Months.timelinePosition(
          startMonth + 1, // convert to 1-based
          +startDay,
          durationDays,
          startMonthIndex + 1, // visibleStartMonth
          this.monthsPerPage
        );

        // Create link wrapper
        const link = document.createElement("a");
        const linkId = links[itemIndex] || "";
        link.href = "#" + linkId;
        link.dataset.linkId = linkId;
        link.classList.add("timeline-link");
        link.style.left = pos.left;
        link.style.width = pos.width;
        link.style.top = `calc(${itemIndex + 1} * 3rem)`;

        if (hiddenIds.includes(linkId)) {
          link.classList.add("hidden");
        }

        // Create colored bar (use your color-* CSS class)
        const bar = document.createElement("div");
        bar.classList.add("survey-bar", `color-${(itemIndex % 7) + 1}`);
        bar.dataset.name = item.name;

        // Create text div (kept intact)
        const colorShadow = colorShadows[itemIndex % colorShadows.length];
        const textDiv = document.createElement("div");
        textDiv.classList.add("survey-text"); // your original class
        textDiv.textContent = item.name;
        textDiv.style.boxShadow = `0px 3px 5px -2px ${colorShadow}`;

        // Append bar and text to link
        link.appendChild(bar);
        link.appendChild(textDiv);

        // Append link to timeline
        this.timeline.appendChild(link);
      });
    });
  },

  calculateDuration(sd, sm, ed, em) {
    if (sm === em) return ed - sd + 1;
    let days = Months.months[sm].days - sd + 1;
    for (let m = sm + 1; m < em; m++) days += Months.months[m].days;
    days += ed;
    return days;
  },
};
