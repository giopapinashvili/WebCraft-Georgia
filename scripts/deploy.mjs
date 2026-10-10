// Uploads the WebCraft Georgia site to Cloudflare Pages (webcraftgeorgia.pages.dev).
// Double-click upload-to-cloudflare.cmd, or run `node scripts/deploy.mjs`.
// Only the website files go online; git data, zips, these scripts and the
// social-media images stay on the computer.
import { spawn } from "node:child_process";
import { mkdtemp, mkdir, cp, rm, readdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const PROJECT = "webcraftgeorgia";
const WRANGLER = "wrangler@4.149.0";
const site = fileURLToPath(new URL("..", import.meta.url));
const SKIP = new Set(["scripts", "node_modules", "upload-to-cloudflare.cmd", "social-webcraft-post.html", "webcraft-social-post-1080.png", "README.md"]);
const skip = (name) => SKIP.has(name) || name.startsWith(".") || name.toLowerCase().endsWith(".zip");

function run(command, args, cwd) {
  return new Promise((done, fail) => {
    const child = spawn(command, args, { cwd, stdio: "inherit", shell: process.platform === "win32", env: { ...process.env, WRANGLER_SEND_METRICS: "false" } });
    child.on("error", fail);
    child.on("exit", (code) => (code === 0 ? done() : fail(new Error("ატვირთვა ვერ მოხერხდა. შეცდომა ზემოთაა."))));
  });
}

async function main() {
  process.stdout.write("\nWebCraft Georgia — საიტის ატვირთვა Cloudflare-ზე\n\n");
  const root = await mkdtemp(join(tmpdir(), "webcraft-"));
  const dist = join(root, "site");
  await mkdir(dist);
  try {
    for (const entry of await readdir(site, { withFileTypes: true })) {
      if (skip(entry.name)) continue;
      await cp(join(site, entry.name), join(dist, entry.name), { recursive: true });
    }
    process.stdout.write("თუ ბრაუზერი გაიხსნება და Cloudflare დასტურს გთხოვს, დააჭირე Allow.\n\n");
    await run("npx", ["--yes", WRANGLER, "pages", "deploy", JSON.stringify(dist), "--project-name", PROJECT, "--branch", "main", "--commit-dirty=true"], root);
    process.stdout.write("\nმზადაა! საიტი: https://webcraftgeorgia.pages.dev\n");
  } finally {
    await rm(root, { recursive: true, force: true }).catch(() => {});
  }
}

main().catch((error) => {
  process.stderr.write("\n" + (error.message || error) + "\n");
  process.exitCode = 1;
});
