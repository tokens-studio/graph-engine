import { dirname } from "path";
import { fileURLToPath } from "url";
import { minimizeFlowGraph } from "../src/core.js";
import fs from "fs/promises";
import glob from "glob";
import path from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const process = async () => {
  const values = glob.sync("**/*.json", {
    cwd: path.join(__dirname, "./data/raw"),
  });

  await Promise.all(
    values.map(async (x) => {
      const value = await fs.readFile(path.join(__dirname, "./data/raw/" + x));
      const parsed = JSON.parse(value.toString());
      await fs.writeFile(
        path.join(__dirname, "./data/processed/" + x),
        JSON.stringify(minimizeFlowGraph(parsed), null, 4),
      );
    }),
  );

  console.log(`Processed ${values.length} files`);
};
process();
