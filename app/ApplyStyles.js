export const ApplyStyles = {
  style(config, styles) {
    if (Array.isArray(config)) {
      for (const item of config) {
        this.style(item, styles);
      }
      return;
    }
    if (config.className) {
      const elements = document.querySelectorAll(
        `#${config.id}, .${config.className}`
      );
      elements.forEach((dom) => {
        const classes = config.className.split(/\s+/);
        classes.forEach((cls) => {
          if (styles[cls]) {
            Object.assign(dom.style, styles[cls]);
          }
        });
      });
    }
    if (config.children) {
      this.style(config.children, styles);
    }
  },
};
