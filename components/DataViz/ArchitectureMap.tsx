import { ArchEdge, ArchNode, ProjectArchitecture } from "@components/Card/types";
import styles from "./DataViz.module.scss";
import { Activity, Cpu, Database, Monitor, Network, Radio, Server, ShieldCheck } from "lucide-react";

/**
 * A small system diagram drawn from authored coordinates.
 *
 * Coordinates are authored (x/y percentages in Sanity) rather than computed:
 * a force layout is non-deterministic, so the server and client would disagree
 * during hydration, and at this size a solver produces a worse picture than a
 * person does. Authored positions are deterministic and the author can see
 * exactly what the reader will see.
 */

const VB_W = 320;
const VB_H = 180;

// Inset the plot so node labels never touch the edge of the box.
const px = (x: number) => 24 + (Math.max(0, Math.min(100, x)) / 100) * 272;
const py = (y: number) => 22 + (Math.max(0, Math.min(100, y)) / 100) * 130;

const KIND_CLASS: Record<string, string> = {
  service: styles["kind--service"],
  datastore: styles["kind--datastore"],
  queue: styles["kind--queue"],
  external: styles["kind--external"],
  client: styles["kind--client"],
  gateway: styles["kind--gateway"],
};

/**
 * Six kinds share three colours and three shapes, so the legend describes the
 * visual groups rather than the kinds. Listing six entries against three marks
 * would tell the reader something the diagram does not actually show.
 */
const KIND_GROUP: Record<string, { id: string; label: string }> = {
  service: { id: "service", label: "Service" },
  datastore: { id: "data", label: "Data / queue" },
  queue: { id: "data", label: "Data / queue" },
  external: { id: "edge", label: "Client / edge" },
  client: { id: "edge", label: "Client / edge" },
  gateway: { id: "edge", label: "Client / edge" },
};

const groupOf = (kind?: string) => KIND_GROUP[kind || "service"] || KIND_GROUP.service;

const kindClass = (kind?: string) =>
  KIND_CLASS[kind || "service"] || styles["kind--service"];

/** Shape carries identity alongside hue, so the map survives colour blindness. */
const NodeMark = ({ node }: { node: ArchNode }) => {
  const identity = /identity|auth/i.test(`${node.id} ${node.label}`);
  const metrics = /metric|time.series/i.test(node.label);
  const Icon = identity ? ShieldCheck : metrics ? Activity
    : node.kind === "client" ? Monitor
    : node.kind === "gateway" ? Network
    : node.kind === "datastore" ? Database
    : node.kind === "queue" ? Radio
    : node.kind === "external" ? Cpu : Server;
  return <Icon x={-8} y={-8} width={16} height={16} strokeWidth={1.7}
    className={kindClass(node.kind)} aria-hidden="true" />;
};

interface Props {
  architecture?: ProjectArchitecture;
  /**
   * Unique per rendered instance. SVG marker ids are document-global, so two
   * maps on one page would otherwise collide. React 18's useId is unavailable
   * here because @types/react is pinned at 17, so the id is passed in.
   */
  instanceId: string;
  caption?: string;
}

const ArchitectureMap = ({ architecture, instanceId, caption }: Props) => {
  const rawNodes = architecture?.nodes ?? [];

  // First declaration of an id wins; later duplicates would make edges ambiguous.
  const byId = new Map<string, ArchNode>();
  rawNodes.forEach((node) => {
    if (node?.id && !byId.has(node.id)) byId.set(node.id, node);
  });
  const nodes = [...byId.values()];

  if (nodes.length < 2) return null;

  if (architecture?.drawing) {
    return (
      <figure className={styles.archDrawing}>
        <picture>
          <source media="(max-width: 45rem)" srcSet={architecture.drawing.mobileSrc} />
          {/* Native picture selects the separately composed mobile SVG. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={architecture.drawing.src} width={900} height={440} loading="lazy"
            alt={caption || "System architecture: Client through Nginx to identity and API services; API connects to Postgres, metrics, and a broker that communicates with devices over MQTT."} />
        </picture>
        {/* The drawing carries its own legend. */}
        {caption ? <figcaption>{caption}</figcaption> : null}
      </figure>
    );
  }

  // Sanity cannot enforce that an edge references a real node id, so drop the
  // ones that do not resolve rather than rendering a line to nowhere.
  const edges = (architecture?.edges ?? []).filter(
    (edge: ArchEdge) => edge?.from && edge?.to && byId.has(edge.from) && byId.has(edge.to),
  );

  const groups = nodes.reduce<{ id: string; label: string; kind: string }[]>(
    (acc, node) => {
      const kind = node.kind || "service";
      const group = groupOf(kind);
      if (!acc.some((entry) => entry.id === group.id)) {
        acc.push({ ...group, kind });
      }
      return acc;
    },
    [],
  );
  const markerId = `arch-arrow-${instanceId}`;

  return (
    <div className={styles["archMap"]}>
      <svg
        className={styles["archMap__svg"]}
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={caption || "System architecture diagram"}
      >
        <title>{caption || "System architecture diagram"}</title>

        <defs>
          <marker
            id={markerId}
            viewBox="0 0 8 8"
            refX={7}
            refY={4}
            markerWidth={5}
            markerHeight={5}
            orient="auto-start-reverse"
          >
            <path d="M0 0 L8 4 L0 8 z" fill="hsl(var(--viz-rail) / 0.45)" />
          </marker>
        </defs>

        {/* Edges first so vertices paint on top of them. */}
        <g>
          {edges.map((edge, index) => {
            const from = byId.get(edge.from) as ArchNode;
            const to = byId.get(edge.to) as ArchNode;
            const x1 = px(from.x);
            const y1 = py(from.y);
            const x2 = px(to.x);
            const y2 = py(to.y);
            // Orthogonal elbows read more cleanly than diagonals on a grid.
            const mx = (x1 + x2) / 2;
            const d =
              Math.abs(y1 - y2) < 6
                ? `M ${x1} ${y1} L ${x2} ${y2}`
                : `M ${x1} ${y1} H ${mx} V ${y2} H ${x2}`;
            return (
              <g key={`${edge.from}-${edge.to}-${index}`}>
                <path
                  className={`${styles["edge"]} ${
                    edge.kind === "async" ? styles["edge--async"] : ""
                  }`}
                  d={d}
                  markerEnd={`url(#${markerId})`}
                />
                {edge.label ? (
                  <text
                    className={styles["edgeLabel"]}
                    x={mx}
                    y={(y1 + y2) / 2 - 3}
                    textAnchor="middle"
                  >
                    {edge.label}
                  </text>
                ) : null}
              </g>
            );
          })}
        </g>

        <g>
          {nodes.map((node) => (
            <g key={node.id} transform={`translate(${px(node.x)} ${py(node.y)})`}>
              <circle className={`${styles["nodeGlow"]} ${kindClass(node.kind)}`} r={11} />
              <NodeMark node={node} />
              <text className={styles["nodeLabel"]} y={19} textAnchor="middle">
                {node.label}
              </text>
            </g>
          ))}
        </g>
      </svg>

      {groups.length > 1 ? (
        <ul className={styles["legend"]}>
          {groups.map((group) => (
            <li key={group.id} className={styles["legend__item"]}>
              <span
                className={`${styles["legend__dot"]} ${kindClass(group.kind)}`}
              />
              {group.label}
            </li>
          ))}
        </ul>
      ) : null}

      {caption ? <p className={styles["archMap__caption"]}>{caption}</p> : null}
    </div>
  );
};

export default ArchitectureMap;
