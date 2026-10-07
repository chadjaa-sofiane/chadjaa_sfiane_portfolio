import { useEffect, useRef } from "react";
import type { ActiveSeason } from "./SeasonalEffects";

/**
 * One full-screen canvas, four different behaviours rather than four colours
 * of the same falling dot:
 *   winter  snow at three depths, the far layer small, slow and faint
 *   spring  cherry petals tumbling on gusts of wind
 *   summer  fireflies that wander and blink instead of falling
 *   autumn  large leaves swinging down like pendulums
 * Everything shies away from the cursor a little.
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  depth: number; // 0 far .. 1 near
  phase: number;
  spin: number;
  angle: number;
  color: string;
  kind: number;
}

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const pick = <T,>(items: readonly T[]) => items[Math.floor(Math.random() * items.length)];

const PETALS = ["#f6c1d1", "#f2a7bf", "#fbd6e1", "#eea0b8"] as const;
const LEAVES = ["#c4521f", "#d9822b", "#e0a43a", "#9c3d1c", "#b8662a", "#7d4a22"] as const;

/** Particle count for a 1440x900 screen; scaled by area and capped. */
const DENSITY: Record<ActiveSeason, number> = { winter: 120, spring: 38, summer: 30, autumn: 20 };

const spawn = (season: ActiveSeason, w: number, h: number, anywhere: boolean): Particle => {
  const depth = Math.random();
  const p: Particle = {
    x: rand(-40, w + 40),
    y: anywhere ? rand(0, h) : rand(-80, -20),
    vx: 0,
    vy: 0,
    size: 1,
    depth,
    phase: rand(0, Math.PI * 2),
    spin: rand(-1, 1),
    angle: rand(0, Math.PI * 2),
    color: "#fff",
    kind: Math.floor(rand(0, 3)),
  };
  switch (season) {
    case "winter":
      p.size = 0.8 + depth * 2.6;
      p.vy = 0.25 + depth * 0.9;
      break;
    case "spring":
      p.size = 5 + depth * 6;
      p.vy = 0.35 + depth * 0.5;
      p.vx = rand(0.2, 0.7);
      p.color = pick(PETALS);
      break;
    case "summer":
      // Fireflies live in the lower two thirds and never "fall".
      p.y = rand(h * 0.3, h);
      p.size = 2 + depth * 2.2;
      p.vx = rand(-0.3, 0.3);
      p.vy = rand(-0.3, 0.3);
      break;
    case "autumn":
      p.size = 9 + depth * 9;
      p.vy = 0.5 + depth * 0.6;
      p.color = pick(LEAVES);
      break;
  }
  return p;
};

const drawFlake = (ctx: CanvasRenderingContext2D, p: Particle) => {
  ctx.globalAlpha = 0.25 + p.depth * 0.65;
  if (p.size < 2.2) {
    ctx.fillStyle = "#eef4ff";
    ctx.beginPath();
    ctx.arc(0, 0, p.size, 0, Math.PI * 2);
    ctx.fill();
    return;
  }
  ctx.strokeStyle = "#eef4ff";
  ctx.lineWidth = Math.max(0.8, p.size * 0.28);
  ctx.lineCap = "round";
  const r = p.size * 1.5;
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i;
    const cx = Math.cos(a);
    const sy = Math.sin(a);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(cx * r, sy * r);
    // A pair of barbs two thirds of the way out.
    const bx = cx * r * 0.62;
    const by = sy * r * 0.62;
    ctx.moveTo(bx, by);
    ctx.lineTo(bx + Math.cos(a + 0.7) * r * 0.32, by + Math.sin(a + 0.7) * r * 0.32);
    ctx.moveTo(bx, by);
    ctx.lineTo(bx + Math.cos(a - 0.7) * r * 0.32, by + Math.sin(a - 0.7) * r * 0.32);
    ctx.stroke();
  }
};

const drawPetal = (ctx: CanvasRenderingContext2D, p: Particle, t: number) => {
  // Squashing one axis with a cosine reads as the petal flipping over in 3D.
  const flip = Math.cos(t * (1.6 + p.spin) + p.phase);
  ctx.scale(1, 0.35 + Math.abs(flip) * 0.65);
  const s = p.size;
  ctx.globalAlpha = 0.55 + p.depth * 0.4;
  ctx.fillStyle = p.color;
  ctx.beginPath();
  ctx.moveTo(0, s);
  ctx.bezierCurveTo(s * 0.9, s * 0.5, s * 0.75, -s * 0.8, s * 0.2, -s);
  ctx.lineTo(0, -s * 0.72); // the cherry-blossom notch
  ctx.lineTo(-s * 0.2, -s);
  ctx.bezierCurveTo(-s * 0.75, -s * 0.8, -s * 0.9, s * 0.5, 0, s);
  ctx.fill();
  ctx.globalAlpha *= 0.5;
  ctx.fillStyle = "#fff4f7";
  ctx.beginPath();
  ctx.ellipse(0, s * 0.35, s * 0.18, s * 0.4, 0, 0, Math.PI * 2);
  ctx.fill();
};

