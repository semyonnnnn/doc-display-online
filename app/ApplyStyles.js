export const ApplyStyles = {
  init: () => {
    const table = document.querySelector("table");

    table
      .querySelectorAll("td")
      .forEach((td) => (td.innerHTML = td.innerHTML.replace(/&nbsp;/g, "")));
    table.querySelectorAll("br").forEach((br) => br.remove());

    const vacs = document.querySelectorAll("table:first-of-type td a");
    vacs.forEach((vac) => vac.classList.add("vac"));

    for (const [index, row] of Object.entries(table.rows)) {
      const dep_menu = row.querySelector("table");
      dep_menu.id = "dep_menu_" + index;
      dep_menu.classList.add("dep_menu");
      dep_menu.classList.add("hidden");

      for (const cell of row.cells) {
        const dep = cell.querySelector("p");
        dep.classList.add("dep_trigger");
        dep.id = "dep_trigger_" + index;

        const arrow_container = document.createElement("div");
        arrow_container.classList.add("arrow_container");

        const arrow = document.createElement("div");
        arrow.classList.add("arrow");

        dep.appendChild(arrow_container);
        arrow_container.appendChild(arrow);
      }
    }
  },
};
