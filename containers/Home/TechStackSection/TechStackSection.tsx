import { Section } from "@components/Section";
import { useSectionsProgress } from "@components/SectionsProgress";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  Boxes,
  Braces,
  BrainCircuit,
  CloudCog,
  Container,
  Database,
  Globe,
  KeyRound,
  Layers3,
  MonitorSmartphone,
  Network,
  Server,
  Settings2,
  TerminalSquare,
  Workflow,
  Wrench,
  X,
} from "lucide-react";
import { useMemo, useRef, useState, useEffect } from "react";
import styles from "./TechStackSection.module.scss";

type Tool = {
  name: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  color: string;
  category: "backend" | "frontend" | "infra" | "ai";
};

const tools: Tool[] = [
  { name: "Node.js", icon: Server, color: "#34d399", category: "backend" },
  { name: "TypeScript", icon: Braces, color: "#60a5fa", category: "backend" },
  { name: "Java", icon: Workflow, color: "#f59e0b", category: "backend" },
  { name: "Spring Boot", icon: Layers3, color: "#84cc16", category: "backend" },
  { name: "React", icon: Boxes, color: "#22d3ee", category: "frontend" },
  { name: "Next.js", icon: Globe, color: "#e2e8f0", category: "frontend" },
  { name: "Docker", icon: Container, color: "#38bdf8", category: "infra" },
  { name: "Kubernetes", icon: CloudCog, color: "#818cf8", category: "infra" },
  { name: "Nginx", icon: Network, color: "#4ade80", category: "infra" },
  { name: "CI/CD", icon: Settings2, color: "#c084fc", category: "infra" },
  { name: "Linux", icon: TerminalSquare, color: "#fbbf24", category: "infra" },
  { name: "Jenkins", icon: Wrench, color: "#f87171", category: "infra" },
  { name: "PostgreSQL", icon: Database, color: "#93c5fd", category: "backend" },
  { name: "MongoDB", icon: Database, color: "#4ade80", category: "backend" },
  { name: "Redis", icon: Database, color: "#fb7185", category: "backend" },
  { name: "REST APIs", icon: MonitorSmartphone, color: "#f472b6", category: "backend" },
  { name: "GraphQL", icon: Network, color: "#f0abfc", category: "backend" },
  { name: "Microservices", icon: Layers3, color: "#93c5fd", category: "backend" },
  { name: "Keycloak", icon: KeyRound, color: "#fb7185", category: "infra" },
  { name: "JWT", icon: KeyRound, color: "#f59e0b", category: "backend" },
  { name: "Tailwind CSS", icon: Boxes, color: "#67e8f9", category: "frontend" },
  { name: "Redux Toolkit", icon: Boxes, color: "#a78bfa", category: "frontend" },
  { name: "Webpack", icon: Settings2, color: "#93c5fd", category: "frontend" },
  { name: "Git", icon: Workflow, color: "#fb923c", category: "infra" },
  { name: "GitHub Actions", icon: Workflow, color: "#60a5fa", category: "infra" },
  { name: "Prometheus", icon: CloudCog, color: "#f97316", category: "infra" },
  { name: "Grafana", icon: CloudCog, color: "#fbbf24", category: "infra" },
  { name: "MQTT", icon: Network, color: "#34d399", category: "infra" },
  { name: "Automation", icon: Bot, color: "#67e8f9", category: "ai" },
  { name: "LLM APIs", icon: BrainCircuit, color: "#a78bfa", category: "ai" },
  { name: "Prompt Engineering", icon: BrainCircuit, color: "#c4b5fd", category: "ai" },
  { name: "RAG Pipelines", icon: BrainCircuit, color: "#60a5fa", category: "ai" },
  { name: "LangChain", icon: BrainCircuit, color: "#22d3ee", category: "ai" },
];

const categories = [
  { id: "all", label: "All" },
  { id: "backend", label: "Backend" },
  { id: "frontend", label: "Frontend" },
  { id: "infra", label: "Infra" },
  { id: "ai", label: "AI" },
] as const;

type CategoryId = (typeof categories)[number]["id"];
type SkillCategory = Exclude<CategoryId, "all">;

const categoryCenterAngles: Record<SkillCategory, number> = {
  backend: 330,
  frontend: 50,
  infra: 170,
  ai: 255,
};

