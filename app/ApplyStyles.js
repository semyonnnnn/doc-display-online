export const ApplyStyles = {
  style(config, styles) {
    for (const [key, item] of Object.entries(config)) {
      if (item.className) {
        const dom_representation = document.getElementById(key);
        Object.assign(dom_representation.style, styles[item.className]);
      }
      if (item.children) {
        this.style(item.children, styles);
      }
    }
  },
};
