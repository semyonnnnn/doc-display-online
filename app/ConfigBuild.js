export const ConfigBuild = {
  build(config, parent) {
    for (const item of config) {
      const html_element = document.createElement(item.html || "div");
      this.properties_assignment(item, html_element);

      if (item.title) {
        const titleEl = document.createElement(item.title.html || "h2");
        titleEl.textContent = item.title.textContent || "";
        html_element.appendChild(titleEl);
      }

      parent.appendChild(html_element);

      if (item.children) {
        this.build(item.children, html_element);
      }
    }
  },
  properties_assignment(item, html_element) {
    for (const [key, prop] of Object.entries(item)) {
      if (key !== "html" && key !== "children" && key !== "title") {
        html_element[key] = prop;
      }
    }
  },
};