const TechStackSection = () => {
  const { ref } = useSectionsProgress();
  const [manualRotation, setManualRotation] = useState(-12);
  const [focusAnimationTick, setFocusAnimationTick] = useState(0);
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(1400);
  const dragStartX = useRef(0);
  const dragStartRotation = useRef(0);
  const wheelSnapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const update = () => setViewportWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    return () => {
      if (wheelSnapTimeoutRef.current) {
        clearTimeout(wheelSnapTimeoutRef.current);
      }
    };
  }, []);

  const stars = useMemo(
    () =>
      Array.from({ length: 28 }).map((_, i) => ({
        id: `star-${i}`,
        top: (i * 19) % 100,
        left: (i * 31) % 100,
        size: (i % 3) + 1,
        delay: (i % 7) * 0.55,
      })),
    [],
  );

  const listedSkills = useMemo(() => {
    return {
      backend: tools.filter((tool) => tool.category === "backend"),
      frontend: tools.filter((tool) => tool.category === "frontend"),
      infra: tools.filter((tool) => tool.category === "infra"),
      ai: tools.filter((tool) => tool.category === "ai"),
    };
  }, []);

  useEffect(() => {
    if (!isDrawerOpen) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsDrawerOpen(false);
    };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [isDrawerOpen]);

  const orbitProfile = useMemo(
    () => {
      const grouped = {
        backend: tools.filter((tool) => tool.category === "backend"),
        frontend: tools.filter((tool) => tool.category === "frontend"),
        infra: tools.filter((tool) => tool.category === "infra"),
        ai: tools.filter((tool) => tool.category === "ai"),
      };

      return tools.map((tool, index) => {
        const cluster = grouped[tool.category];
        const clusterIndex = cluster.findIndex((item) => item.name === tool.name);
        const clusterMid = (cluster.length - 1) / 2;
        const offsetInCluster = clusterIndex - clusterMid;
        const spacing = 11; // degrees between neighbors in same category cluster
        const baseAngleDeg = categoryCenterAngles[tool.category] + offsetInCluster * spacing;

        return {
          baseAngleDeg,
          baseYFactor: (((index * 37) % 100) / 100) * 2 - 1,
          wave: 10 + ((index * 11) % 16),
          phase: ((index * 23) % 360) * (Math.PI / 180),
          radiusXScale: 0.82 + ((index * 13) % 24) / 100,
          radiusZScale: 0.78 + ((index * 17) % 28) / 100,
          zWave: 4 + ((index * 7) % 9),
        };
      });
    },
    [],
  );

  const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
    setIsDragging(true);
    dragStartX.current = e.clientX;
    dragStartRotation.current = manualRotation;
  };

  const onPointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (!isDragging) return;
    const delta = e.clientX - dragStartX.current;
    setManualRotation(dragStartRotation.current + delta * 0.2);
  };

  const normalizeAngle = (angle: number) => {
    return ((angle % 360) + 360) % 360;
  };

  const snapToNearest = () => {
    let bestTarget = manualRotation;
    let bestDistance = Number.POSITIVE_INFINITY;

    for (let i = 0; i < orbitProfile.length; i++) {
      const targetBase = -orbitProfile[i].baseAngleDeg;
      for (const k of [-1, 0, 1]) {
        const candidate = targetBase + 360 * k;
        const distance = Math.abs(candidate - manualRotation);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestTarget = candidate;
        }
      }
    }

    animateRotationTo(bestTarget, 180);
  };

  const stopDragging = () => {
    setIsDragging(false);
    snapToNearest();
  };

  const onWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    const updated = manualRotation + e.deltaY * 0.06;
    setManualRotation(updated);
    if (wheelSnapTimeoutRef.current) {
      clearTimeout(wheelSnapTimeoutRef.current);
    }
    wheelSnapTimeoutRef.current = setTimeout(() => {
      snapToNearest();
    }, 110);
  };

  const radiusX = viewportWidth < 900 ? 210 : 360;
  const radiusZ = viewportWidth < 900 ? 120 : 235;
  const yAmplitude = viewportWidth < 900 ? 16 : 28;
  const ySpread = viewportWidth < 900 ? 110 : 190;

  const animateRotationTo = (target: number, durationMs = 280) => {
    const from = manualRotation;
    const delta = target - from;
    const startedAt = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - startedAt) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setManualRotation(from + delta * eased);
      if (t < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const focusCategory = (category: CategoryId) => {
    setActiveCategory(category);
    setFocusAnimationTick((v) => v + 1);
    if (category === "all") return;
    const centerAngle = categoryCenterAngles[category];
    animateRotationTo(-centerAngle);
  };

  return (
    <Section ref={ref} variant="dark">
      <div className={styles.techOrbit}>
        <div className={styles.techOrbit__stars} aria-hidden>
          {stars.map((star) => (
            <span
              key={star.id}
              className={styles.techOrbit__star}
              style={
                {
                  top: `${star.top}%`,
                  left: `${star.left}%`,
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  animationDelay: `${star.delay}s`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>

        <motion.div
          className={styles.techOrbit__header}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 0.45 }}
        >
          <h2>3D Tool Deck</h2>
          <p>Drag horizontally to rotate. Hover cards for subtle tilt.</p>
        </motion.div>

        <div className={styles.techOrbit__filters}>
          {categories.map((category) => (
            <motion.button
              key={category.id}
              type="button"
              className={`${styles.techOrbit__filterButton} ${activeCategory === category.id ? styles["techOrbit__filterButton--active"] : ""}`}
              onClick={() => focusCategory(category.id)}
              whileTap={{ scale: 0.96 }}
              animate={
                activeCategory === category.id
                  ? { scale: [1, 1.1, 1.04], y: [0, -1, 0] }
                  : { scale: 1, y: 0 }
              }
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              {category.label}
            </motion.button>
          ))}
          <motion.button
            type="button"
            className={styles.techOrbit__drawerButton}
            onClick={() => setIsDrawerOpen(true)}
            whileTap={{ scale: 0.96 }}
          >
            All Skills
          </motion.button>
        </div>

        <div
          className={`${styles.techOrbit__scene} ${isDragging ? styles["techOrbit__scene--dragging"] : ""}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={stopDragging}
          onPointerLeave={stopDragging}
          onPointerCancel={stopDragging}
          onWheel={onWheel}
          style={{ "--manual-rotation": `${manualRotation}deg` } as React.CSSProperties}
        >
          <div className={styles.techOrbit__centerGlow} />
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            const profile = orbitProfile[index];
            const theta = (profile.baseAngleDeg + manualRotation) * (Math.PI / 180);
            const x = Math.sin(theta) * (radiusX * profile.radiusXScale);
            const z =
              Math.cos(theta) * (radiusZ * profile.radiusZScale) +
              Math.sin(theta * 2.4 + profile.phase) * profile.zWave;
            const y =
              profile.baseYFactor * ySpread +
              Math.sin(theta * 1.8 + profile.phase) * (profile.wave + yAmplitude * 0.25);

            const depth = (z + radiusZ) / (2 * radiusZ); // 0 (back) -> 1 (front)
            const isCategoryActive =
              activeCategory === "all" || tool.category === activeCategory;
            const thetaDeg = normalizeAngle(profile.baseAngleDeg + manualRotation);
            const angularDistance = Math.min(thetaDeg, 360 - thetaDeg);
            const isInFocusWindow = angularDistance <= 66; // ~7 primary items
            const isPrimaryFocus = isInFocusWindow && isCategoryActive;
            const isSecondaryFocus = isInFocusWindow && !isCategoryActive;

            const scaleBase = 0.66 + depth * 0.42;
            const scale = scaleBase * (isPrimaryFocus ? 1.08 : isSecondaryFocus ? 0.92 : 0.82);
            const opacity = isPrimaryFocus
              ? 0.42 + depth * 0.58
              : isSecondaryFocus
                ? 0.2 + depth * 0.24
                : 0.05 + depth * 0.12;
            const blur = isPrimaryFocus
              ? (1 - depth) * 0.9
              : isSecondaryFocus
                ? 2.1
                : 4.4;

            return (
              <div
                key={tool.name}
                className={styles.techOrbit__item}
                style={
                  {
                    transform: `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${z}px) scale(${scale})`,
                    zIndex: Math.round(depth * 1000),
                    opacity,
                    filter: `blur(${blur}px)`,
                    pointerEvents: "auto",
                    transition: isDragging
                      ? "transform 0.02s linear, opacity 0.08s linear, filter 0.08s linear"
                      : "transform 0.13s ease, opacity 0.09s linear, filter 0.09s linear",
                  } as React.CSSProperties
                }
              >
                <div
                  className={styles.techOrbit__tool}
                  style={{
                    "--glow": tool.color,
                    "--focus-tick": focusAnimationTick,
                    outline:
                      activeCategory !== "all" && isCategoryActive
                        ? "1px solid color-mix(in oklab, var(--glow), #ffffff 34%)"
                        : "none",
                  } as React.CSSProperties}
                >
                  <span className={styles.techOrbit__icon}>
                    <Icon size={17} strokeWidth={2.1} />
                  </span>
                  <span>{tool.name}</span>
                </div>
              </div>
            );
          })}
        </div>

        <AnimatePresence>
          {isDrawerOpen ? (
            <>
              <motion.button
                className={styles.techOrbit__drawerOverlay}
                onClick={() => setIsDrawerOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                aria-label="Close skills drawer"
              />
              <motion.aside
                className={styles.techOrbit__drawer}
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className={styles.techOrbit__drawerHeader}>
                  <h3>All Skills</h3>
                  <button type="button" onClick={() => setIsDrawerOpen(false)} aria-label="Close drawer">
                    <X size={18} />
                  </button>
                </div>

                <div className={styles.techOrbit__drawerBody}>
                  {(["backend", "frontend", "infra", "ai"] as const).map((category) => (
                    <section key={category} className={styles.techOrbit__drawerGroup}>
                      <h4>{category.toUpperCase()}</h4>
                      <ul>
                        {listedSkills[category].map((tool) => (
                          <li key={`drawer-${tool.name}`}>{tool.name}</li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
              </motion.aside>
            </>
          ) : null}
        </AnimatePresence>
      </div>
    </Section>
  );
};

export default TechStackSection;
