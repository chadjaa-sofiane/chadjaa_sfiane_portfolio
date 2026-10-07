// Ids match the role_<id> groups and clip names in public/3d/hero.glb.
export type RoleId = "hero" | "backend" | "frontend" | "ml" | "devops";

export const HERO_MODEL_URL = "/3d/hero.glb";

export const posterSrc = (role: RoleId) => `/3d/poster-${role}.webp`;
