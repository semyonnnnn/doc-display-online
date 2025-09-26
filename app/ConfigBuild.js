export const ConfigBuild = {
  build(config, parent) {
    for (const [key, item] of Object.entries(config)) {
      const html_element = document.createElement(item.html);
      this.properties_assignment(item, html_element);
      html_element["id"] = key;
      parent.appendChild(html_element);

      if (item.children) {
        this.build(item.children, html_element);
      }
    }
  },
  properties_assignment(item, html_element) {
    for (const [key, prop] of Object.entries(item)) {
      if (key !== "html" && key !== "children") {
        html_element[key] = prop;
      }
    }
  },
};
