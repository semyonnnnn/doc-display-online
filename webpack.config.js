import { CMS_BLOCK_ID } from "./app/utils/key.js";
import path from "path";
import fs from "fs";
import WebpackShellPluginNext from "webpack-shell-plugin-next";
import webpack from "webpack";

const outputDir = path.resolve(process.cwd(), "build");
const bundleFilename = "prod.js";
const txtFilename = "prod.txt";

const isDev = process.env.NODE_ENV === "development";

export default {
  mode: isDev ? "development" : "production",
  entry: "./app/app.js",
  output: {
    path: outputDir,
    filename: bundleFilename,
    library: {
      type: "module",
    },
  },
  experiments: {
    topLevelAwait: true,
  },
  resolve: {
    alias: {
      // xlsx: path.resolve(process.cwd(), "node_modules/xlsx/xlsx.js"),
    },
    extensions: [".js", ".mjs", ".json"],
  },
  externals: {},
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
  optimization: {
    splitChunks: false,
  },
};
