import { ConfigBuild } from "/app/ConfigBuild.js";
import { PrettyStyles } from "/app/PrettyStyles.js";
import { config } from "/app/config.js";
import * as styles from "/app/styles/styles.js";
import { DataExtractor } from "./DataExtractor.js";

const parent = document.getElementById("script_vacs_25_09_2025").parentElement;

ConfigBuild.build(config, parent);
PrettyStyles.style(config, styles);

const thing = await DataExtractor.getRawJSON();

console.log(thing);
