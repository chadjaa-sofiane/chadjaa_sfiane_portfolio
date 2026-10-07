import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useSectionsProgress } from "@components/SectionsProgress";
import HeroStage from "./HeroScene/HeroStage";
import { RoleId } from "./HeroScene/roles";
import styles from "./DynamicRoleSection.module.scss";

// The diorama cycles through these on its own; no controls.
const roleIds: RoleId[] = ["hero", "backend", "frontend", "ml", "devops"];

const FINISHED_HOLD_DURATION = 600;

const DynamicRoleSection = () => {
  const { ref } = useSectionsProgress();
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef, { amount: 0.2 });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedIndex, setCompletedIndex] = useState<number | null>(null);
  const [pageVisible, setPageVisible] = useState(true);
  const reduceMotion = useReducedMotion();
  const playing = !reduceMotion && inView && pageVisible;
  const handleIllustrationComplete = useCallback(() => {
    setCompletedIndex(currentIndex);
  }, [currentIndex]);

  useEffect(() => {
    const updateVisibility = () => setPageVisible(!document.hidden);
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  useEffect(() => {
    if (!inView || !pageVisible) setCompletedIndex(null);
  }, [inView, pageVisible]);

  useEffect(() => {
    if (!playing || completedIndex !== currentIndex) return;
    const timer = window.setTimeout(() => {
      setCompletedIndex(null);
      setCurrentIndex((index) => (index + 1) % roleIds.length);
    }, FINISHED_HOLD_DURATION);
    return () => window.clearTimeout(timer);
  }, [completedIndex, currentIndex, playing]);

  const entrance = (delay: number) => ({
    initial: { opacity: 0, transform: reduceMotion ? "none" : "translateY(16px)" },
    animate: { opacity: 1, transform: "translateY(0px)" },
    transition: { duration: reduceMotion ? 0 : 0.6, delay: reduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <section ref={ref} className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.layout}>
        <div className={styles.intro}>
          <motion.h1 {...entrance(0)} id="hero-title">
            Sofiane <em>Chadjaa<span>.</span></em>
          </motion.h1>
          <motion.p {...entrance(0.08)} className={styles.pitch}>
            Full-stack engineer building payment platforms, IoT device control and SaaS products.
          </motion.p>
          <motion.div {...entrance(0.16)} className={styles.actions}>
            <Link href="/projects" className={styles.primaryLink}>
              Explore my work <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </motion.div>
        </div>

        <motion.div
          {...entrance(0.1)}
          ref={stageRef}
          className={styles.stage}
        >
          <div className={styles.halo} aria-hidden="true" />
          <div className={styles.scene} aria-hidden="true">
            <HeroStage
              roles={roleIds}
              role={roleIds[currentIndex]}
              active={inView && pageVisible}
              reduceMotion={!!reduceMotion}
              onComplete={handleIllustrationComplete}
            />
          </div>
        </motion.div>
      </div>

    </section>
  );
};

export default DynamicRoleSection;
