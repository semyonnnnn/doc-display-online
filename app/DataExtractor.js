// import { read, utils } from "xlsx";
const { read, utils } = XLSX;

export const DataExtractor = {
  async init() {
    this.rawJSON = await this.getRawJSON();
    // this.sorted = await this.JSON_sorted();
  },
  isDev:
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    (typeof process !== "undefined" && process.env?.NODE_ENV === "development"),

  async getRawJSON() {
    const url = this.isDev
      ? `/media/vacs.csv`
      : `https://66.rosstat.gov.ru/storage/mediabank/vacs.csv`;
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const workbook = read(arrayBuffer, { type: "array" });

    return workbook;
  },
};
