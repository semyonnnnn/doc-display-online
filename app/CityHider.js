export const CityHider = {
  select: document.getElementById("cityHider"),
  table: document.getElementById("surveyTable"),
  init() {
    const rows = this.table.querySelectorAll("tbody tr");

    this.select.addEventListener("change", () => {
      const city = this.select.value.trim().toLowerCase();
      const timeline_links = Array.from(
        document.querySelectorAll(".timeline-link")
      );

      if (city === "" || city === "выбрать") {
        rows.forEach((row) => row.classList.remove("hidden"));
        timeline_links.forEach((l) => l.classList.remove("hidden"));
        return;
      }

      rows.forEach((row) => {
        const cityCell = row.cells[row.cells.length - 1]; // last column
        const rowCities = cityCell.textContent.toLowerCase();
        const linkHashMatches = timeline_links.filter(
          (tll) => new URL(tll.href).hash.slice(1) === row.id
        );

        if (rowCities.includes(city)) {
          row.classList.remove("hidden");
          linkHashMatches.forEach((l) => l.classList.remove("hidden"));
        } else {
          row.classList.add("hidden");
          linkHashMatches.forEach((l) => l.classList.add("hidden"));
        }
      });
    });
  },
};
