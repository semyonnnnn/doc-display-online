export const ConfigCreate = {
  config: {},
  create(data) {
    console.log(data);
    this.recursion(data, this.config);
    return this.config;
  },
  recursion(data, parent) {
    for (const item of data) {
      if (item.hasOwnProperty("children")) {
        console.log("has children", item["children"]);
        parent["title"] = item["title"];
        parent["children"] = item["children"];

        // recursion;
      }
    }
    return parent;
  },
};
