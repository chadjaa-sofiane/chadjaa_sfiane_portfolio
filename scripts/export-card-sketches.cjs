// Hand-drawn chrome for the project cards, rendered with Excalidraw.
//
//   bun run sketches
//
// Writes public/sketches/*.svg (what the site serves) and
// assets/excalidraw/*.excalidraw (open these at excalidraw.com to edit, then
// port the change back here). Coordinates below are in the SVG's own pixels:
// every scene carries an invisible bounds rectangle so the exported viewBox
// is exactly FRAME_W x FRAME_H, which is what lets the screenshot be placed
// under the frame's "screen" by percentages (see SCREEN, and CardImage.tsx).
const fs = require("node:fs");
const path = require("node:path");
const { createRequire } = require("node:module");

const toolPath = process.env.PATH.split(path.delimiter).find((entry) =>
  entry.includes("_npx") && entry.endsWith("/.bin"),
);
if (!toolPath) throw new Error("Run this script with `bun run sketches`.");
const toolRequire = createRequire(path.join(toolPath, "..", "package.json"));
const { build } = toolRequire("esbuild");
const { chromium } = toolRequire("playwright");

const root = path.resolve(__dirname, "..");
const publicDir = path.join(root, "public/sketches");
const sourceDir = path.join(root, "assets/excalidraw");

const FRAME_W = 420;
const FRAME_H = 260;
// Keep in sync with SCREEN in components/Card/CardImage.tsx.
const SCREEN = { x: 10, y: 40, w: 400, h: 212 };

const INK = "#8f9aa3";
const PAPER = "#e8dfd0";
const COPPER = "#db7b3c";
const TEAL = "#2bb5a3";
const SAGE = "#87b3aa";
const VIOLET = "#9b86e0";
const HAND = 5; // Excalifont

function sceneBuilder(width, height) {
  let seed = 100;
  const elements = [];
  const add = (type, props) => {
    seed += 1;
    elements.push({
      id: `sketch-${seed}`, type, x: 0, y: 0, width: 0, height: 0, angle: 0,
      strokeColor: INK, backgroundColor: "transparent", fillStyle: "hachure",
      strokeWidth: 1.5, strokeStyle: "solid", roughness: 1, opacity: 100,
      groupIds: [], frameId: null, roundness: null, seed, version: 1, versionNonce: seed,
      isDeleted: false, boundElements: null, updated: 1, link: null, locked: false,
      ...props,
    });
  };
  // Pins the export bounds; drawn in a transparent colour.
  add("rectangle", { x: 0, y: 0, width, height, strokeColor: "transparent", roughness: 0, strokeWidth: 1 });

  const api = {
    elements,
    rect: (x, y, w, h, props = {}) => add("rectangle", { x, y, width: w, height: h, roundness: { type: 3 }, ...props }),
    ellipse: (x, y, w, h, props = {}) => add("ellipse", { x, y, width: w, height: h, ...props }),
    diamond: (x, y, w, h, props = {}) => add("diamond", { x, y, width: w, height: h, ...props }),
    line: (points, props = {}, type = "line") => {
      const [x0, y0] = points[0];
      const rel = points.map(([x, y]) => [x - x0, y - y0]);
      const xs = rel.map(([x]) => x);
      const ys = rel.map(([, y]) => y);
      add(type, {
        x: x0, y: y0, points: rel,
        width: Math.max(...xs) - Math.min(...xs), height: Math.max(...ys) - Math.min(...ys),
        startBinding: null, endBinding: null, startArrowhead: null,
        endArrowhead: type === "arrow" ? "arrow" : null, elbowed: false, ...props,
      });
    },
    arrow: (points, props = {}) => api.line(points, props, "arrow"),
    text: (value, x, y, size, color = PAPER, props = {}) => add("text", {
      x, y, width: value.length * size * 0.52, height: size * 1.25,
      text: value, originalText: value, fontSize: size, fontFamily: HAND,
      textAlign: "left", verticalAlign: "top", containerId: null, autoResize: true,
      lineHeight: 1.25, strokeColor: color, roughness: 0, ...props,
    }),
  };
  return api;
}

