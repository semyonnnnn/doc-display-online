import * as mammoth from "mammoth";

export const DataExtractor = {
  init: (outer_tables, data_window) => {
    // const links = Array.from(outer_tables)
    //   .map((outer_table) => outer_table.querySelectorAll("a"))
    //   .map((table) => Array.from(table))
    //   .flat();

    const links = document.querySelectorAll(".vac");

    links.forEach((link) => {
      link.addEventListener("click", async (e) => {
        e.preventDefault();
        const url = e.currentTarget.href;
        try {
          const response = await fetch(url);
          if (!response.ok) throw new Error("Failed to fetch file");
          const arrayBuffer = await response.arrayBuffer();

          const result = await mammoth.convertToHtml({ arrayBuffer });

          data_window.classList.remove("hidden");
          data_window.innerHTML = result.value;

          for (const child of data_window.children) {
            if (child.tagName.toLowerCase() !== "ul") {
              child == data_window.children[0]
                ? child.classList.add("title")
                : child.classList.add("subtitle");
            }
          }
        } catch (err) {
          console.error("ERR: ", err);
        }
      });
    });
  },
};
