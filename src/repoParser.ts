import fs from "node:fs";
import path from "node:path";

const EXCLUDED_DIRS = ["node_modules", ".git", "dist", ".cache"];
const INCLUDED_EXTENSIONS = [".ts", ".js", ".tsx", ".jsx", ".svelte", ".css", ".scss"];

export async function parseRepository(rootDir: string): Promise<{ [key: string]: string }> {
  const files: { [key: string]: string } = {};

  async function traverse(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        if (!EXCLUDED_DIRS.includes(entry.name)) {
          await traverse(fullPath);
        }
      } else {
        const ext = path.extname(entry.name);
        if (INCLUDED_EXTENSIONS.includes(ext)) {
          const content = fs.readFileSync(fullPath, "utf-8");
          files[fullPath] = content;
        }
      }
    }
  }

  await traverse(rootDir);
  return files;
}
