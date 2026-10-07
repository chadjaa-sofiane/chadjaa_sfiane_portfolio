import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { MousePointerClick } from "lucide-react";
import { Hotspot, PROJECTS_POSTER } from "./ProjectsScene";
import styles from "./ProjectsHero.module.scss";

const ProjectsScene = dynamic(() => import("./ProjectsScene"), { ssr: false });

const supportsWebGL = () => {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
};

const ProjectsHero = () => {
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef, { amount: 0.1 });
  const reduceMotion = useReducedMotion();
  const [live, setLive] = useState(false);
  const [ready, setReady] = useState(false);
  const [spot, setSpot] = useState<Hotspot | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    setLive(!reduceMotion && supportsWebGL());
  }, [reduceMotion]);

  const handleReady = useCallback(() => setReady(true), []);
  const handleSelect = useCallback(({ target }: Hotspot) => {
    document.getElementById(target)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }, [reduceMotion]);

  const entrance = (delay: number) => ({
    initial: { opacity: 0, transform: reduceMotion ? "none" : "translateY(16px)" },
    animate: { opacity: 1, transform: "translateY(0px)" },
    transition: { duration: reduceMotion ? 0 : 0.6, delay: reduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <section className={styles.hero} aria-labelledby="projects-title">
      <div className={styles.intro}>
        <motion.h1 {...entrance(0)} id="projects-title">
          My <em>Projects<span>.</span></em>
        </motion.h1>
        <motion.p {...entrance(0.08)} className={styles.pitch}>
          Websites, machine-learning models, production systems and a few lab experiments.
        </motion.p>
      </div>

      <motion.div {...entrance(0.1)} ref={stageRef} className={styles.stage}>
        <div className={styles.halo} aria-hidden="true" />
        <Image
          src={PROJECTS_POSTER}
          alt=""
          fill
          priority
          sizes="(max-width: 64rem) 100vw, 60vw"
          className={`${styles.poster} ${ready ? styles.posterHidden : ""}`}
        />
        {live && (
          <div className={`${styles.canvas} ${ready ? styles.canvasReady : ""}`} aria-hidden="true">
            <ProjectsScene active={inView} onReady={handleReady} onHover={setSpot} onSelect={handleSelect} />
          </div>
        )}
        {live && (
          <p className={styles.caption} aria-live="polite">
            <MousePointerClick size={14} aria-hidden="true" />
            {spot ? <>Open <strong>{spot.label}</strong></> : "Drag to rotate · click a piece to jump to it"}
          </p>
        )}
      </motion.div>
    </section>
  );
};

export default ProjectsHero;
