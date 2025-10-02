export const ApplyStyles = {
  style(config, styles) {
    if (Array.isArray(config)) {
      for (const item of config) {
        this.style(item, styles);
      }
      return;
    }
    if (config.className) {
      const dom = document.getElementById(config.id);
      if (dom && styles[config.className]) {
        Object.assign(dom.style, styles[config.className]);
      }
    }
    if (config.children) {
      this.style(config.children, styles);
    }
  },
};