const drawFirefly = (ctx: CanvasRenderingContext2D, p: Particle, t: number) => {
  // Long dark spells with short bright pulses, each on its own clock.
  const pulse = Math.pow(Math.max(0, Math.sin(t * (0.7 + p.depth * 0.6) + p.phase)), 6);
  const glow = 0.08 + pulse * 0.92;
  const r = p.size * (5 + pulse * 5);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
  g.addColorStop(0, `rgba(240, 255, 170, ${0.55 * glow})`);
  g.addColorStop(0.3, `rgba(190, 235, 90, ${0.22 * glow})`);
  g.addColorStop(1, "rgba(160, 220, 80, 0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 0.35 + glow * 0.65;
  ctx.fillStyle = "#f6ffc8";
  ctx.beginPath();
  ctx.arc(0, 0, p.size * 0.7, 0, Math.PI * 2);
  ctx.fill();
};

const drawLeaf = (ctx: CanvasRenderingContext2D, p: Particle, t: number) => {
  const s = p.size;
  ctx.scale(0.55 + Math.abs(Math.cos(t * 0.9 + p.phase)) * 0.45, 1);
  ctx.globalAlpha = 0.6 + p.depth * 0.35;
  ctx.fillStyle = p.color;
  ctx.beginPath();
  if (p.kind === 0) {
    // Maple: five lobes around the stem.
    for (let i = 0; i <= 10; i++) {
      const a = -Math.PI / 2 + (i / 10) * Math.PI * 2;
      const lobe = i % 2 === 0 ? (i === 4 || i === 6 ? 0.55 : 1) : 0.42;
      const x = Math.cos(a) * s * lobe;
      const y = Math.sin(a) * s * lobe;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
  } else {
    // Oak/birch: a pointed oval.
    ctx.moveTo(0, -s);
    ctx.bezierCurveTo(s * 0.75, -s * 0.5, s * 0.7, s * 0.6, 0, s);
    ctx.bezierCurveTo(-s * 0.7, s * 0.6, -s * 0.75, -s * 0.5, 0, -s);
  }
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha *= 0.55;
  ctx.strokeStyle = "rgba(60, 25, 10, 0.8)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, -s * 0.7);
  ctx.lineTo(0, s * 1.25); // vein runs out into the stem
  ctx.stroke();
};

const SeasonCanvas = ({ season }: { season: ActiveSeason }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let w = 0;
    let h = 0;
    const particles: Particle[] = [];
    const pointer = { x: -9999, y: -9999 };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = Math.round(Math.min(DENSITY[season] * ((w * h) / (1440 * 900)), DENSITY[season] * 1.3));
      const count = Math.max(Math.round(DENSITY[season] * 0.35), target);
      while (particles.length < count) particles.push(spawn(season, w, h, true));
      particles.length = count;
    };
    resize();

    const onPointer = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };
    const onLeave = () => {
      pointer.x = pointer.y = -9999;
    };

    let raf = 0;
    let last = performance.now();
    let t = 0;

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 16.67, 3); // in 60fps frames
      last = now;
      t += dt / 60;
      ctx.clearRect(0, 0, w, h);
      // A slow gust that comes and goes; petals and leaves ride it.
      const gust = Math.max(0, Math.sin(t * 0.35)) ** 3 * 1.6;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Shy away from the cursor.
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 120 * 120 && d2 > 1) {
          const push = (1 - Math.sqrt(d2) / 120) * 0.6 * dt;
          const d = Math.sqrt(d2);
          p.x += (dx / d) * push * 4;
          p.y += (dy / d) * push * 4;
        }

        if (season === "winter") {
          p.x += (Math.sin(t * 0.8 + p.phase) * 0.35 * (0.4 + p.depth)) * dt;
          p.y += p.vy * dt;
        } else if (season === "spring") {
          p.x += (p.vx + gust * (0.5 + p.depth) + Math.sin(t * 1.3 + p.phase) * 0.4) * dt;
          p.y += (p.vy + Math.cos(t * 1.7 + p.phase) * 0.25) * dt;
          p.angle += 0.012 * p.spin * dt + gust * 0.01 * dt;
        } else if (season === "summer") {
          // Wander: steer a little at random, damp, drift slightly upward.
          p.vx += rand(-0.03, 0.03) * dt;
          p.vy += rand(-0.03, 0.028) * dt;
          p.vx *= 0.985;
          p.vy *= 0.985;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          if (p.y < h * 0.2) p.vy += 0.02 * dt;
        } else {
          // Pendulum: the swing drives both the sideways motion and the tilt.
          const swing = Math.sin(t * (1.1 + p.depth * 0.4) + p.phase);
          p.x += (swing * 1.3 + gust * 0.8) * dt;
          p.y += (p.vy * (0.6 + Math.abs(swing) * 0.6)) * dt;
          p.angle = swing * 0.9 + p.spin * 0.3;
        }

        const offscreen = season === "summer"
          ? p.x < -60 || p.x > w + 60 || p.y < -60 || p.y > h + 60
          : p.y > h + 40 || p.x > w + 80 || p.x < -80;
        if (offscreen) {
          particles[i] = spawn(season, w, h, season === "summer");
          if (season !== "summer" && particles[i].x > w * 0.7 && (season === "spring" || gust > 0.5)) {
            // Wind pushes things right, so feed new ones in from the left.
            particles[i].x = rand(-60, w * 0.4);
          }
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(season === "winter" ? t * p.spin * 0.6 : p.angle);
        if (season === "winter") drawFlake(ctx, p);
        else if (season === "spring") drawPetal(ctx, p, t);
        else if (season === "summer") drawFirefly(ctx, p, t);
        else drawLeaf(ctx, p, t);
        ctx.restore();
      }
      raf = requestAnimationFrame(frame);
    };

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [season]);

  return <canvas ref={canvasRef} aria-hidden="true" style={{
    position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 4,
  }} />;
};

export default SeasonCanvas;
