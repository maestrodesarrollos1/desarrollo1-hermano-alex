import { appendFileSync, copyFileSync, existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";
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

const localServerEnvPath = resolve(rootDir, ".server.env");
if (existsSync(localServerEnvPath)) {
  const source = readFileSync(localServerEnvPath, "utf8");
  const readSetting = (key) => source.match(new RegExp(`^${key}\\s*=\\s*["']?([^\\r\\n"']+)["']?\\s*$`, "m"))?.[1]?.trim();
  const password = readSetting("WEDDING_TEMPLATE_MODERATION_PASSWORD");
  const notificationEmail = readSetting("WEDDING_RSVP_NOTIFY_EMAIL");
  const environmentLines = [];

  if (password) {
    if (!/^[A-Za-z0-9+/_=-]+$/.test(password)) {
      throw new Error("WEDDING_TEMPLATE_MODERATION_PASSWORD contiene caracteres no permitidos.");
    }
    environmentLines.push(`  SetEnv WEDDING_TEMPLATE_MODERATION_PASSWORD "${password}"`);
  }

  if (notificationEmail) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(notificationEmail)) {
      throw new Error("WEDDING_RSVP_NOTIFY_EMAIL no contiene un correo válido.");
    }
    environmentLines.push(`  SetEnv WEDDING_RSVP_NOTIFY_EMAIL "${notificationEmail}"`);
  }

  if (environmentLines.length) {
    appendFileSync(
      resolve(rootDir, "dist/.htaccess"),
      `\n<IfModule mod_env.c>\n${environmentLines.join("\n")}\n</IfModule>\n`,
    );
  }
}

// Runtime records live in the server-only _private directory. Do not include
// legacy runtime files in dist, so SFTP updates cannot overwrite live data.
rmSync(resolve(rootDir, "dist/_messages"), { recursive: true, force: true });
