import fs from "fs";
import path from "path";

const dataPath = path.resolve(process.cwd(), "public/menu.tsv");
const tsv = fs.readFileSync(dataPath, "utf8");

// Parse TSV (using simple split) or use Papa in frontend as before
const lines = tsv.trim().split("\n");
const headers = lines[0].split("\t");
export const items = lines.slice(1).map((line) => {
  const cols = line.split("\t");
  const obj: Record<string, string> = {};
  headers.forEach((h, i) => (obj[h.trim()] = (cols[i] || "").trim()));
  return obj;
});
