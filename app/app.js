import { DataExtractor } from "/app/DataExtractor.js";
import { ConfigBuild } from "/app/ConfigBuild.js";

import * as styles from "/app/styles/styles.js";
import { ApplyStyles } from "/app/ApplyStyles.js";

import { Interactivity } from "/app/Interactivity.js";

const parent = document.getElementById("script_vacs_25_09_2025").parentElement;
const config = await DataExtractor.init();

ConfigBuild.build(config, parent);
ApplyStyles.style(config, styles);
Interactivity.interact(config);
