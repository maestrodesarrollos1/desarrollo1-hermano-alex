import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

const rootDir = resolve(process.cwd());
const filesToCopy = [
  ["public/.htaccess", "dist/.htaccess"],
  ["public/404.html", "dist/404.html"],
];

for (const [sourceRelative, targetRelative] of filesToCopy) {
  const sourcePath = resolve(rootDir, sourceRelative);
  const targetPath = resolve(rootDir, targetRelative);

  if (!existsSync(sourcePath)) {
    throw new Error(`Missing required postbuild file: ${sourceRelative}`);
  }

  mkdirSync(dirname(targetPath), { recursive: true });
  copyFileSync(sourcePath, targetPath);
}
