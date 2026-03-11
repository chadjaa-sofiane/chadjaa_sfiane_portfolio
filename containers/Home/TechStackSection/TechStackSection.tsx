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
  Pause,
  Play,
  RotateCcw,
  Search,
  Server,
  Settings2,
  TerminalSquare,
  Workflow,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type {
  CSSProperties,
  ElementType,
  PointerEvent as ReactPointerEvent,
  WheelEvent as ReactWheelEvent,
} from "react";
import * as THREE from "three";

const CATEGORY_META = {
  backend: { label: "Backend", color: "#60a5fa", glyph: "⬡" },
  frontend: { label: "Frontend", color: "#22d3ee", glyph: "◈" },
  infra: { label: "Infra", color: "#a78bfa", glyph: "⬢" },
  ai: { label: "AI", color: "#f59e0b", glyph: "◆" },
};

type ToolCategory = "backend" | "frontend" | "infra" | "ai";

type Tool = {
  name: string;
  icon: ElementType;
  color: string;
  category: ToolCategory;
  desc: string;
};

type OrbitProfile = {
  baseAngleDeg: number;
  baseYFactor: number;
  wave: number;
  phase: number;
  radiusXScale: number;
  radiusZScale: number;
  zWave: number;
};

const tools: Tool[] = [
  { name: "Node.js", icon: Server, color: "#34d399", category: "backend", desc: "JS runtime for scalable server-side applications" },
  { name: "TypeScript", icon: Braces, color: "#60a5fa", category: "backend", desc: "Typed superset of JavaScript for safer codebases" },
  { name: "Java", icon: Workflow, color: "#f59e0b", category: "backend", desc: "Enterprise-grade OOP language" },
  { name: "Spring Boot", icon: Layers3, color: "#84cc16", category: "backend", desc: "Opinionated Spring framework for microservices" },
  { name: "React", icon: Boxes, color: "#22d3ee", category: "frontend", desc: "Component-driven UI library by Meta" },
  { name: "Next.js", icon: Globe, color: "#e2e8f0", category: "frontend", desc: "Full-stack React framework with SSR & SSG" },
  { name: "Docker", icon: Container, color: "#38bdf8", category: "infra", desc: "Container platform for consistent deployments" },
  { name: "Kubernetes", icon: CloudCog, color: "#818cf8", category: "infra", desc: "Container orchestration at scale" },
  { name: "Nginx", icon: Network, color: "#4ade80", category: "infra", desc: "High-performance reverse proxy & web server" },
  { name: "CI/CD", icon: Settings2, color: "#c084fc", category: "infra", desc: "Automated build, test, and deploy pipelines" },
  { name: "Linux", icon: TerminalSquare, color: "#fbbf24", category: "infra", desc: "Foundation OS for servers and development" },
  { name: "Jenkins", icon: Wrench, color: "#f87171", category: "infra", desc: "Open-source automation server" },
  { name: "PostgreSQL", icon: Database, color: "#93c5fd", category: "backend", desc: "Advanced open-source relational database" },
  { name: "MongoDB", icon: Database, color: "#4ade80", category: "backend", desc: "Document-oriented NoSQL database" },
  { name: "Redis", icon: Database, color: "#fb7185", category: "backend", desc: "In-memory data structure store & cache" },
  { name: "REST APIs", icon: MonitorSmartphone, color: "#f472b6", category: "backend", desc: "HTTP-based API design standard" },
  { name: "GraphQL", icon: Network, color: "#f0abfc", category: "backend", desc: "Query language for flexible APIs" },
  { name: "Microservices", icon: Layers3, color: "#93c5fd", category: "backend", desc: "Distributed service architecture pattern" },
  { name: "Keycloak", icon: KeyRound, color: "#fb7185", category: "infra", desc: "Open-source IAM & SSO solution" },
  { name: "JWT", icon: KeyRound, color: "#f59e0b", category: "backend", desc: "Compact token format for auth" },
  { name: "Tailwind CSS", icon: Boxes, color: "#67e8f9", category: "frontend", desc: "Utility-first CSS framework" },
  { name: "Redux Toolkit", icon: Boxes, color: "#a78bfa", category: "frontend", desc: "Predictable state management for React" },
  { name: "Webpack", icon: Settings2, color: "#93c5fd", category: "frontend", desc: "Module bundler for modern JS apps" },
  { name: "Git", icon: Workflow, color: "#fb923c", category: "infra", desc: "Distributed version control system" },
  { name: "GitHub Actions", icon: Workflow, color: "#60a5fa", category: "infra", desc: "Native CI/CD automation within GitHub" },
  { name: "Prometheus", icon: CloudCog, color: "#f97316", category: "infra", desc: "Time-series metrics and alerting" },
  { name: "Grafana", icon: CloudCog, color: "#fbbf24", category: "infra", desc: "Observability dashboards for metrics" },
  { name: "MQTT", icon: Network, color: "#34d399", category: "infra", desc: "Lightweight messaging protocol for IoT" },
  { name: "Automation", icon: Bot, color: "#67e8f9", category: "ai", desc: "Workflow automation & scripted orchestration" },
  { name: "LLM APIs", icon: BrainCircuit, color: "#a78bfa", category: "ai", desc: "Integration with OpenAI, Anthropic, etc." },
  { name: "Prompt Eng.", icon: BrainCircuit, color: "#c4b5fd", category: "ai", desc: "Crafting effective prompts for LLMs" },
  { name: "RAG Pipelines", icon: BrainCircuit, color: "#60a5fa", category: "ai", desc: "Retrieval-Augmented Generation systems" },
  { name: "LangChain", icon: BrainCircuit, color: "#22d3ee", category: "ai", desc: "Framework for LLM-powered applications" },
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

const categoryCenterAngles: Record<SkillCategory, number> = { backend: 330, frontend: 50, infra: 170, ai: 255 };

const normalizeAngle = (angle: number) => ((angle % 360) + 360) % 360;

export default function TechStackSection() {
  const [manualRotation, setManualRotation] = useState(-12);
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(1400);
  const [isLowPowerMode, setIsLowPowerMode] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [autoRotateSpeed, setAutoRotateSpeed] = useState(2); // deg/sec
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [hoveredTool, setHoveredTool] = useState<Tool | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneContainerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const starFieldRef = useRef<THREE.Points | null>(null);
  const centerGlowRef = useRef<THREE.Sprite | null>(null);
  const spritesRef = useRef<THREE.Sprite[]>([]);
  const spriteMetaRef = useRef<Array<{ tool: Tool; profile: OrbitProfile; baseSize: { w: number; h: number } }>>([]);
  const hoverIndexRef = useRef<number | null>(null);
  const manualRotationRef = useRef<number>(manualRotation);
  const activeCategoryRef = useRef<CategoryId>(activeCategory);
  const isDraggingRef = useRef<boolean>(isDragging);
  const lowPowerRef = useRef<boolean>(isLowPowerMode);
  const isAutoRotatingRef = useRef<boolean>(isAutoRotating);
  const autoRotateSpeedRef = useRef<number>(autoRotateSpeed);
  const searchQueryRef = useRef<string>(searchQuery);
  const debouncedQueryRef = useRef<string>(debouncedQuery);
  const sizeRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });
  const parallaxRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const parallaxTargetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const hoverRafRef = useRef<number | null>(null);
  const lastHoverIndexRef = useRef<number | null>(null);
  const isScrollingRef = useRef<boolean>(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const needsTextureRebuildRef = useRef<boolean>(true);
  const animationLoopRef = useRef<number | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const dragStartX = useRef<number>(0);
  const dragStartRotation = useRef<number>(0);
  const dragPointerIdRef = useRef<number | null>(null);
  const dragRafRef = useRef<number | null>(null);
  const pendingRotationRef = useRef<number | null>(null);
  const animationRafRef = useRef<number | null>(null);
  const wheelSnapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastAutoRotateTime = useRef<number | null>(null);
  const autoRotateAccumulator = useRef<number>(0);
  const lastInteractionRef = useRef<number>(Date.now());
  const compactRef = useRef<boolean>(false);
  const clickCandidateRef = useRef<Tool | null>(null);
  const clickStartXRef = useRef<number>(0);
  const prevTimeRef = useRef<number | null>(null);

  // sync refs
  useEffect(() => { manualRotationRef.current = manualRotation; }, [manualRotation]);
  useEffect(() => { activeCategoryRef.current = activeCategory; }, [activeCategory]);
  useEffect(() => { isDraggingRef.current = isDragging; }, [isDragging]);
  useEffect(() => {
    lowPowerRef.current = isLowPowerMode;
    if (rendererRef.current) {
      rendererRef.current.setPixelRatio(
        Math.min(window.devicePixelRatio || 1, isLowPowerMode ? 1.5 : 3),
      );
    }
    needsTextureRebuildRef.current = true;
  }, [isLowPowerMode]);
  useEffect(() => { isAutoRotatingRef.current = isAutoRotating; }, [isAutoRotating]);
  useEffect(() => { autoRotateSpeedRef.current = autoRotateSpeed; }, [autoRotateSpeed]);
  useEffect(() => { searchQueryRef.current = searchQuery; }, [searchQuery]);
  useEffect(() => { debouncedQueryRef.current = debouncedQuery; }, [debouncedQuery]);

  useEffect(() => {
    const id = window.setTimeout(() => setDebouncedQuery(searchQuery.trim()), 180);
    return () => window.clearTimeout(id);
  }, [searchQuery]);

  useEffect(() => {
    const update = () => setViewportWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setIsLowPowerMode(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      isScrollingRef.current = true;
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
      }, 140);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    compactRef.current = viewportWidth < 900;
    needsTextureRebuildRef.current = true;
  }, [viewportWidth]);

  useEffect(() => {
    needsTextureRebuildRef.current = true;
  }, [isLowPowerMode]);

  useEffect(() => {
    if (!isDrawerOpen) return;
    const onEsc = (e: KeyboardEvent) => { if (e.key === "Escape") setIsDrawerOpen(false); };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [isDrawerOpen]);

  const orbitProfile = useMemo<OrbitProfile[]>(() => {
    const grouped = {
      backend: tools.filter(t => t.category === "backend"),
      frontend: tools.filter(t => t.category === "frontend"),
      infra: tools.filter(t => t.category === "infra"),
      ai: tools.filter(t => t.category === "ai"),
    };
    return tools.map((tool, index) => {
      const cluster = grouped[tool.category];
      const clusterIndex = cluster.findIndex(item => item.name === tool.name);
      const clusterMid = (cluster.length - 1) / 2;
      const offsetInCluster = clusterIndex - clusterMid;
      const spacing = 11;
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
  }, []);

  const listedSkills = useMemo<Record<SkillCategory, Tool[]>>(() => ({
    backend: tools.filter(t => t.category === "backend"),
    frontend: tools.filter(t => t.category === "frontend"),
    infra: tools.filter(t => t.category === "infra"),
    ai: tools.filter(t => t.category === "ai"),
  }), []);

  const categoryCounts = useMemo<Record<CategoryId, number>>(() => ({
    all: tools.length,
    backend: tools.filter(t => t.category === "backend").length,
    frontend: tools.filter(t => t.category === "frontend").length,
    infra: tools.filter(t => t.category === "infra").length,
    ai: tools.filter(t => t.category === "ai").length,
  }), []);

  const drawerCategories: SkillCategory[] = ["backend", "frontend", "infra", "ai"];

  const filteredTools = useMemo<Tool[] | null>(() => {
    if (!debouncedQuery.trim()) return null;
    const q = debouncedQuery.toLowerCase();
    return tools.filter(t => t.name.toLowerCase().includes(q) || t.category.includes(q));
  }, [debouncedQuery]);

  useEffect(() => {
    if (!debouncedQuery || !filteredTools || filteredTools.length === 0) return;
    if (isDraggingRef.current) return;
    const first = filteredTools[0];
    const index = tools.findIndex(t => t.name === first.name);
    if (index < 0) return;
    animateRotationTo(-orbitProfile[index].baseAngleDeg, 260);
  }, [debouncedQuery, filteredTools, orbitProfile]);

  const drawRoundedRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
  ) => {
    const cr = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + cr, y);
    ctx.lineTo(x + w - cr, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + cr);
    ctx.lineTo(x + w, y + h - cr);
    ctx.quadraticCurveTo(x + w, y + h, x + w - cr, y + h);
    ctx.lineTo(x + cr, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - cr);
    ctx.lineTo(x, y + cr);
    ctx.quadraticCurveTo(x, y, x + cr, y);
    ctx.closePath();
  };

  const createToolTexture = (tool: Tool, compact: boolean, dpr: number) => {
    const fontFamily = '"DM Serif Display", Fraunces, Georgia, serif';
    const fontSize = compact ? 13 : 14.5;
    const height = compact ? 42 : 50;
    const paddingX = compact ? 13 : 15;
    const iconSize = compact ? 19 : 21;
    const gap = compact ? 8 : 10;
    const edgePadding = 5;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return { texture: new THREE.CanvasTexture(canvas), width: 1, height: 1 };

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.font = `600 ${fontSize}px ${fontFamily}`;
    const textWidth = ctx.measureText(tool.name).width;
    const width = Math.ceil(paddingX * 2 + iconSize + gap + textWidth + edgePadding * 2);

    canvas.width = Math.max(1, Math.floor(width * dpr));
    canvas.height = Math.max(1, Math.floor(height * dpr));
    ctx.scale(dpr, dpr);

    // Background card
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, "rgba(28, 20, 15, 0.96)");
    bgGrad.addColorStop(1, "rgba(18, 12, 9, 0.98)");
    ctx.fillStyle = bgGrad;
    drawRoundedRect(ctx, edgePadding + 0.5, 0.5, width - edgePadding * 2 - 1, height - 1, height / 2);
    ctx.fill();

    // Subtle border
    ctx.strokeStyle = "rgba(227, 181, 125, 0.28)";
    ctx.lineWidth = 1;
    drawRoundedRect(ctx, edgePadding + 0.5, 0.5, width - edgePadding * 2 - 1, height - 1, height / 2);
    ctx.stroke();

    // Icon circle
    const iconX = edgePadding + paddingX + iconSize / 2;
    const iconY = height / 2;
    const iconGrad = ctx.createRadialGradient(iconX, iconY, 0, iconX, iconY, iconSize / 2);
    iconGrad.addColorStop(0, `${tool.color}33`);
    iconGrad.addColorStop(1, "transparent");
    ctx.fillStyle = iconGrad;
    ctx.strokeStyle = `${tool.color}bb`;
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.arc(iconX, iconY, iconSize / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Icon letter
    ctx.font = `700 ${fontSize - 2}px ${fontFamily}`;
    ctx.fillStyle = tool.color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(tool.name.slice(0, 1).toUpperCase(), iconX, iconY + 0.5);

    // Tool name
    ctx.font = `700 ${fontSize}px ${fontFamily}`;
    ctx.fillStyle = "rgba(236, 228, 216, 0.98)";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(tool.name, edgePadding + paddingX + iconSize + gap, iconY + 0.5);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.premultiplyAlpha = true;
    texture.generateMipmaps = false;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
    return { texture, width, height };
  };

  const createGlowTexture = (dpr: number) => {
    const size = Math.floor(320 * dpr);
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return new THREE.CanvasTexture(canvas);
    const r = size / 2;
    const g = ctx.createRadialGradient(r, r, 0, r, r, r);
    g.addColorStop(0, "rgba(220, 130, 70, 0.7)");
    g.addColorStop(0.3, "rgba(190, 100, 50, 0.35)");
    g.addColorStop(0.65, "rgba(160, 80, 40, 0.1)");
    g.addColorStop(1, "rgba(160, 80, 40, 0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    // Inner bright core
    const core = ctx.createRadialGradient(r, r, 0, r, r, r * 0.18);
    core.addColorStop(0, "rgba(255, 200, 130, 0.9)");
    core.addColorStop(1, "rgba(255, 180, 100, 0)");
    ctx.fillStyle = core;
    ctx.fillRect(0, 0, size, size);
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    t.needsUpdate = true;
    return t;
  };

  const createRingTexture = (color: string, dpr: number) => {
    const size = Math.floor(200 * dpr);
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return new THREE.CanvasTexture(canvas);
    const cx = size / 2, cy = size / 2;
    ctx.beginPath();
    ctx.arc(cx, cy, size * 0.46, 0, Math.PI * 2);
    ctx.strokeStyle = color + "55";
    ctx.lineWidth = size * 0.03;
    ctx.stroke();
    const t = new THREE.CanvasTexture(canvas);
    t.needsUpdate = true;
    return t;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = sceneContainerRef.current;
    if (!canvas || !container) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !lowPowerRef.current,
      alpha: true,
      powerPreference: "high-performance",
    });
    rendererRef.current = renderer;
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lowPowerRef.current ? 1.5 : 3));

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1000, 1000);
    camera.position.z = 400;
    cameraRef.current = camera;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const disposeSprite = (sprite: THREE.Sprite) => {
      if (sprite.material?.map) sprite.material.map.dispose();
      sprite.material?.dispose();
    };

    const disposeMaterial = (material: THREE.Material | THREE.Material[]) => {
      if (Array.isArray(material)) {
        material.forEach((mat) => mat.dispose());
      } else {
        material.dispose();
      }
    };

    const rebuildSprites = () => {
      const compact = compactRef.current;
      const baseDpr = Math.min(window.devicePixelRatio || 1, lowPowerRef.current ? 2 : 3.5);
      const supersample = lowPowerRef.current ? 1 : 1.35;
      const dpr = Math.min(baseDpr * supersample, lowPowerRef.current ? 2.5 : 5);
      spritesRef.current.forEach(s => { scene.remove(s); disposeSprite(s); });
      spritesRef.current = [];
      spriteMetaRef.current = [];

      tools.forEach((tool, index) => {
        const { texture, width, height } = createToolTexture(tool, compact, dpr);
        const material = new THREE.SpriteMaterial({
          map: texture, transparent: true, opacity: 1, depthWrite: false,
        });
        material.alphaTest = 0.02;
        const sprite = new THREE.Sprite(material);
        sprite.userData.index = index;
        sprite.scale.set(width, height, 1);
        scene.add(sprite);
        spritesRef.current.push(sprite);
        spriteMetaRef.current.push({ tool, profile: orbitProfile[index], baseSize: { w: width, h: height } });
      });
    };

    const rebuildStars = (width: number, height: number) => {
      if (starFieldRef.current) {
        scene.remove(starFieldRef.current);
        starFieldRef.current.geometry.dispose();
        if (starFieldRef.current.material) disposeMaterial(starFieldRef.current.material);
        starFieldRef.current = null;
      }
    };

    const rebuildGlow = () => {
      if (centerGlowRef.current) {
        scene.remove(centerGlowRef.current);
        centerGlowRef.current.material?.map?.dispose();
        centerGlowRef.current.material?.dispose();
        centerGlowRef.current = null;
      }
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const mat = new THREE.SpriteMaterial({
        map: createGlowTexture(dpr),
        transparent: true,
        opacity: 0.7,
        depthWrite: false,
      });
      const sprite = new THREE.Sprite(mat);
      sprite.position.set(0, 0, -80);
      scene.add(sprite);
      centerGlowRef.current = sprite;
    };

    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      if (!width || !height) return;
      sizeRef.current = { width, height };
      renderer.setSize(width, height, false);
      camera.left = -width / 2;
      camera.right = width / 2;
      camera.top = height / 2;
      camera.bottom = -height / 2;
      camera.updateProjectionMatrix();
      if (centerGlowRef.current) {
        const sz = Math.min(width, height) * 0.38;
        centerGlowRef.current.scale.set(sz, sz, 1);
      }
      rebuildStars(width, height);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!canvasRef.current || !cameraRef.current || isScrollingRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, cameraRef.current);
      const hits = raycaster.intersectObjects(spritesRef.current, false);
      const nextIndex =
        hits.length > 0 && hits[0].object instanceof THREE.Sprite
          ? hits[0].object.userData.index
          : null;
      hoverIndexRef.current = nextIndex;

      if (lastHoverIndexRef.current !== nextIndex) {
        lastHoverIndexRef.current = nextIndex;
        const t = nextIndex !== null ? spriteMetaRef.current[nextIndex]?.tool || null : null;
        setHoveredTool(t);
      }

      if (hoverRafRef.current) cancelAnimationFrame(hoverRafRef.current);
      const x = event.clientX;
      const y = event.clientY;
      hoverRafRef.current = requestAnimationFrame(() => {
        setTooltipPos({ x, y });
      });
    };

    const handleCanvasClick = (event: MouseEvent) => {
      const dx = Math.abs(event.clientX - clickStartXRef.current);
      if (dx > 5) return; // was a drag
      if (hoverIndexRef.current !== null) {
        const t = spriteMetaRef.current[hoverIndexRef.current]?.tool || null;
        setSelectedTool(t);
      } else {
        setSelectedTool(null);
      }
    };

    const handleParallaxMove = (event: PointerEvent) => {
      if (!container || isDraggingRef.current || isScrollingRef.current) return;
      const rect = container.getBoundingClientRect();
      parallaxTargetRef.current = {
        x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
        y: ((event.clientY - rect.top) / rect.height) * 2 - 1,
      };
    };

    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("click", handleCanvasClick);
    container.addEventListener("pointermove", handleParallaxMove);
    container.addEventListener("pointerleave", () => {
      parallaxTargetRef.current = { x: 0, y: 0 };
      lastHoverIndexRef.current = null;
      setHoveredTool(null);
    });

    rebuildGlow();
    rebuildSprites();
    resize();

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => { needsTextureRebuildRef.current = true; });
    }

    resizeObserverRef.current = new ResizeObserver(() => resize());
    resizeObserverRef.current?.observe(container);

    const animate = (time: number) => {
      const ren = rendererRef.current;
      const cam = cameraRef.current;
      if (!ren || !cam) return;

      if (needsTextureRebuildRef.current) {
        needsTextureRebuildRef.current = false;
        rebuildGlow();
        rebuildSprites();
        resize();
      }

      // Auto-rotate
      if (isAutoRotatingRef.current && !isDraggingRef.current) {
        const sinceInteraction = (Date.now() - lastInteractionRef.current) / 1000;
        if (sinceInteraction > 1.5) {
          const dt = prevTimeRef.current !== null ? (time - prevTimeRef.current) * 0.001 : 0;
          autoRotateAccumulator.current += autoRotateSpeedRef.current * dt;
          setManualRotation(prev => {
            const next = prev + autoRotateSpeedRef.current * dt;
            manualRotationRef.current = next;
            return next;
          });
        }
      }
      prevTimeRef.current = time;

      const { width, height } = sizeRef.current;
      const radiusX = width < 900 ? 210 : 360;
      const radiusZ = width < 900 ? 120 : 235;
      const yAmplitude = width < 900 ? 16 : 28;
      const ySpread = width < 900 ? 110 : 190;
      const timeFactor = time * 0.001;
      const parallax = parallaxRef.current;
      const target = parallaxTargetRef.current;
      const deadzone = 0.06;
      const tx = Math.abs(target.x) < deadzone ? 0 : target.x;
      const ty = Math.abs(target.y) < deadzone ? 0 : target.y;
      parallaxRef.current = {
        x: parallax.x + (tx - parallax.x) * 0.045,
        y: parallax.y + (ty - parallax.y) * 0.045,
      };
      const pX = parallaxRef.current.x * (width < 900 ? 6 : 10);
      const pY = parallaxRef.current.y * (width < 900 ? 5 : 8);
      const sq = debouncedQueryRef.current.toLowerCase();

      spritesRef.current.forEach((sprite, index) => {
        const meta = spriteMetaRef.current[index];
        if (!meta) return;
        const profile = meta.profile;
        const theta = (profile.baseAngleDeg + manualRotationRef.current) * (Math.PI / 180);
        const x = Math.sin(theta) * (radiusX * profile.radiusXScale);
        const z = Math.cos(theta) * (radiusZ * profile.radiusZScale) + Math.sin(theta * 2.4 + profile.phase) * profile.zWave;
        const y = profile.baseYFactor * ySpread + Math.sin(theta * 1.8 + profile.phase) * (profile.wave + yAmplitude * 0.25);

        const depth = (z + radiusZ) / (2 * radiusZ);
        const parallaxDepth = 0.18 + depth * 0.32;
        sprite.position.set(x + pX * parallaxDepth, y + pY * parallaxDepth, z);

        const isCategoryActive = activeCategoryRef.current === "all" || meta.tool.category === activeCategoryRef.current;
        const matchesSearch = !sq || meta.tool.name.toLowerCase().includes(sq) || meta.tool.category.includes(sq);
        const thetaDeg = normalizeAngle(profile.baseAngleDeg + manualRotationRef.current);
        const angDist = Math.min(thetaDeg, 360 - thetaDeg);
        const isInFocusWindow = angDist <= 90;
        const isPrimaryFocus = isInFocusWindow && isCategoryActive && matchesSearch;
        const isSecondaryFocus = isInFocusWindow && (!isCategoryActive || !matchesSearch);

        sprite.visible = !lowPowerRef.current || isInFocusWindow || depth > 0.5;
        if (!sprite.visible) return;

        const scaleBase = 0.58 + depth * 0.58;
        const focusScale = isPrimaryFocus ? 1.1 : isSecondaryFocus ? 0.9 : 0.8;
        const isHovered = hoverIndexRef.current === index;
        const hoverScale = isHovered ? 1.08 : 1;
        const pulse = isPrimaryFocus ? 1 + Math.sin(timeFactor * 3.5) * 0.018 : 1;
        const scale = scaleBase * focusScale * hoverScale * pulse;
        sprite.scale.set(meta.baseSize.w * scale, meta.baseSize.h * scale, 1);

        const baseOpacity = isPrimaryFocus ? 0.42 + depth * 0.58 : isSecondaryFocus ? 0.15 + depth * 0.22 : 0.03 + depth * 0.1;
        const searchDim = sq && !matchesSearch ? 0.15 : 1;
      if (sprite.material instanceof THREE.SpriteMaterial) {
        sprite.material.opacity = Math.min(1, baseOpacity * searchDim * (isHovered ? 1.15 : 1));
      }
    });

      if (centerGlowRef.current?.material) {
        centerGlowRef.current.material.opacity = 0.6 + Math.sin(timeFactor * 0.8) * 0.1;
      }

      ren.render(scene, cam);
      animationLoopRef.current = requestAnimationFrame(animate);
    };

    animationLoopRef.current = requestAnimationFrame(animate);

    return () => {
      canvas.removeEventListener("pointermove", handlePointerMove);
      if (hoverRafRef.current) cancelAnimationFrame(hoverRafRef.current);
      canvas.removeEventListener("click", handleCanvasClick);
      if (resizeObserverRef.current) resizeObserverRef.current.disconnect();
      if (animationLoopRef.current) cancelAnimationFrame(animationLoopRef.current);
      spritesRef.current.forEach(disposeSprite);
      spritesRef.current = [];
      if (starFieldRef.current) {
        scene.remove(starFieldRef.current);
        starFieldRef.current.geometry.dispose();
        if (starFieldRef.current.material) disposeMaterial(starFieldRef.current.material);
      }
      if (centerGlowRef.current) { scene.remove(centerGlowRef.current); centerGlowRef.current.material?.map?.dispose(); centerGlowRef.current.material?.dispose(); }
      renderer.dispose();
      scene.clear();
    };
  }, [orbitProfile]);

  const animateRotationTo = (target: number, durationMs = 280) => {
    if (animationRafRef.current) cancelAnimationFrame(animationRafRef.current);
    const from = manualRotationRef.current;
    const delta = target - from;
    const startedAt = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - startedAt) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = from + delta * eased;
      manualRotationRef.current = next;
      setManualRotation(next);
      if (t < 1) animationRafRef.current = requestAnimationFrame(tick);
      else animationRafRef.current = null;
    };
    animationRafRef.current = requestAnimationFrame(tick);
  };

  const snapToNearest = () => {
    let bestTarget = manualRotationRef.current;
    let bestDist = Infinity;
    for (let i = 0; i < orbitProfile.length; i++) {
      const base = -orbitProfile[i].baseAngleDeg;
      for (const k of [-1, 0, 1]) {
        const c = base + 360 * k;
        const d = Math.abs(c - manualRotationRef.current);
        if (d < bestDist) { bestDist = d; bestTarget = c; }
      }
    }
    animateRotationTo(bestTarget, 180);
  };

  const stopDragging = () => {
    setIsDragging(false);
    isDraggingRef.current = false;
    snapToNearest();
  };

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (isScrollingRef.current) return;
    lastInteractionRef.current = Date.now();
    setIsDragging(true);
    isDraggingRef.current = true;
    dragStartX.current = e.clientX;
    clickStartXRef.current = e.clientX;
    dragStartRotation.current = manualRotationRef.current;
    dragPointerIdRef.current = e.pointerId;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (isScrollingRef.current) return;
    if (!isDragging) return;
    const delta = e.clientX - dragStartX.current;
    const next = dragStartRotation.current + delta * 0.2;
    manualRotationRef.current = next;
    pendingRotationRef.current = next;
    if (dragRafRef.current) return;
    dragRafRef.current = requestAnimationFrame(() => {
      dragRafRef.current = null;
      if (pendingRotationRef.current !== null) setManualRotation(pendingRotationRef.current);
    });
  };

  useEffect(() => {
    if (!isDragging) return;
    const onUp = (e: PointerEvent) => { if (dragPointerIdRef.current !== e.pointerId) return; dragPointerIdRef.current = null; stopDragging(); };
    const onMove = (e: PointerEvent) => {
      if (dragPointerIdRef.current !== e.pointerId) return;
      const delta = e.clientX - dragStartX.current;
      const next = dragStartRotation.current + delta * 0.2;
      manualRotationRef.current = next;
      pendingRotationRef.current = next;
      if (dragRafRef.current) return;
      dragRafRef.current = requestAnimationFrame(() => { dragRafRef.current = null; if (pendingRotationRef.current !== null) setManualRotation(pendingRotationRef.current); });
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => { window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); window.removeEventListener("pointercancel", onUp); };
  }, [isDragging]);

  const onWheel = (e: ReactWheelEvent<HTMLDivElement>) => {
    if (isScrollingRef.current) return;
    e.preventDefault();
    lastInteractionRef.current = Date.now();
    const next = manualRotationRef.current + e.deltaY * 0.06;
    manualRotationRef.current = next;
    setManualRotation(next);
    if (wheelSnapTimeoutRef.current) clearTimeout(wheelSnapTimeoutRef.current);
    wheelSnapTimeoutRef.current = setTimeout(snapToNearest, 110);
  };

  const focusCategory = (cat: CategoryId) => {
    lastInteractionRef.current = Date.now();
    setActiveCategory(cat);
    activeCategoryRef.current = cat;
    if (cat !== "all") animateRotationTo(-categoryCenterAngles[cat]);
  };

  // ─── Styles ──────────────────────────────────────────────────────────────────
  type StyleMap = {
    root: CSSProperties;
    header: CSSProperties;
    eyebrow: CSSProperties;
    title: CSSProperties;
    subtitle: CSSProperties;
    controls: CSSProperties;
    filterRow: CSSProperties;
    filterBtn: (active: boolean, cat: CategoryId) => CSSProperties;
    countBadge: (cat: CategoryId) => CSSProperties;
    toolbarBtn: (active: boolean) => CSSProperties;
    searchWrap: CSSProperties;
    searchIcon: CSSProperties;
    searchInput: CSSProperties;
    scene: CSSProperties;
    canvas: CSSProperties;
    speedRow: CSSProperties;
    speedLabel: CSSProperties;
    speedSlider: CSSProperties;
    tooltip: CSSProperties;
    tooltipName: CSSProperties;
    tooltipCat: CSSProperties;
    tooltipDesc: CSSProperties;
    detailCard: CSSProperties;
    drawerOverlay: CSSProperties;
    drawer: CSSProperties;
    drawerHeader: CSSProperties;
    drawerTitle: CSSProperties;
    drawerClose: CSSProperties;
    drawerBody: CSSProperties;
    drawerGroup: CSSProperties;
    drawerGroupTitle: CSSProperties;
    drawerList: CSSProperties;
    drawerItem: (color: string) => CSSProperties;
    skillsBtn: CSSProperties;
  };

  const s: StyleMap = {
    root: {
      width: "100%",
      maxWidth: "1200px",
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "4.5rem 1.5rem 4rem",
      position: "relative",
      overflow: "hidden",
    },
    header: { textAlign: "center", marginBottom: "1.6rem", position: "relative", zIndex: 2 },
    eyebrow: {
      fontSize: "0.75rem",
      letterSpacing: "0.22em",
      color: "rgba(232,224,211,0.7)",
      textTransform: "uppercase",
      fontFamily: "var(--button-font)",
      marginBottom: "0.6rem",
    },
    title: {
      fontSize: "clamp(2.2rem, 4.4vw, 3.2rem)",
      fontWeight: 700,
      color: "hsl(var(--primary-400))",
      margin: 0,
      lineHeight: 1.1,
      letterSpacing: "-0.02em",
      fontFamily: "var(--header-font)",
    },
    subtitle: {
      fontSize: "1rem",
      color: "rgba(232,224,211,0.75)",
      marginTop: "0.6rem",
      fontFamily: "var(--Sans-font)",
      letterSpacing: "0.04em",
    },
    controls: { display: "flex", gap: "10px", alignItems: "center", marginBottom: "0.4rem", flexWrap: "wrap", justifyContent: "center", position: "relative", zIndex: 2 },
    filterRow: { display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap", justifyContent: "center" },
    filterBtn: (active: boolean, cat: CategoryId) => ({
      padding: "7px 16px", borderRadius: "999px", border: "1px solid",
      borderColor: active ? "rgba(190,116,79,0.9)" : "rgba(227,181,125,0.28)",
      background: active ? "rgba(157,90,58,0.35)" : "rgba(34,24,19,0.55)",
      color: active ? "#fff" : "rgba(240,231,217,0.85)",
      fontSize: "12px", fontWeight: 600, cursor: "pointer", transition: "all 0.18s",
      fontFamily: "var(--button-font)", letterSpacing: "0.05em",
      display: "flex", alignItems: "center", gap: "6px",
    }),
    countBadge: (cat: CategoryId) => ({
      fontSize: "10px", padding: "1px 6px", borderRadius: "999px",
      background: "rgba(190,116,79,0.16)",
      color: "rgba(232,224,211,0.8)",
    }),
    toolbarBtn: (active: boolean) => ({
      padding: "7px 13px", borderRadius: "10px",
      border: `1px solid ${active ? "rgba(190,116,79,0.6)" : "rgba(227,181,125,0.25)"}`,
      background: active ? "rgba(157,90,58,0.2)" : "rgba(34,24,19,0.55)",
      color: active ? "rgba(232,224,211,0.95)" : "rgba(232,224,211,0.7)",
      fontSize: "12px", cursor: "pointer", transition: "all 0.18s",
      display: "flex", alignItems: "center", gap: "6px", fontFamily: "var(--button-font)",
    }),
    searchWrap: {
      position: "relative", display: "flex", alignItems: "center",
    },
    searchIcon: { position: "absolute", left: "10px", color: "rgba(190,116,79,0.6)", pointerEvents: "none" },
    searchInput: {
      padding: "7px 12px 7px 32px", borderRadius: "8px",
      border: "1px solid rgba(227,181,125,0.25)", background: "rgba(20,14,11,0.7)",
      color: "rgba(232,224,211,0.95)", fontSize: "12.5px", outline: "none", width: "180px",
      fontFamily: "var(--Sans-font)", letterSpacing: "0.03em",
      transition: "border-color 0.2s",
    },
    scene: {
      width: "100%", maxWidth: "1100px", height: "clamp(480px, 64vw, 720px)",
      position: "relative", cursor: isDragging ? "grabbing" : "grab",
      borderRadius: "0px", overflow: "visible",
      border: "none",
      background: "transparent",
    },
    canvas: { width: "100%", height: "100%", display: "block" },
    speedRow: {
      display: "flex", alignItems: "center", gap: "8px", marginTop: "6px",
      position: "relative", zIndex: 2,
    },
    speedLabel: { fontSize: "11px", color: "rgba(232,224,211,0.6)", fontFamily: "var(--Sans-font)" },
    speedSlider: { width: "90px", accentColor: "rgba(190,116,79,0.9)" },
    tooltip: {
      position: "fixed", pointerEvents: "none", zIndex: 100,
      background: "rgba(18,12,8,0.96)", border: "1px solid rgba(227,181,125,0.3)",
      borderRadius: "12px", padding: "10px 14px", maxWidth: "220px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
    },
    tooltipName: { fontSize: "13px", fontWeight: 700, color: "rgba(232,224,211,0.98)", marginBottom: "3px", fontFamily: "var(--header-font)" },
    tooltipCat: { fontSize: "10px", fontFamily: "var(--button-font)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "5px", color: "rgba(232,224,211,0.7)" },
    tooltipDesc: { fontSize: "12px", color: "rgba(232,224,211,0.72)", lineHeight: 1.5, fontFamily: "var(--Sans-font)" },
    detailCard: {
      position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
      zIndex: 10, background: "rgba(18,12,8,0.97)", border: "1px solid rgba(227,181,125,0.35)",
      borderRadius: "18px", padding: "28px 32px", minWidth: "240px", maxWidth: "320px",
      boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
      backdropFilter: "blur(12px)",
      textAlign: "center",
    },
    drawerOverlay: {
      position: "fixed", inset: 0, background: "rgba(10,6,4,0.72)",
      zIndex: 40, border: "none", cursor: "pointer",
    },
    drawer: {
      position: "fixed", top: 0, right: 0, bottom: 0, width: "min(420px, 92vw)",
      background: "linear-gradient(180deg, #17110e 0%, #0f0b08 100%)",
      borderLeft: "1px solid rgba(227,181,125,0.2)",
      zIndex: 50, overflowY: "auto",
      boxShadow: "-20px 0 60px rgba(0,0,0,0.7)",
    },
    drawerHeader: {
      padding: "24px 24px 18px", display: "flex", justifyContent: "space-between",
      alignItems: "center", borderBottom: "1px solid rgba(227,181,125,0.14)",
      position: "sticky", top: 0, background: "rgba(23,17,14,0.98)", zIndex: 1,
    },
    drawerTitle: { fontSize: "18px", fontWeight: 700, color: "rgba(232,224,211,0.98)", margin: 0, fontFamily: "var(--header-font)" },
    drawerClose: {
      width: "34px", height: "34px", borderRadius: "50%",
      border: "1px solid rgba(227,181,125,0.3)", background: "transparent",
      color: "rgba(232,224,211,0.7)", cursor: "pointer", display: "flex",
      alignItems: "center", justifyContent: "center",
    },
    drawerBody: { padding: "16px 24px 32px" },
    drawerGroup: { marginBottom: "24px" },
    drawerGroupTitle: {
      fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase",
      fontFamily: "var(--button-font)", marginBottom: "10px",
      display: "flex", alignItems: "center", gap: "8px", color: "rgba(232,224,211,0.8)",
    },
    drawerList: { listStyle: "none", margin: 0, padding: 0, display: "flex", flexWrap: "wrap", gap: "6px" },
    drawerItem: (color: string) => ({
      padding: "4px 10px", borderRadius: "999px", fontSize: "11.5px",
      background: color + "14", border: `1px solid ${color}33`,
      color: "rgba(232,224,211,0.85)", fontFamily: "var(--Sans-font)",
    }),
    skillsBtn: {
      padding: "7px 16px", borderRadius: "999px",
      border: "1px solid rgba(80,149,130,0.5)",
      background: "rgba(56,110,96,0.2)",
      color: "rgba(223,247,238,0.96)", fontSize: "12.5px",
      fontWeight: 600, cursor: "pointer",
      fontFamily: "var(--button-font)", letterSpacing: "0.04em",
      display: "flex", alignItems: "center", gap: "6px",
    },
  };

  return (
    <>
      <div style={s.root}>

        {/* Header */}
        <motion.div style={s.header} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p style={s.eyebrow}>Tech Arsenal · {tools.length} Tools</p>
          <h2 style={s.title}>3D Tool Deck</h2>
          <p style={s.subtitle}>drag · scroll · click to inspect</p>
        </motion.div>

        {/* Search + controls */}
        <motion.div style={s.controls} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div style={s.searchWrap}>
            <Search size={13} style={s.searchIcon} />
            <input
              placeholder="Search tools…"
              style={s.searchInput}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={e => e.target.style.borderColor = "rgba(190,116,79,0.55)"}
              onBlur={e => e.target.style.borderColor = "rgba(227,181,125,0.25)"}
            />
          </div>

          <button style={s.toolbarBtn(isAutoRotating)} onClick={() => setIsAutoRotating(v => !v)}>
            {isAutoRotating ? <Pause size={13} /> : <Play size={13} />}
            {isAutoRotating ? "Pause" : "Auto"}
          </button>
          <button style={s.toolbarBtn(false)} onClick={() => animateRotationTo(0, 400)}>
            <RotateCcw size={13} /> Reset
          </button>
          <button style={s.skillsBtn} onClick={() => setIsDrawerOpen(true)}>
            <Zap size={13} /> All Skills
          </button>
        </motion.div>

        {/* Category filters */}
        <motion.div style={{ ...s.filterRow, marginBottom: "6px", position: "relative", zIndex: 2 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.22 }}>
          {categories.map(cat => (
            <motion.button
              key={cat.id}
              style={s.filterBtn(activeCategory === cat.id, cat.id)}
              onClick={() => focusCategory(cat.id)}
              whileTap={{ scale: 0.95 }}
              animate={activeCategory === cat.id ? { y: [-1, 0] } : { y: 0 }}
            >
              {cat.id !== "all" && <span style={{ color: CATEGORY_META[cat.id]?.color }}>{CATEGORY_META[cat.id]?.glyph}</span>}
              {cat.label}
              <span style={s.countBadge(cat.id)}>
                {categoryCounts[cat.id]}
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* 3D Scene */}
        <motion.div
          ref={sceneContainerRef}
          style={{ ...s.scene, position: "relative", zIndex: 1 }}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={(e) => { e.currentTarget.releasePointerCapture(e.pointerId); stopDragging(); }}
          onPointerCancel={(e) => { e.currentTarget.releasePointerCapture(e.pointerId); stopDragging(); }}
          onWheel={onWheel}
        >
          <canvas ref={canvasRef} style={s.canvas} />

          {/* Inline label for active category */}
          <AnimatePresence>
            {activeCategory !== "all" && (
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                style={{
                  position: "absolute", top: "14px", left: "50%", transform: "translateX(-50%)",
                  background: "rgba(20,14,11,0.86)", border: "1px solid rgba(227,181,125,0.35)",
                  borderRadius: "999px", padding: "4px 14px", fontSize: "11px", fontFamily: "var(--button-font)",
                  color: "rgba(232,224,211,0.85)", letterSpacing: "0.1em", textTransform: "uppercase",
                  pointerEvents: "none",
                }}
              >
                {CATEGORY_META[activeCategory]?.glyph} {CATEGORY_META[activeCategory]?.label}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Drag hint */}
          {!isDragging && (
            <div style={{ position: "absolute", bottom: "14px", left: "50%", transform: "translateX(-50%)", fontSize: "10px", color: "rgba(180,140,100,0.35)", fontFamily: '"DM Mono", monospace', pointerEvents: "none", letterSpacing: "0.1em" }}>
              ← drag to rotate →
            </div>
          )}

          {/* Selected tool detail card */}
          <AnimatePresence>
            {selectedTool && (
              <motion.div
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.88 }}
                style={s.detailCard}
              >
                <button
                  onClick={() => setSelectedTool(null)}
                  style={{ position: "absolute", top: "10px", right: "10px", background: "none", border: "none", color: "rgba(196,132,90,0.5)", cursor: "pointer" }}
                >
                  <X size={14} />
                </button>
                <div style={{
                  width: "44px", height: "44px", borderRadius: "50%",
                  background: selectedTool.color + "22",
                  border: `1.5px solid ${selectedTool.color}88`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 12px",
                  fontSize: "18px", fontWeight: 700, color: selectedTool.color,
                  boxShadow: `0 0 20px ${selectedTool.color}33`,
                }}>
                  {selectedTool.name[0]}
                </div>
                <div style={{ fontSize: "17px", fontWeight: 700, color: "#f5ece0", marginBottom: "4px" }}>{selectedTool.name}</div>
                <div style={{ fontSize: "10px", fontFamily: '"DM Mono", monospace', letterSpacing: "0.12em", textTransform: "uppercase", color: CATEGORY_META[selectedTool.category]?.color, marginBottom: "10px" }}>
                  {CATEGORY_META[selectedTool.category]?.glyph} {selectedTool.category}
                </div>
                <div style={{ fontSize: "12.5px", color: "rgba(200,175,150,0.8)", lineHeight: 1.6 }}>{selectedTool.desc}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Speed control */}
        {isAutoRotating && (
          <motion.div style={s.speedRow} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <span style={s.speedLabel}>speed</span>
            <input
              type="range"
              min={2}
              max={30}
              value={autoRotateSpeed}
              onChange={e => setAutoRotateSpeed(Number(e.target.value))}
              style={s.speedSlider}
            />
            <span style={{ ...s.speedLabel, color: "rgba(196,132,90,0.9)" }}>{autoRotateSpeed}°/s</span>
          </motion.div>
        )}

      </div>

      {/* Hover tooltip (portal-like fixed) */}
      <AnimatePresence>
        {hoveredTool && !isDragging && !selectedTool && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              ...s.tooltip,
              left: tooltipPos.x + 16,
              top: tooltipPos.y - 10,
            }}
          >
            <div style={s.tooltipName}>{hoveredTool.name}</div>
            <div style={{ ...s.tooltipCat, color: CATEGORY_META[hoveredTool.category]?.color }}>
              {CATEGORY_META[hoveredTool.category]?.glyph} {hoveredTool.category}
            </div>
            <div style={s.tooltipDesc}>{hoveredTool.desc}</div>
            <div style={{ fontSize: "10px", color: "rgba(196,132,90,0.45)", marginTop: "6px", fontFamily: '"DM Mono", monospace' }}>click to inspect</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.button
              style={s.drawerOverlay}
              onClick={() => setIsDrawerOpen(false)}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              aria-label="Close"
            />
            <motion.aside
              style={s.drawer}
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <div style={s.drawerHeader}>
                <h3 style={s.drawerTitle}>All Skills <span style={{ color: "rgba(196,132,90,0.5)", fontSize: "13px", fontWeight: 400 }}>· {tools.length}</span></h3>
                <button style={s.drawerClose} onClick={() => setIsDrawerOpen(false)}><X size={14} /></button>
              </div>
              <div style={s.drawerBody}>
                {drawerCategories.map(cat => (
                  <div key={cat} style={s.drawerGroup}>
                    <div style={{ ...s.drawerGroupTitle, color: CATEGORY_META[cat].color }}>
                      <span>{CATEGORY_META[cat].glyph}</span>
                      {CATEGORY_META[cat].label}
                      <span style={{ color: "rgba(180,140,100,0.4)", fontSize: "9px" }}>({listedSkills[cat].length})</span>
                    </div>
                    <ul style={s.drawerList}>
                      {listedSkills[cat].map(tool => (
                        <li key={tool.name} style={s.drawerItem(tool.color)}>{tool.name}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
