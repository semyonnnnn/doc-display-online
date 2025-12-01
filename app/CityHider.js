export const CityHider = {
  select: document.getElementById("cityHider"),
  table: document.getElementById("surveyTable"),
  init() {
    const rows = this.table.querySelectorAll("tbody tr");

    this.select.addEventListener("change", () => {
      const city = this.select.value.trim().toLowerCase();

      if (city === "" || city === "выбрать") {
        // show all rows
        rows.forEach((row) => row.classList.remove("hidden"));
        return;
      }

      // otherwise, filter by selected city
      rows.forEach((row) => {
        const cityCell = row.cells[row.cells.length - 1]; // last column
        const rowCities = cityCell.textContent.toLowerCase();

        if (rowCities.includes(city)) {
          row.classList.remove("hidden");
        } else {
          row.classList.add("hidden");
        }
      });
    });
  },
};
