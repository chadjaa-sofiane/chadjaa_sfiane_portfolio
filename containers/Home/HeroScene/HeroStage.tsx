import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Move3d } from "lucide-react";
import { posterSrc, RoleId } from "./roles";
import styles from "./HeroStage.module.scss";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

/** Matches the old illustrations' pacing when there is no live scene. */
const POSTER_DURATION = 3200;

const supportsWebGL = () => {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
};

interface Props {
  roles: RoleId[];
  role: RoleId;
  /** In view and the tab is visible. */
  active: boolean;
  reduceMotion: boolean;
  onComplete: () => void;
}

/**
 * Cycles-rendered posters paint first (and are all that reduced-motion and
 * no-WebGL visitors get); the live three.js scene is loaded after hydration
 * and fades in over them once its first frame is up.
 */
const HeroStage = ({ roles, role, active, reduceMotion, onComplete }: Props) => {
  const [live, setLive] = useState(false);
  const [ready, setReady] = useState(false);
  const completeRef = useRef(onComplete);
  completeRef.current = onComplete;

  useEffect(() => {
    setLive(!reduceMotion && supportsWebGL());
  }, [reduceMotion]);

  // Poster mode still has to tell the parent when a role is "done".
  useEffect(() => {
    if (live || !active || reduceMotion) return;
    const timer = window.setTimeout(() => completeRef.current(), POSTER_DURATION);
    return () => window.clearTimeout(timer);
  }, [live, active, reduceMotion, role]);

  return (
    <div className={styles.stage}>
      <div className={`${styles.posters} ${ready ? styles.postersHidden : ""}`}>
        {roles.map((id) => (
          <Image
            key={id}
            src={posterSrc(id)}
            alt=""
            fill
            sizes="(max-width: 45rem) 100vw, 60vw"
            priority={id === roles[0]}
            className={`${styles.poster} ${id === role ? styles.posterActive : ""}`}
          />
        ))}
      </div>
      {live && (
        <div className={`${styles.canvas} ${ready ? styles.canvasReady : ""}`}>
          <span className={styles.hint} aria-hidden="true">
            <Move3d size={14} /> Drag to rotate
          </span>
          <HeroScene
            role={role}
            active={active}
            onReady={() => setReady(true)}
            onComplete={(finished) => {
              if (finished === role) completeRef.current();
            }}
          />
        </div>
      )}
    </div>
  );
};

export default HeroStage;
