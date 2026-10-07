// Hand-drawn diagrams for the featured project, rendered with Excalidraw in the
// same ink, palette and Excalifont as the card sketches.
//
//   bun run diagrams
//
// Writes public/diagrams/<name>{,-mobile}.svg plus the .excalidraw source next
// to each (open at excalidraw.com to tweak, then port the change back here).
// Coordinates are in the drawing's own pixels; every scene carries an invisible
// bounds rectangle so the exported viewBox is exactly the size listed below.
const fs = require("node:fs");
const path = require("node:path");
const { createRequire } = require("node:module");

const toolPath = process.env.PATH.split(path.delimiter).find((entry) =>
  entry.includes("_npx") && entry.endsWith("/.bin"),
);
if (!toolPath) throw new Error("Run this script with `bun run diagrams`.");
const toolRequire = createRequire(path.join(toolPath, "..", "package.json"));
const { build } = toolRequire("esbuild");
const { chromium } = toolRequire("playwright");
const outputDir = path.resolve(__dirname, "../public/diagrams");

// Same palette as scripts/export-card-sketches.cjs.
const INK = "#8f9aa3";
const PAPER = "#e8dfd0";
const MUTED = "#aab3ba";
const COPPER = "#db7b3c";
const TEAL = "#2bb5a3";
const SAGE = "#87b3aa";
const VIOLET = "#9b86e0";
const GOLD = "#d7b48c";
const HAND = 5; // Excalifont

const BOX_W = 160;
const BOX_H = 84;

function sceneBuilder(width, height) {
  let seed = 300;
  const elements = [];
  const add = (type, props) => {
    seed += 1;
    elements.push({
      id: `diagram-${seed}`, type, x: 0, y: 0, width: 0, height: 0, angle: 0,
      strokeColor: INK, backgroundColor: "transparent", fillStyle: "hachure",
      strokeWidth: 1.5, strokeStyle: "solid", roughness: 1, opacity: 100,
      groupIds: [], frameId: null, roundness: null, seed, version: 1, versionNonce: seed,
      isDeleted: false, boundElements: null, updated: 1, link: null, locked: false,
      ...props,
    });
  };
  add("rectangle", { x: 0, y: 0, width, height, strokeColor: "transparent", roughness: 0, strokeWidth: 1 });

  const s = {
    width, height, elements,
    line: (points, props = {}, type = "line") => {
      const [x0, y0] = points[0];
      const rel = points.map(([x, y]) => [x - x0, y - y0]);
      const xs = rel.map(([x]) => x);
      const ys = rel.map(([, y]) => y);
      add(type, {
        x: x0, y: y0, points: rel,
        width: Math.max(...xs) - Math.min(...xs), height: Math.max(...ys) - Math.min(...ys),
        startBinding: null, endBinding: null, startArrowhead: null,
        endArrowhead: type === "arrow" ? "arrow" : null, elbowed: false,
        roundness: points.length > 2 ? { type: 2 } : null, ...props,
      });
    },
    arrow: (points, props = {}) => s.line(points, { strokeColor: INK, ...props }, "arrow"),
    async: (points, props = {}) => s.arrow(points, { strokeStyle: "dashed", ...props }),
    text: (value, x, y, size, color = PAPER, props = {}) => add("text", {
      x, y, width: value.length * size * 0.52, height: size * 1.25,
      text: value, originalText: value, fontSize: size, fontFamily: HAND,
      textAlign: "left", verticalAlign: "top", containerId: null, autoResize: true,
      lineHeight: 1.25, strokeColor: color, roughness: 0, ...props,
    }),
    /** A labelled box: a hachured accent smudge under a sketched outline. */
    node: (x, y, label, detail, accent, { w = BOX_W, h = BOX_H } = {}) => {
      add("rectangle", { x: x + 7, y: y + 7, width: w, height: h, strokeColor: "transparent",
        backgroundColor: accent, fillStyle: "hachure", opacity: 75, roughness: 1.4, strokeWidth: 1.2 });
      add("rectangle", { x, y, width: w, height: h, strokeColor: PAPER, strokeWidth: 1.6,
        roughness: 1.1, roundness: { type: 3 }, backgroundColor: "#141b21", fillStyle: "solid" });
      s.text(label, x + 16, y + (detail ? 14 : h / 2 - 13), 21);
      if (detail) s.text(detail, x + 16, y + 48, 14, MUTED);
    },
  };
  return s;
}

