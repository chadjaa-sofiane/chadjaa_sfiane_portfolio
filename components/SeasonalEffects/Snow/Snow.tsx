import { useEffect, useRef } from "react";
import { Season } from "../SeasonalEffects";

interface Particle {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    opacity: number;
    rotation: number;
    rotationSpeed: number;
    sway: number;
    drift: number;
}

interface Props {
    season: Exclude<Season, "none">;
}

const seasonConfig = {
    winter: { count: 110, color: [255, 255, 255] as const },
    spring: { count: 80, color: [244, 177, 200] as const },
    summer: { count: 64, color: [255, 205, 96] as const },
    autumn: { count: 72, color: [240, 154, 67] as const },
};

const Snow = ({ season }: Props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        const config = seasonConfig[season];
        const isSummer = season === "summer";
        const getParticleSize = () => {
            if (season === "winter") return Math.random() * 3 + 1;
            if (isSummer) return Math.random() * 3.5 + 1.2;
            return Math.random() * 5 + 2;
        };
        const getParticleSpeedY = () => {
            if (season === "winter") return Math.random() * 1 + 0.5;
            if (isSummer) return Math.random() * 0.7 + 0.55;
            return Math.random() * 1.1 + 0.7;
        };

        const particles: Particle[] = Array.from({ length: config.count }).map(() => ({
            x: Math.random() * width,
            y: Math.random() * height,
            size: getParticleSize(),
            speedX: isSummer ? Math.random() * 0.42 - 0.21 : Math.random() * 0.6 - 0.3,
            speedY: getParticleSpeedY(),
            opacity: isSummer ? Math.random() * 0.35 + 0.28 : Math.random() * 0.45 + 0.45,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: Math.random() * 0.02 - 0.01,
            sway: Math.random() * 1.2 + 0.3,
            drift: Math.random() * 0.8 + 0.2,
        }));

        let rafId = 0;
        let tick = 0;

        const drawSnowflake = (p: Particle) => {
            const arms = 6;
            const radius = p.size * 1.35;
            ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
            ctx.lineWidth = Math.max(0.9, p.size * 0.38);
            for (let i = 0; i < arms; i++) {
                const angle = (Math.PI * 2 * i) / arms;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(x, y);
                ctx.stroke();
            }
            ctx.beginPath();
            ctx.arc(0, 0, p.size * 0.45, 0, Math.PI * 2);
            ctx.fill();
        };

        const drawPetal = (p: Particle) => {
            ctx.beginPath();
            ctx.ellipse(0, 0, p.size * 0.72, p.size * 1.18, 0, 0, Math.PI * 2);
            ctx.fill();

            // small inner tint to make petals feel organic
            ctx.fillStyle = "rgba(255, 215, 228, 0.65)";
            ctx.beginPath();
            ctx.ellipse(0, -p.size * 0.08, p.size * 0.32, p.size * 0.46, 0, 0, Math.PI * 2);
            ctx.fill();
        };

        const drawSummerMote = (p: Particle) => {
            const glowRadius = p.size * 2.8;
            const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, glowRadius);
            glow.addColorStop(0, "rgba(255, 238, 168, 0.78)");
            glow.addColorStop(0.42, "rgba(255, 188, 72, 0.28)");
            glow.addColorStop(1, "rgba(255, 188, 72, 0)");

            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(0, 0, glowRadius, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = "rgba(255, 231, 155, 0.5)";
            ctx.lineWidth = Math.max(0.6, p.size * 0.18);
            ctx.beginPath();
            ctx.moveTo(-p.size * 1.4, p.size * 0.55);
            ctx.quadraticCurveTo(-p.size * 0.35, p.size * 0.12, p.size * 0.7, -p.size * 0.35);
            ctx.stroke();

            ctx.fillStyle = "rgba(255, 213, 111, 0.86)";
            ctx.beginPath();
            ctx.ellipse(0, 0, p.size * 0.42, p.size * 0.74, 0, 0, Math.PI * 2);
            ctx.fill();
        };

        const drawLeaf = (p: Particle) => {
            ctx.beginPath();
            ctx.moveTo(0, -p.size * 1.1);
            ctx.bezierCurveTo(
                p.size * 0.9,
                -p.size * 0.7,
                p.size * 0.95,
                p.size * 0.72,
                0,
                p.size * 1.18,
            );
            ctx.bezierCurveTo(
                -p.size * 0.95,
                p.size * 0.72,
                -p.size * 0.9,
                -p.size * 0.7,
                0,
                -p.size * 1.1,
            );
            ctx.fill();

            // center vein
            ctx.strokeStyle = "rgba(112, 51, 15, 0.68)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, -p.size * 0.85);
            ctx.lineTo(0, p.size * 1.05);
            ctx.stroke();
        };

        const drawParticle = (p: Particle) => {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.globalAlpha = p.opacity;
            const [r, g, b] = config.color;
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 1)`;

            if (season === "winter") drawSnowflake(p);
            else if (season === "spring") drawPetal(p);
            else if (season === "summer") drawSummerMote(p);
            else drawLeaf(p);
            ctx.restore();
        };

        const update = () => {
            tick += 0.012;
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.y += p.speedY;
                p.x += p.speedX + Math.sin(tick + i * p.drift) * 0.25 * p.sway;
                p.rotation += p.rotationSpeed;

                if (p.y > height + 12) {
                    p.y = -12;
                    p.x = Math.random() * width;
                }
                if (p.x > width + 18) p.x = -18;
                if (p.x < -18) p.x = width + 18;
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, width, height);
            for (let i = 0; i < particles.length; i++) {
                drawParticle(particles[i]);
            }
            update();
            rafId = requestAnimationFrame(draw);
        };

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener("resize", handleResize);
        rafId = requestAnimationFrame(draw);

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(rafId);
        };
    }, [season]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: 4,
            }}
        />
    );
};

export default Snow;
