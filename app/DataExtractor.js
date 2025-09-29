// import { read, utils } from "xlsx";
const { read, utils } = XLSX;

export const DataExtractor = {
  async init() {
    this.rawJSON = await this.getRawJSON();
    const res = this.grouped_arrays(this.rawJSON);

    console.log("res:", res);

    return this.rawJSON;
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
    const workbook = read(arrayBuffer, { type: "binary", codepage: 65001 });
    const sheet = Object.entries(workbook.Sheets)[0][1];

    const range = XLSX.utils.decode_range(sheet["!ref"]);
    const data = XLSX.utils
      .sheet_to_json(sheet, { header: 1 })
      .map((row) =>
        Array.from({ length: range.e.c + 1 }, (_, i) =>
          row[i] === undefined ||
          row[i] === null ||
          (typeof row[i] === "string" && row[i].trim() === "")
            ? ""
            : row[i]
        )
      );

    return data;
  },

  grouped_arrays(raw) {
    return raw;
  },
};

function groupBetweenRepeats(aoa) {
  const groups = [];

  let currentGroup = [];

  const seen = new Set();

  for (const row of aoa) {
    const first = row[0];
    if (seen.has(first)) {
      currentGroup.push(row);
      groups.push(currentGroup);
      currentGroup = [];
      seen.clear();
    } else {
      currentGroup.push(row);
      seen.add(first);
    }
  }

  if (currentGroup.length) groups.push(currentGroup);
  return groups;
}