/* ── Production architecture ─────────────────────────────────────────── */

function architecture(mobile) {
  if (!mobile) {
    const s = sceneBuilder(900, 440);
    const at = { client: [20, 170], proxy: [245, 170], identity: [480, 20], api: [480, 170],
      sql: [720, 20], tsdb: [720, 170], broker: [480, 320], devices: [720, 320] };
    s.arrow([[186, 212], [236, 212]]);
    s.arrow([[411, 212], [471, 212]]);
    s.arrow([[325, 164], [360, 80], [471, 62]]);
    s.arrow([[646, 194], [680, 110], [712, 62]]);
    s.arrow([[646, 216], [712, 216]]);
    s.async([[560, 260], [560, 312]]);
    s.async([[646, 366], [712, 366]]);
    s.text("MQTT", 656, 336, 15, GOLD);
    nodes(s, at);
    legend(s, 20, 392);
    return s;
  }
  const s = sceneBuilder(440, 640);
  const at = { client: [20, 20], proxy: [240, 20], identity: [20, 170], api: [240, 170],
    sql: [20, 320], tsdb: [240, 320], devices: [20, 470], broker: [240, 470] };
  s.arrow([[188, 62], [232, 62]]);
  s.arrow([[320, 112], [320, 162]]);
  s.arrow([[270, 112], [190, 134], [110, 162]]);
  s.arrow([[270, 262], [190, 284], [110, 312]]);
  s.arrow([[320, 262], [320, 312]]);
  s.async([[410, 212], [430, 300], [430, 420], [416, 512]]);
  s.async([[234, 516], [190, 516]]);
  s.text("MQTT", 192, 486, 13, GOLD);
  nodes(s, at);
  legend(s, 20, 596);
  return s;
}

function nodes(s, at) {
  s.node(...at.client, "Client", "web interface", SAGE);
  s.node(...at.proxy, "Nginx", "reverse proxy", SAGE);
  s.node(...at.identity, "Identity", "authentication", TEAL);
  s.node(...at.api, "API", "application services", TEAL);
  s.node(...at.sql, "Postgres", "relational data", COPPER);
  s.node(...at.tsdb, "Metrics", "time-series data", COPPER);
  s.node(...at.broker, "Broker", "messages & events", VIOLET);
  s.node(...at.devices, "Devices", "connected hardware", VIOLET);
}

function legend(s, x, y) {
  s.line([[x, y + 10], [x + 46, y + 10]], { strokeStyle: "dashed", strokeColor: INK });
  s.text("async messages", x + 58, y, 15, MUTED);
}

/* ── Role and permission model ──────────────────────────────────────── */