/** Window chrome around the screenshot: title bar, traffic lights, label. */
function frame({ label, accent, glyph }) {
  const s = sceneBuilder(FRAME_W, FRAME_H);
  s.rect(10, 8, FRAME_W - 20, 26, { strokeColor: "transparent", backgroundColor: accent, fillStyle: "hachure",
    strokeWidth: 1, opacity: 55, roughness: 1.4, roundness: null });
  s.rect(4, 4, FRAME_W - 8, FRAME_H - 8, { strokeWidth: 2, roughness: 1.1 });
  s.line([[4, 36], [FRAME_W - 4, 36]], { strokeWidth: 1.5, roughness: 1.2 });
  [COPPER, SAGE, TEAL].forEach((color, i) =>
    s.ellipse(14 + i * 16, 14, 10, 10, { strokeColor: color, backgroundColor: color, fillStyle: "solid", roughness: 0.6 }));
  s.text(label, 72, 9, 15);
  glyph(s);
  return s;
}

const FRAMES = {
  website: frame({
    label: "live site",
    accent: TEAL,
    glyph: (s) => {
      // A little url bar with a sketched arrow out to the right.
      s.rect(150, 11, 170, 18, { strokeColor: INK, strokeWidth: 1, roughness: 1.2 });
      s.text("https://", 158, 12, 12, "#aab3ba");
      s.arrow([[372, 27], [398, 13]], { strokeColor: PAPER, strokeWidth: 1.5, roughness: 1.2 });
    },
  }),
  ml: frame({
    label: "model.ipynb",
    accent: VIOLET,
    glyph: (s) => {
      // A loss curve drawn on the title bar.
      s.line([[300, 12], [312, 22], [326, 26], [344, 28], [366, 29], [398, 29.5]],
        { strokeColor: PAPER, strokeWidth: 1.5, roughness: 0.8, roundness: { type: 2 } });
      s.line([[296, 10], [296, 31], [400, 31]], { strokeColor: INK, strokeWidth: 1, roughness: 0.8 });
    },
  }),
  other: frame({
    label: "side project",
    accent: COPPER,
    glyph: (s) => {
      s.diamond(352, 10, 18, 18, { strokeColor: PAPER, strokeWidth: 1.5 });
      s.ellipse(378, 10, 18, 18, { strokeColor: PAPER, strokeWidth: 1.5 });
    },
  }),
};

/** Shown inside the screen when a project has no screenshot. */
const s0 = SCREEN;
const PLACEHOLDERS = {
  website: () => {
    const s = sceneBuilder(FRAME_W, FRAME_H);
    s.rect(s0.x + 16, s0.y + 14, s0.w - 32, 64, { backgroundColor: TEAL, opacity: 70 });
    s.line([[s0.x + 34, s0.y + 38], [s0.x + 180, s0.y + 38]], { strokeColor: PAPER, strokeWidth: 3 });
    s.line([[s0.x + 34, s0.y + 56], [s0.x + 130, s0.y + 56]], { strokeColor: PAPER, strokeWidth: 2 });
    for (let i = 0; i < 3; i += 1) {
      const x = s0.x + 16 + i * 126;
      s.rect(x, s0.y + 92, 116, 102, { backgroundColor: i === 1 ? COPPER : "transparent", opacity: i === 1 ? 60 : 100 });
      s.line([[x + 12, s0.y + 164], [x + 84, s0.y + 164]], { strokeColor: PAPER });
      s.line([[x + 12, s0.y + 178], [x + 60, s0.y + 178]], { strokeColor: INK });
    }
    return s;
  },
  ml: () => {
    const s = sceneBuilder(FRAME_W, FRAME_H);
    const layers = [[70, 120, 170], [60, 100, 140, 180], [100, 140]];
    const xs = [s0.x + 40, s0.x + 120, s0.x + 200];
    for (let l = 0; l < 2; l += 1)
      for (const a of layers[l]) for (const b of layers[l + 1])
        s.line([[xs[l] + 10, s0.y + a - 30], [xs[l + 1] + 10, s0.y + b - 30]], { strokeColor: INK, strokeWidth: 1, roughness: 0.7 });
    layers.forEach((ys, l) => ys.forEach((y) => s.ellipse(xs[l], s0.y + y - 40, 20, 20,
      { strokeColor: PAPER, backgroundColor: [PAPER, VIOLET, TEAL][l], fillStyle: l === 0 ? "hachure" : "solid" })));
    s.line([[s0.x + 260, s0.y + 30], [s0.x + 260, s0.y + 170], [s0.x + 380, s0.y + 170]], { strokeWidth: 1.5 });
    s.line([[s0.x + 266, s0.y + 44], [s0.x + 284, s0.y + 108], [s0.x + 306, s0.y + 136], [s0.x + 336, s0.y + 150], [s0.x + 376, s0.y + 156]],
      { strokeColor: COPPER, strokeWidth: 2.5, roundness: { type: 2 } });
    s.text("loss", s0.x + 330, s0.y + 118, 14, COPPER);
    return s;
  },
  other: () => {
    const s = sceneBuilder(FRAME_W, FRAME_H);
    s.ellipse(s0.x + 34, s0.y + 50, 96, 96, { backgroundColor: TEAL, opacity: 70 });
    s.arrow([[s0.x + 142, s0.y + 98], [s0.x + 206, s0.y + 98]], { strokeColor: PAPER, strokeWidth: 2 });
    s.diamond(s0.x + 218, s0.y + 44, 110, 110, { backgroundColor: COPPER, opacity: 65 });
    s.text("idea", s0.x + 58, s0.y + 86, 20);
    s.text("build", s0.x + 246, s0.y + 86, 20);
    return s;
  },
};

