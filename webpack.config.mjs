// webpack.config.mjs
import { CMS_BLOCK_ID } from "./app/utils/key.js";
import path from "path";
import fs from "fs";
import WebpackShellPluginNext from "webpack-shell-plugin-next";
import { fileURLToPath } from "url";
import { dirname } from "path";
import webpack from "webpack";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const outputDir = path.resolve(__dirname, "build");
const bundleFilename = "prod.js";
const txtFilename = "prod.txt";

const isDev = process.env.NODE_ENV === "development";

export default {
  mode: isDev ? "development" : "production",
  entry: "./app/app.js",
  output: {
    path: outputDir,
    filename: bundleFilename,
  },
  resolve: {
    alias: isDev
      ? {}
      : {
          xlsx: path.resolve(__dirname, "node_modules/xlsx/xlsx.mjs"),
        },
    extensions: [".js", ".mjs", ".json"],
  },
  externals:
    process.env.NODE_ENV === "development"
      ? {
          xlsx: "XLSX", // Treat as external in dev
        }
      : {},
  module: {
    rules: [
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto",
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(
        process.env.NODE_ENV || "production"
      ),
    }),
    new WebpackShellPluginNext({
      onBuildEnd: {
        scripts: [
          () => {
            const bundlePath = path.join(outputDir, bundleFilename);
            let code = fs.readFileSync(bundlePath, "utf8");

            // Add CDN script in development
            if (isDev) {
              code = `<!-- Development mode using XLSX CDN -->
<script src="https://cdn.sheetjs.com/xlsx-0.18.5/package/dist/xlsx.full.min.js"></script>
${code}`;
            }

            const wrapped = `<script id="${CMS_BLOCK_ID}">\n${code}\n</script>`;
            fs.writeFileSync(
              path.join(outputDir, txtFilename),
              wrapped,
              "utf8"
            );
            console.log(
              `Generated ${txtFilename} with <script id="${CMS_BLOCK_ID}">...`
            );
          },
        ],
        blocking: true,
        parallel: false,
      },
    }),
  ],
};
