import { ProjectArchitecture, ProjectMetric } from "@components/Card/types";

/**
 * Scaffolding for the featured card so it is populated before anything is
 * authored in the studio. Anything set in Sanity wins over these values.
 *
 * No invented performance figures. The counts below are measured from the
 * deployment manifests of the two real platforms (21 services in the 3SMAX
 * compose file, 8 in the TMS one), and the stack and diagram are taken from
 * what those repositories actually run. Nothing here names a client, a third
 * party, a hostname or an internal product beyond the two system names this
 * site already publishes.
 *
 * Real uptime/latency numbers would be better still, but they are yours to
 * state, not mine to guess:
 *   Studio → Projects → Production Work → Metrics
 */
export const FALLBACK_METRICS: ProjectMetric[] = [
  {
    label: "Containerised services",
    value: "29",
    caption: "Across both production platforms",
  },
  {
    label: "Production platforms",
    value: "2",
    caption: "3SMAX and the TMS platform",
  },
  {
    label: "In production since",
    value: "2024",
    caption: "Continuous delivery to live users",
  },
];

/**
 * The shape both platforms share: a reverse proxy in front, an identity
 * provider beside the APIs rather than inside them, separate stores for
 * relational and time-series data, and a broker fanning commands out to
 * hardware. Product names and third parties are deliberately absent.
 */
export const FALLBACK_ARCHITECTURE: ProjectArchitecture = {
  drawing: {
    src: "/diagrams/production-architecture.svg",
    mobileSrc: "/diagrams/production-architecture-mobile.svg",
    source: "/diagrams/production-architecture.excalidraw",
  },
  nodes: [
    { id: "client", label: "Client", kind: "client", x: 1, y: 46 },
    { id: "proxy", label: "Nginx", kind: "gateway", x: 23, y: 46 },
    { id: "identity", label: "Identity", kind: "service", x: 47, y: 4 },
    { id: "api", label: "API", kind: "service", x: 47, y: 46 },
    { id: "sql", label: "Postgres", kind: "datastore", x: 74, y: 8 },
    { id: "tsdb", label: "Metrics", kind: "datastore", x: 74, y: 50 },
    { id: "broker", label: "Broker", kind: "queue", x: 74, y: 96 },
    { id: "devices", label: "Devices", kind: "external", x: 99, y: 96 },
  ],
  edges: [
    { from: "client", to: "proxy" },
    { from: "proxy", to: "identity" },
    { from: "proxy", to: "api" },
    { from: "api", to: "sql" },
    { from: "api", to: "tsdb" },
    { from: "api", to: "broker", kind: "async" },
    { from: "broker", to: "devices", kind: "async", label: "MQTT" },
  ],
};

export const FALLBACK_LOGO = { src: "/images/logos/3spay.webp", alt: "3S Pay" };

export const FALLBACK_TECH_STACK = [
  "TypeScript",
  "Node.js",
  "Java",
  "Spring Boot",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "InfluxDB",
  "Keycloak",
  "MQTT",
  "Docker",
  "Jenkins",
  "Grafana",
  "React",
];
