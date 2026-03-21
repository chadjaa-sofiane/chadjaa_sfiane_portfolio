import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
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
  Search,
  Server,
  Settings2,
  TerminalSquare,
  Workflow,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { ElementType } from "react";
import styles from "./TechStackSection.module.scss";

/* ─── Data ──────────────────────────────────────────────────────────────────── */

const CATEGORY_META: Record<string, { label: string; color: string; glyph: string }> = {
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

type CategoryId = "all" | ToolCategory;
type SkillCategory = Exclude<CategoryId, "all">;

const categories: { id: CategoryId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "backend", label: "Backend" },
  { id: "frontend", label: "Frontend" },
  { id: "infra", label: "Infra" },
  { id: "ai", label: "AI" },
];

/* ─── Marquee Row Component ─────────────────────────────────────────────────── */

const MarqueeRow = ({
  items,
  speed = 30,
  reverse = false,
  activeCategory,
}: {
  items: Tool[];
  speed?: number;
  reverse?: boolean;
  activeCategory: CategoryId;
}) => {
  const reduceMotion = useReducedMotion();
  // Double the items for seamless loop
  const doubled = useMemo(() => [...items, ...items], [items]);
  const duration = reduceMotion ? 0 : (items.length * speed) / 10;

  return (
    <div className={styles.marqueeRow}>
      <motion.div
        className={styles.marqueeTrack}
        animate={reduceMotion ? undefined : {
          x: reverse ? ["0%", "-50%"] : ["-50%", "0%"],
        }}
        transition={reduceMotion ? undefined : {
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration,
            ease: "linear",
          },
        }}
      >
        {doubled.map((tool, i) => {
          const isActive = activeCategory === "all" || tool.category === activeCategory;
          return (
            <motion.div
              key={`${tool.name}-${i}`}
              className={`${styles.toolPill} ${isActive ? styles.toolPillActive : styles.toolPillDimmed}`}
              style={{
                "--tool-color": tool.color,
                "--tool-color-dim": tool.color + "22",
              } as React.CSSProperties}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <span className={styles.toolIcon} aria-hidden="true">
                <tool.icon className={styles.toolIconSvg} />
              </span>
              <span className={styles.toolName}>{tool.name}</span>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

/* ─── Main Section ──────────────────────────────────────────────────────────── */

export default function TechStackSection() {
  const reduceMotion = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const categoryCounts = useMemo<Record<CategoryId, number>>(() => ({
    all: tools.length,
    backend: tools.filter(t => t.category === "backend").length,
    frontend: tools.filter(t => t.category === "frontend").length,
    infra: tools.filter(t => t.category === "infra").length,
    ai: tools.filter(t => t.category === "ai").length,
  }), []);

  const listedSkills = useMemo<Record<SkillCategory, Tool[]>>(() => ({
    backend: tools.filter(t => t.category === "backend"),
    frontend: tools.filter(t => t.category === "frontend"),
    infra: tools.filter(t => t.category === "infra"),
    ai: tools.filter(t => t.category === "ai"),
  }), []);

  const drawerCategories: SkillCategory[] = ["backend", "frontend", "infra", "ai"];

  // Split tools into rows for the marquee
  const rows = useMemo(() => {
    const perRow = Math.ceil(tools.length / 3);
    return [
      tools.slice(0, perRow),
      tools.slice(perRow, perRow * 2),
      tools.slice(perRow * 2),
    ];
  }, []);

  // Handle Escape key for drawer
  useEffect(() => {
    if (!isDrawerOpen) return;
    const onEsc = (e: KeyboardEvent) => { if (e.key === "Escape") setIsDrawerOpen(false); };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [isDrawerOpen]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isDrawerOpen]);

  return (
    <>
      <div className={styles.techSection}>
        {/* Ambient glow */}
        <div className={styles.ambientGlow} />

        {/* Header */}
        <motion.div
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: reduceMotion ? 0.01 : 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className={styles.eyebrow}>{tools.length} tools & technologies</span>
          <h2 className={styles.sectionTitle}>Tech Arsenal</h2>
          <p className={styles.sectionSubtitle}>
            The tools I use to build reliable, scalable systems
          </p>
        </motion.div>

        {/* Category filters */}
        <motion.div
          className={styles.filterRow}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: reduceMotion ? 0.01 : 0.5, delay: 0.15 }}
        >
          {categories.map(cat => (
            <motion.button
              key={cat.id}
              className={`${styles.filterBtn} ${activeCategory === cat.id ? styles.filterBtnActive : ""}`}
              onClick={() => setActiveCategory(cat.id)}
              whileTap={reduceMotion ? undefined : { scale: 0.95 }}
            >
              {cat.id !== "all" && (
                <span style={{ color: CATEGORY_META[cat.id]?.color }}>
                  {CATEGORY_META[cat.id]?.glyph}
                </span>
              )}
              {cat.label}
              <span className={styles.countBadge}>{categoryCounts[cat.id]}</span>
            </motion.button>
          ))}

          <button className={styles.allSkillsBtn} onClick={() => setIsDrawerOpen(true)}>
            <Zap size={13} />
            All Skills
          </button>
        </motion.div>

        {/* Marquee rows */}
        <motion.div
          className={styles.marqueeContainer}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: reduceMotion ? 0.01 : 0.8, delay: 0.3 }}
        >
          {rows.map((row, i) => (
            <MarqueeRow
              key={i}
              items={row}
              speed={28 + i * 8}
              reverse={i % 2 === 1}
              activeCategory={activeCategory}
            />
          ))}
        </motion.div>
      </div>

      {/* Skills Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              className={styles.drawerOverlay}
              onClick={() => setIsDrawerOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.aside
              className={styles.drawer}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className={styles.drawerHeader}>
                <h3 className={styles.drawerTitle}>
                  All Skills <span className={styles.drawerCount}>· {tools.length}</span>
                </h3>
                <button className={styles.drawerClose} onClick={() => setIsDrawerOpen(false)}>
                  <X size={16} />
                </button>
              </div>
              <div className={styles.drawerBody}>
                {drawerCategories.map(cat => (
                  <div key={cat} className={styles.drawerGroup}>
                    <div className={styles.drawerGroupTitle} style={{ color: CATEGORY_META[cat].color }}>
                      <span>{CATEGORY_META[cat].glyph}</span>
                      {CATEGORY_META[cat].label}
                      <span className={styles.drawerGroupCount}>({listedSkills[cat].length})</span>
                    </div>
                    <ul className={styles.drawerList}>
                      {listedSkills[cat].map(tool => (
                        <li
                          key={tool.name}
                          className={styles.drawerItem}
                          style={{
                            "--tool-color": tool.color,
                          } as React.CSSProperties}
                        >
                          {tool.name}
                        </li>
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
