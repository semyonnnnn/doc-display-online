export const ApplyStyles = {
  init: (outer_tables, content) => {
    outer_tables.forEach((outer_table, outer_table_index) => {
      outer_table.classList.add("inline-table");
      outer_table.querySelectorAll("table").forEach((table) => {
        table
          .querySelectorAll("td")
          .forEach(
            (td) => (td.innerHTML = td.innerHTML.replace(/&nbsp;/g, ""))
          );
        table.querySelectorAll("br").forEach((br) => br.remove());
      });
      outer_table.querySelectorAll("tr td p").forEach((title, title_index) => {
        title.classList.add("dep_trigger");
        title.id = "dep_trigger_" + outer_table_index + title_index;

        const arrow = document.createElement("p");
        arrow.classList.add("arrow");
        title.appendChild(arrow);
      });
    });

    const vacs = content.querySelectorAll("table a");
    vacs.forEach((vac) => vac.classList.add("vac"));
  },
};
