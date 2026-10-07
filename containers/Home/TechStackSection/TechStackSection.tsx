import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
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
} from "lucide-react";
import type { ElementType } from "react";
import { useSectionsProgress } from "@components/SectionsProgress";
import HomeSection from "../HomeSection/HomeSection";
import { posterSrc, RoleId } from "../HeroScene/roles";
import styles from "./TechStackSection.module.scss";

type Tool = { name: string; icon: ElementType; desc: string };

/**
 * Each discipline is introduced by the same diorama the hero builds for it,
 * so the 3D language carries on below the fold.
 */
const groups: { id: string; title: string; summary: string; poster: RoleId; tools: Tool[] }[] = [
  {
    id: "backend",
    title: "Backend",
    summary: "APIs, data and the services between them.",
    poster: "backend",
    tools: [
      { name: "Node.js", icon: Server, desc: "JS runtime for scalable server-side applications" },
      { name: "TypeScript", icon: Braces, desc: "Typed superset of JavaScript for safer codebases" },
      { name: "Java", icon: Workflow, desc: "Enterprise-grade OOP language" },
      { name: "Spring Boot", icon: Layers3, desc: "Opinionated Spring framework for microservices" },
      { name: "PostgreSQL", icon: Database, desc: "Advanced open-source relational database" },
      { name: "MongoDB", icon: Database, desc: "Document-oriented NoSQL database" },
      { name: "Redis", icon: Database, desc: "In-memory data structure store & cache" },
      { name: "REST APIs", icon: MonitorSmartphone, desc: "HTTP-based API design standard" },
      { name: "GraphQL", icon: Network, desc: "Query language for flexible APIs" },
      { name: "Microservices", icon: Layers3, desc: "Distributed service architecture pattern" },
      { name: "JWT", icon: KeyRound, desc: "Compact token format for auth" },
    ],
  },
  {
    id: "frontend",
    title: "Frontend",
    summary: "Interfaces that stay clear as products grow.",
    poster: "frontend",
    tools: [
      { name: "React", icon: Boxes, desc: "Component-driven UI library by Meta" },
      { name: "Next.js", icon: Globe, desc: "Full-stack React framework with SSR & SSG" },
      { name: "Tailwind CSS", icon: Boxes, desc: "Utility-first CSS framework" },
      { name: "Redux Toolkit", icon: Boxes, desc: "Predictable state management for React" },
      { name: "Webpack", icon: Settings2, desc: "Module bundler for modern JS apps" },
    ],
  },
  {
    id: "infra",
    title: "Infrastructure",
    summary: "Shipping, running and watching it in production.",
    poster: "devops",
    tools: [
      { name: "Docker", icon: Container, desc: "Container platform for consistent deployments" },
      { name: "Kubernetes", icon: CloudCog, desc: "Container orchestration at scale" },
      { name: "Nginx", icon: Network, desc: "High-performance reverse proxy & web server" },
      { name: "CI/CD", icon: Settings2, desc: "Automated build, test, and deploy pipelines" },
      { name: "GitHub Actions", icon: Workflow, desc: "Native CI/CD automation within GitHub" },
      { name: "Jenkins", icon: Wrench, desc: "Open-source automation server" },
      { name: "Linux", icon: TerminalSquare, desc: "Foundation OS for servers and development" },
      { name: "Git", icon: Workflow, desc: "Distributed version control system" },
      { name: "Prometheus", icon: CloudCog, desc: "Time-series metrics and alerting" },
      { name: "Grafana", icon: CloudCog, desc: "Observability dashboards for metrics" },
      { name: "Keycloak", icon: KeyRound, desc: "Open-source IAM & SSO solution" },
      { name: "MQTT", icon: Network, desc: "Lightweight messaging protocol for IoT" },
    ],
  },
  {
    id: "ai",
    title: "AI & agents",
    summary: "Models wired into real product workflows.",
    poster: "ml",
    tools: [
      { name: "LLM APIs", icon: BrainCircuit, desc: "Integration with OpenAI, Anthropic, etc." },
      { name: "RAG Pipelines", icon: BrainCircuit, desc: "Retrieval-Augmented Generation systems" },
      { name: "LangChain", icon: BrainCircuit, desc: "Framework for LLM-powered applications" },
      { name: "Prompt Eng.", icon: BrainCircuit, desc: "Crafting effective prompts for LLMs" },
      { name: "Automation", icon: Bot, desc: "Workflow automation & scripted orchestration" },
    ],
  },
];

const toolCount = groups.reduce((sum, group) => sum + group.tools.length, 0);

export default function TechStackSection() {
  const { ref } = useSectionsProgress();
  const reduceMotion = useReducedMotion();

  return (
    <HomeSection
      ref={ref}
      id="stack"
      index="01"
      label="Stack"
      title={<>The whole stack, <em>end to end.</em></>}
      lede={`${toolCount} tools I reach for, grouped by the part of a product they serve.`}
    >
      <div className={styles.grid}>
        {groups.map((group, i) => (
          <motion.article
            key={group.id}
            className={styles.card}
            initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: reduceMotion ? 0 : 0.55, delay: reduceMotion ? 0 : i * 0.07, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={styles.visual}>
              <Image
                src={posterSrc(group.poster)}
                alt=""
                fill
                sizes="(max-width: 45rem) 90vw, (max-width: 75rem) 45vw, 300px"
                className={styles.poster}
              />
            </div>
            <div className={styles.body}>
              <div className={styles.cardHead}>
                <h3>{group.title}</h3>
                <span>{String(group.tools.length).padStart(2, "0")}</span>
              </div>
              <p className={styles.summary}>{group.summary}</p>
              <ul className={styles.tools}>
                {group.tools.map((tool) => (
                  <li key={tool.name} title={tool.desc}>
                    <tool.icon aria-hidden="true" />
                    {tool.name}
                  </li>
                ))}
              </ul>
            </div>
          </motion.article>
        ))}
      </div>
    </HomeSection>
  );
}