/** Card outline, used as a CSS mask so its colour can still transition. */
function outline() {
  const s = sceneBuilder(420, 540);
  s.rect(3, 3, 414, 534, { strokeColor: "#ffffff", strokeWidth: 2, roughness: 1.3, roundness: { type: 3 } });
  return s;
}

/** Scribbled underline revealed under the card title on hover. */
function underline() {
  const s = sceneBuilder(220, 14);
  s.line([[4, 9], [70, 6], [150, 8], [216, 5]], { strokeColor: "#ffffff", strokeWidth: 3, roughness: 2.2, roundness: { type: 2 } });
  return s;
}

const scenes = {
  ...Object.fromEntries(Object.entries(FRAMES).map(([k, s]) => [`frame-${k}`, s])),
  ...Object.fromEntries(Object.entries(PLACEHOLDERS).map(([k, make]) => [`placeholder-${k}`, make()])),
  "card-outline": outline(),
  "title-underline": underline(),
};
// Stretchable masks: the outline has to follow the card's real size.
const STRETCH = new Set(["card-outline", "title-underline"]);

(async () => {
  const bundle = await build({
    stdin: {
      contents: `
        import { restoreElements, exportToSvg } from '@excalidraw/excalidraw';
        window.renderSketch = async (elements) => {
          const restored = restoreElements(elements, null, { refreshDimensions: true });
          const svg = await exportToSvg({
            elements: restored, files: {}, exportPadding: 0,
            appState: { exportBackground: false, exportWithDarkMode: false, exportEmbedScene: false },
          });
          return { svg: svg.outerHTML, elements: restored };
        };`,
      resolveDir: path.resolve(toolPath, ".."),
    },
    bundle: true, write: false, format: "iife", platform: "browser",
    define: { "process.env.NODE_ENV": '"production"' }, loader: { ".css": "empty" }, logLevel: "silent",
  });
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.setContent("<!doctype html><html><body></body></html>");
    await page.addScriptTag({ content: bundle.outputFiles[0].text });
    fs.mkdirSync(publicDir, { recursive: true });
    fs.mkdirSync(sourceDir, { recursive: true });
    for (const [name, scene] of Object.entries(scenes)) {
      const result = await page.evaluate((elements) => window.renderSketch(elements), scene.elements);
      let svg = result.svg;
      if (STRETCH.has(name)) svg = svg.replace("<svg ", '<svg preserveAspectRatio="none" ');
      fs.writeFileSync(path.join(publicDir, `${name}.svg`), svg);
      fs.writeFileSync(path.join(sourceDir, `${name}.excalidraw`), JSON.stringify({
        type: "excalidraw", version: 2, source: "https://excalidraw.com",
        elements: result.elements, appState: { viewBackgroundColor: "#121a21" }, files: {},
      }, null, 2));
      const box = svg.match(/viewBox="([^"]+)"/)?.[1];
      console.log(`${name.padEnd(22)} viewBox ${box}  ${(svg.length / 1024).toFixed(1)} KB`);
    }
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
