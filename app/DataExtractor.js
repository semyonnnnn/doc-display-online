// import { read, utils } from "xlsx";
const { read, utils } = XLSX;

export const DataExtractor = {
  prop_title: "что мы предлагаем",

  async init() {
    this.rawJSON = await this.getRawJSON();
    const res = this.grouped_arrays(this.rawJSON);

    return res;
  },
  is_dev:
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    (typeof process !== "undefined" && process.env?.NODE_ENV === "development"),

  async getRawJSON() {
    const url = this.is_dev
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
            : row[i].trim()
        )
      )
      .filter((row) => {
        return !row.every((i) => !i || i.trim() === "");
      });

    return data;
  },

  grouped_arrays(raw_data) {
    const proposal_arr = [];
    let proposal_last_index;

    for (const [index, row] of raw_data.entries()) {
      if (row[0].toLowerCase() === "отдел") {
        proposal_last_index = index;
        break;
      }
      proposal_arr.push(row);
    }

    const proposal = { content: [] };
    proposal_arr.forEach((row, i) => {
      if (row[0].toLowerCase() === this.prop_title) {
        proposal["title"] = this.prop_title;
      } else {
        proposal["content"][i] = row[0];
      }
    });

    proposal["content"] = [...proposal["content"]].filter((item) => item);

    const no_proposal_raw = raw_data.slice(
      proposal_last_index,
      raw_data.length
    );

    const by_deps_arr = [];
    let currentSection = [];
    for (const row of no_proposal_raw) {
      if (row[0].toLowerCase() === "отдел") {
        if (currentSection.length > 0) {
          by_deps_arr.push(currentSection);
          currentSection = [];
        }
        currentSection.push(row);
      } else {
        currentSection.push(row);
      }
    }

    if (currentSection.length > 0) {
      by_deps_arr.push(currentSection);
    }

    const by_deps = [];

    by_deps_arr.forEach((dep_arr) => {
      const department = { vacs: [] };
      department["dep"] = dep_arr[0][1];

      // const groups = [];
      let currentGroup = [];

      dep_arr.slice(1, dep_arr.length).forEach((row) => {
        if (row[0].toLowerCase() === "должность") {
          if (currentGroup.length > 0) {
            department["vacs"].push(currentGroup);
            currentGroup = [];
          }
          currentGroup.push(row);
        } else {
          currentGroup.push(row);
        }
      });

      if (currentGroup.length > 0) {
        department["vacs"].push(currentGroup);
      }
      by_deps.push(department);
    });

    by_deps.forEach((dep) => {
      const new_vacs = [];
      dep["vacs"].forEach((row) => {
        let title = "";
        let req = [];
        let res = [];
        let contacts = [];

        row.forEach((item) => {
          if (item[0].toLowerCase() === "должность") {
            title = item[1];
          } else {
            req.push(item[0]);
            res.push(item[1]);
            contacts.push(item[2]);
          }
        });

        [req, res, contacts] = [req, res, contacts].map((arr) => {
          return arr.filter((item) => item !== "");
        });

        const obj = {
          title: title,
          content: {
            req: req,
            res: res,
            contacts: contacts,
          },
        };
        new_vacs.push(obj);
      });
      dep["vacs"] = new_vacs;
    });

    // console.log("FINAL:", by_deps);

    return by_deps;
  },
};
