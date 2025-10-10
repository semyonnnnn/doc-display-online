import { read } from "xlsx";
// const { read } = XLSX;

export const DataExtractor = {
  prop_title: "что мы предлагаем",
  proposal: {},
  modal: {
    id: "modal_vacs_2025",
    className: "modal_vacs_2025 hidden",
    html: "div",
    children: [],
  },

  async init() {
    this.rawJSON = await this.getRawJSON();
    const model = this.parseModel(this.rawJSON);
    return this.decorateModel(model);
  },

  is_dev:
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    (typeof process !== "undefined" && process.env?.NODE_ENV === "development"),

  async getRawJSON() {
    const url = this.is_dev
      ? "/media/vacs.xlsx"
      : "https://66.rosstat.gov.ru/storage/mediabank/vacs.xlsx";
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
      .filter((row) => !row.every((cell) => !cell || cell.trim() === ""));
    return data;
  },

  parseModel(raw_data) {
    const proposal_arr = [];
    let proposal_last_index;
    for (const [index, row] of raw_data.entries()) {
      if (row[0].toLowerCase() === "отдел") {
        proposal_last_index = index;
        break;
      }
      proposal_arr.push(row);
    }

    // this.proposal = {
    //   html: "div",
    //   className: "proposal_block",
    //   children: [
    //     {
    //       html: "h2",
    //       textContent: this.prop_title,
    //       className: "proposal_title",
    //     },
    //     ...proposal_arr
    //       .filter((row) => row[0].toLowerCase() !== this.prop_title)
    //       .map((row) => ({
    //         html: "li",
    //         textContent: row[0],
    //         className: "proposal_line",
    //       })),
    //   ],
    // };

    const departments_raw = raw_data.slice(proposal_last_index);
    const departments = [];
    let currentSection = [];
    for (const row of departments_raw) {
      if (row[0].toLowerCase() === "отдел") {
        if (currentSection.length) departments.push(currentSection);
        currentSection = [row];
      } else {
        currentSection.push(row);
      }
    }
    if (currentSection.length) departments.push(currentSection);

    return departments.map((depRows) => {
      const depTitle = depRows[0][1];
      const vacancyRows = depRows.slice(1);
      const groupedVacancies = [];
      let currentVac = [];
      for (const row of vacancyRows) {
        if (row[0].toLowerCase() === "должность") {
          if (currentVac.length) groupedVacancies.push(currentVac);
          currentVac = [row];
        } else {
          currentVac.push(row);
        }
      }
      if (currentVac.length) groupedVacancies.push(currentVac);

      const vacancies = groupedVacancies.map((vRows) => {
        let title = "";
        const req = [];
        const res = [];
        const contacts = [];
        vRows.forEach((r) => {
          if (r[0].toLowerCase() === "должность") {
            title = r[1];
          } else {
            req.push(r[0]);
            res.push(r[1]);
            contacts.push(r[2]);
          }
        });
        return {
          title,
          requirements: req.filter(Boolean),
          responsibilities: res.filter(Boolean),
          contacts: contacts.filter(Boolean),
        };
      });

      return { title: depTitle, vacancies };
    });
  },

  decorateModel(model) {
    const by_deps = {
      html: "div",
      id: "all_vacs_2025",
      className: "all_vacs",
      children: [],
    };
    const by_deps_modal = {
      html: "div",
      id: "vacs_desc_2025",
      className: "vacs_desc",
      children: [
        {
          textContent: "описание",
          html: "h2",
          className: "vac_title",
        },
      ],
    };

    model.forEach((dep, depIndex) => {
      const depObj = {
        html: "div",
        className: "dep",
        id: "dep_" + (depIndex + 1),
        children: [
          {
            html: "div",
            className: "dep_title_wrapper",
            id: "dep_" + (depIndex + 1) + "_wrapper",
            children: [
              { html: "h2", textContent: dep.title, className: "dep_title" },
              {
                html: "div",
                className: "dep_arrow",
                id: "dep_" + (depIndex + 1) + "_arrow",
              },
            ],
          },
          {
            html: "div",
            id: "dep_" + (depIndex + 1) + "_content",
            className: "vacs_wrapper hidden",
            children: [],
          },
        ],
      };

      dep.vacancies.forEach((vac, vacIndex) => {
        const vacContainer = {
          html: "div",
          className: "vac",
          id: depObj.id + "_vac_" + (vacIndex + 1),
          children: [
            {
              html: "button",
              textContent: vac.title,
              className: "vac_title",
              id: depObj.id + "_vac_" + (vacIndex + 1) + "_vacTitle",
            },
          ],
        };
        depObj.children[1].children.push(vacContainer);

        const vacContainer_modal = {
          html: "ul",
          className: "vac_modal",
          id: depObj.id + "_vac_" + (vacIndex + 1) + "_modal",
          children: [
            {
              html: "div",
              className: "vac_title_modal_wrapper",
              id:
                depObj.id +
                "_vac_" +
                (vacIndex + 1) +
                "_vacTitle_modal_wrapper",
              children: [
                {
                  html: "h3",
                  textContent: dep.title,
                  className: "dep_title_modal",
                  id: depObj.id + "_vac_" + (vacIndex + 1) + "_depTitle_modal",
                },
                {
                  html: "h3",
                  textContent: vac.title,
                  className: "vac_title_modal",
                  id: depObj.id + "_vac_" + (vacIndex + 1) + "_vacTitle_modal",
                },
              ],
            },
            {
              html: "div",
              className: "vac_sections",
              id: depObj.id + "_vac_" + (vacIndex + 1) + "_sections_modal",
              children: [
                ...[
                  {
                    key: "requirements",
                    title: "требования",
                    className: "req",
                  },
                  {
                    key: "responsibilities",
                    title: "обязанности",
                    className: "res",
                  },
                  {
                    key: "contacts",
                    title: "контактная информация",
                    className: "con",
                  },
                ].map(({ key, title, className }) => ({
                  html: "p",
                  className,
                  children: [
                    { html: "h4", textContent: title },
                    ...vac[key].slice(1, vac[key].length).map((line) => ({
                      html: "li",
                      className: className + "_line",
                      textContent: this.normalizeListItem(line),
                    })),
                  ],
                })),
              ],
            },
          ],
        };

        this.modal["children"].push(vacContainer_modal);
      });

      by_deps.children.push(depObj);
    });

    return [
      {
        id: "great_granddad_vacancies_2025",
        html: "div",
        className: "great_granddad_vacancies_2025",
        children: [
          {
            id: "grandmom_vacancies_2025",
            html: "div",
            className: "grandmom_vacancies_2025",
            children: [
              {
                id: "aunt_vacancies_2025",
                html: "img",
                className: "aunt_vacancies_2025",
                // src: "/media/vacs.png",
                src: "https://66.rosstat.gov.ru/storage/mediabank/banner-vacs.png",
              },
            ],
          },
          {
            id: "granddad_vacancies_2025",
            html: "div",
            className: "granddad_vacancies_2025",
            children: [by_deps, this.modal],
          },
        ],
      },
    ];
  },

  normalizeListItem(text) {
    const low_text = text
      .toLowerCase()
      .trim()
      .replace(/^\u200B+/, "");
    const with_big_first_letter =
      low_text[0].toUpperCase() + low_text.slice(1, low_text.length);

    const with_semicolumn =
      with_big_first_letter[with_big_first_letter.length - 1] === ";"
        ? with_big_first_letter
        : with_big_first_letter + ";";

    return with_semicolumn;
  },
};