function permissions(mobile) {
  const chain = [["User", VIOLET], ["Role", TEAL], ["Permission", SAGE], ["Resource", COPPER]];
  const verbs = ["has", "grants", "on"];
  if (!mobile) {
    const s = sceneBuilder(780, 250);
    const xs = [20, 230, 440, 650];
    const w = 130;
    chain.forEach(([label, accent], i) => s.node(xs[i], 30, label, null, accent, { w, h: 70 }));
    verbs.forEach((verb, i) => {
      const a = xs[i] + w + 12;
      const b = xs[i + 1] - 8;
      s.arrow([[a, 65], [b, 65]]);
      s.text(verb, (a + b) / 2 - verb.length * 3.9, 38, 15, MUTED);
    });
    s.arrow([[388, 196], [450, 176], [500, 112]], { strokeColor: GOLD, strokeWidth: 1.2 });
    s.text("every check resolves through a permission", 20, 186, 17, GOLD);
    s.text("super-admin can't be assigned to anyone", 20, 216, 15, MUTED);
    return s;
  }
  const s = sceneBuilder(400, 330);
  const at = [[20, 20], [240, 20], [240, 150], [20, 150]];
  chain.forEach(([label, accent], i) => s.node(...at[i], label, null, accent, { w: 140, h: 70 }));
  s.arrow([[166, 55], [232, 55]]);
  s.text(verbs[0], 184, 28, 14, MUTED);
  s.arrow([[310, 96], [310, 142]]);
  s.text(verbs[1], 320, 108, 14, MUTED);
  s.arrow([[234, 185], [168, 185]]);
  s.text(verbs[2], 192, 158, 14, MUTED);
  s.text("every check resolves", 20, 254, 17, GOLD);
  s.text("through a permission", 20, 276, 17, GOLD);
  s.text("super-admin can't be assigned", 20, 306, 14, MUTED);
  return s;
}

/* ── Device control path ────────────────────────────────────────────── */

function deviceSync(mobile) {
  if (!mobile) {
    const s = sceneBuilder(780, 210);
    const xs = [20, 310, 600];
    s.node(xs[0], 50, "Devices", "sensors & relays", VIOLET);
    s.node(xs[1], 50, "Broker", "MQTT topics", VIOLET);
    s.node(xs[2], 50, "Service", "API & rules", TEAL);
    [0, 1].forEach((i) => {
      const a = xs[i] + BOX_W + 10;
      const b = xs[i + 1] - 10;
      s.arrow([[a, 74], [b, 74]]);
      s.async([[b, 116], [a, 116]], { strokeColor: GOLD });
    });
    s.text("telemetry", 200, 44, 16, MUTED);
    s.text("commands", 202, 126, 16, GOLD);
    s.text("telemetry", 490, 44, 16, MUTED);
    s.text("commands", 492, 126, 16, GOLD);
    return s;
  }
  const s = sceneBuilder(400, 480);
  const ys = [20, 190, 360];
  s.node(120, ys[0], "Service", "API & rules", TEAL);
  s.node(120, ys[1], "Broker", "MQTT topics", VIOLET);
  s.node(120, ys[2], "Devices", "sensors & relays", VIOLET);
  [0, 1].forEach((i) => {
    const top = ys[i] + BOX_H + 10;
    const bottom = ys[i + 1] - 10;
    s.arrow([[160, bottom], [160, top]]);
    s.async([[240, top], [240, bottom]], { strokeColor: GOLD });
    s.text("telemetry", 46, top + 20, 15, MUTED);
    s.text("commands", 252, top + 20, 15, GOLD);
  });
  return s;
}

const scenes = {
  "production-architecture": architecture,
  "permission-model": permissions,
  "device-sync": deviceSync,
};

(async () => {
  const bundle = await build({
    stdin: {
      contents: `
        import { restoreElements, exportToSvg } from '@excalidraw/excalidraw';
        window.renderDiagram = async (elements) => {
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
    fs.mkdirSync(outputDir, { recursive: true });
    for (const [base, make] of Object.entries(scenes)) {
      for (const mobile of [false, true]) {
        const scene = make(mobile);
        const result = await page.evaluate((elements) => window.renderDiagram(elements), scene.elements);
        const name = `${base}${mobile ? "-mobile" : ""}`;
        fs.writeFileSync(path.join(outputDir, `${name}.svg`), result.svg);
        fs.writeFileSync(path.join(outputDir, `${name}.excalidraw`), JSON.stringify({
          type: "excalidraw", version: 2, source: "https://excalidraw.com",
          elements: result.elements, appState: { viewBackgroundColor: "#121a21" }, files: {},
        }, null, 2));
        const box = result.svg.match(/viewBox="([^"]+)"/)?.[1];
        console.log(`${name.padEnd(32)} viewBox ${box}  ${(result.svg.length / 1024).toFixed(1)} KB`);
      }
    }
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
