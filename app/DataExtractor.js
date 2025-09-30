// import { read, utils } from "xlsx";
const { read, utils } = XLSX;

export const DataExtractor = {
  prop_title: "что мы предлагаем",

  async init() {
    this.rawJSON = await this.getRawJSON();
    const res = this.grouped_arrays(this.rawJSON);

    return this.rawJSON;
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

    /*

      [
        {
          dep, [            
                vac, {
                  req: [],
                  res: [],
                  con: []
                },
                vac, {
                  req: [],
                  res: [],
                  con: []
                },
                vac, {
                  req: [],
                  res: [],
                  con: []
                },
              ]           
         },
         {
          dep, [            
                vac, {
                  req: [],
                  res: [],
                  con: []
                },
              ]           
         },
         {
          dep, [            
                {
                  title: vac, 
                  content: {
                    req: [],
                    res: [],
                    con: []
                  },
                }
                vac, {
                  req: [],
                  res: [],
                  con: []
                },
              ]           
         },        
      ]

    */

    const by_deps = [];
    console.log("by_deps_arr", by_deps_arr);

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

    console.log(by_deps);

    return proposal;
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
