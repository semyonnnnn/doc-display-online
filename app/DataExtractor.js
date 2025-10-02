const { read } = XLSX;

export const DataExtractor = {
  prop_title: "что мы предлагаем",

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
      ? "/media/vacs.csv"
      : "https://66.rosstat.gov.ru/storage/mediabank/vacs.csv";
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

    const proposalSection = {
      title: this.prop_title,
      lines: proposal_arr
        .filter((row) => row[0].toLowerCase() !== this.prop_title)
        .map((row) => row[0]),
    };

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
          proposal: proposalSection,
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
      children: [
        {
          textContent: "все вакансии",
          html: "h2",
          className: "all_vacs_title",
        },
      ],
    };

    model.forEach((dep, depIndex) => {
      const depObj = {
        html: "div",
        className: "dep",
        id: "dep_" + (depIndex + 1),
        children: [
          { html: "h2", textContent: dep.title, className: "dep_title" },
        ],
      };

      dep.vacancies.forEach((vac, vacIndex) => {
        const vacContainer = {
          html: "ul",
          className: "vac",
          id: depObj.id + "_vac_" + (vacIndex + 1),
          children: [
            {
              html: "h3",
              textContent: vac.title,
              className: "vac_title",
              id: depObj.id + "_vac_" + (vacIndex + 1) + "_vacTitle",
            },
            {
              html: "div",
              className: "vac_sections",
              id: depObj.id + "_vac_" + (vacIndex + 1) + "_sections",
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
                  html: "li",
                  className,
                  children: [
                    { html: "h4", textContent: title },
                    ...vac[key].map((line) => ({
                      html: "p",
                      className: className + "_line",
                      textContent: line,
                    })),
                  ],
                })),
                {
                  html: "li",
                  className: "proposal",
                  children: [
                    { html: "h4", textContent: vac.proposal.title },
                    ...vac.proposal.lines.map((line) => ({
                      html: "p",
                      className: "proposal_line",
                      textContent: line,
                    })),
                  ],
                },
              ],
            },
          ],
        };

        depObj.children.push(vacContainer);
      });

      by_deps.children.push(depObj);
    });

    return [by_deps];
  },
};
