// Content model for the featured project card. Mirrors the object types in
// portfolio-admin/schemas/{metric,archNode,archEdge,captionedImage}.js
// Every field is optional on the consuming side: the Sanity fields start empty,
// so each surface has to render nothing rather than empty chrome.

export interface ProjectMetric {
  label: string;
  value: string;
  unit?: string;
  caption?: string;
  /** Optional series drawn as a sparkline. Needs at least 2 points. */
  trend?: number[];
}

export type ArchNodeKind =
  | "service"
  | "datastore"
  | "queue"
  | "gateway"
  | "client"
  | "external";

export interface ArchNode {
  id: string;
  label: string;
  kind?: ArchNodeKind;
  /** Authored percentages, 0-100, relative to the diagram box. */
  x: number;
  y: number;
}

export interface ArchEdge {
  from: string;
  to: string;
  label?: string;
  /** async edges render dashed. */
  kind?: "sync" | "async";
}

export interface ProjectArchitecture {
  nodes?: ArchNode[];
  edges?: ArchEdge[];
  /** Excalidraw exports for the curated fallback; authored graphs stay data-driven. */
  drawing?: { src: string; mobileSrc: string; source: string };
}

/** A gallery entry after the raw Sanity image has been resolved to a CDN URL. */
export interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}
