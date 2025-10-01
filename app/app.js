import { DataExtractor } from "/app/DataExtractor.js";
// import { ConfigCreate } from "/app/ConfigCreate.js";
import { ConfigBuild } from "/app/ConfigBuild.js";

import * as styles from "/app/styles/styles.js";
import { ApplyStyles } from "/app/ApplyStyles.js";

const parent = document.getElementById("script_vacs_25_09_2025").parentElement;
const data = await DataExtractor.init();
// const config = ConfigCreate.create(data);

console.log("app DATA", data);
// console.log("app CONFIG", config);

// ConfigBuild.build(config, parent);
// ApplyStyles.style(config, styles);
