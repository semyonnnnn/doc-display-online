export const DataExtractor = {
  init: (table) => {
    const links = table.querySelectorAll("a");
    links.forEach((link) => {
      link.addEventListener("click", async (e) => {
        e.preventDefault();
        const url = e.currentTarget.href;
        try {
          const response = await fetch(url);
          if (!response.ok) throw new Error("Failed to fetch file");
          const arrayBuffer = await response.arrayBuffer();

          const result = await mammoth.convertToHtml({ arrayBuffer });
          console.log(result.value);
          console.log("Messages:", result.messages);
        } catch (err) {
          console.error("ERR: ", err);
        }
      });
    });
  },
};
