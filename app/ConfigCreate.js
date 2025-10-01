export const ConfigCreate = {
  config: {},
  create(data) {
    return this.recursion(data);
  },
  //add parent
  recursion(data) {
    for (const [key, index] of data) {
      //   this.config[key] = data[key];
    }
  },
};
