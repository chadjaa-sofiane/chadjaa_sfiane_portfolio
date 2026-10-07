// Rebuilds the 3D hero assets from scripts/blender/*_scene.py.
//
//   bun run hero:3d                  home hero: GLB + posters
//   bun run hero:3d --no-posters
//   bun run hero:3d --projects       /projects hero (projects_scene.py)
//
// Needs `blender` on PATH (in WSL: the ~/.local/bin/blender shim that forwards
// to the Windows build) and network access for the first gltf-transform run.
// Raw Blender output and the .blend file land in .cache/hero-3d for inspection.
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "public/3d");
const posters = !process.argv.includes("--no-posters");
const projects = process.argv.includes("--projects");
// name: GLB and cache folder; stills: Blender poster name -> published webp name.
const target = projects
  ? { name: "projects", script: "projects_scene.py", posterFlag: "--poster",
      stills: { poster: "projects-poster" } }
  : { name: "hero", script: "hero_scene.py", posterFlag: "--posters",
      stills: Object.fromEntries(["hero", "backend", "frontend", "ml", "devops"]
        .map((role) => [`poster-${role}`, `poster-${role}`])) };
const cache = path.join(root, `.cache/${target.name}-3d`);

const run = (cmd, args) => {
  console.log(`> ${cmd} ${args.join(" ")}`);
  const result = spawnSync(cmd, args, { cwd: root, stdio: "inherit" });
  if (result.status !== 0) throw new Error(`${cmd} exited with ${result.status}`);
};

fs.mkdirSync(cache, { recursive: true });
fs.mkdirSync(out, { recursive: true });

run("blender", [
  // Without --python-exit-code a Python error still exits 0 and the steps
  // below would quietly package the previous build.
  "-b", "--factory-startup", "--python-exit-code", "1",
  "--python", `scripts/blender/${target.script}`, "--",
  "--out", cache,
  "--blend", path.join(cache, `${target.name}.blend`),
  ...(posters ? [target.posterFlag] : []),
]);

// weld merges the duplicate vertices left by applied bevels; meshopt quantizes
// and compresses. Both keep node names, hierarchy and animation intact, which
// the client depends on (role_<id> groups, one clip per role).
const gltf = ["-y", "@gltf-transform/cli@4"];
const welded = path.join(cache, `${target.name}.welded.glb`);
run("npx", [...gltf, "weld", path.join(cache, `${target.name}.glb`), welded]);
run("npx", [...gltf, "meshopt", welded, path.join(out, `${target.name}.glb`), "--level", "medium"]);

// Posters keep the camera's full frame (no trimming): drawn with
// object-fit: contain they line up exactly with the live canvas, which keeps
// the same framing at any aspect ratio (see HeroScene's fitCamera).
if (posters) {
  for (const [still, published] of Object.entries(target.stills)) {
    await sharp(path.join(cache, `${still}.png`))
      .resize({ width: 1200 })
      .webp({ quality: 82, alphaQuality: 90, effort: 6 })
      .toFile(path.join(out, `${published}.webp`));
  }
}

for (const file of fs.readdirSync(out)) {
  console.log(`${file.padEnd(24)} ${(fs.statSync(path.join(out, file)).size / 1024).toFixed(0)} KB`);
}
