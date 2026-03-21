import React, { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Section, SectionContent } from "@components/Section";
import { useSectionsProgress } from "@components/SectionsProgress";
import { SectionIndicator } from "@components/SectionIndicator";

// Import illustrations
import HeroIllustration from "./HeroSection/HeroIllustration";
import BackEndIllustration from "./sections/BackendSection/BackEndIllustration";
import FrontEndIllustration from "./sections/FrontEndSection/FrontEndIllustration";
import MLIllustration from "./sections/MLSection/MLIllustration";
import DevOpsIllustration from "./sections/DevOpsSection/DevOpsIllustration";
import styles from "./DynamicRoleSection.module.scss";

const SECTION_DISPLAY_DURATION = 6000;

const roles = [
  {
    id: "hero",
    eyebrow: "Full-Stack Engineer",
    title: "Sofiane Chadjaa",
    description: (
      <>
        I build fintech, IoT, and SaaS platforms — reliable systems for products
        where failure isn't cheap.
      </>
    ),
    Illustration: HeroIllustration,
    variant: "dark",
  },
  {
    id: "backend",
    eyebrow: "Systems & APIs",
    title: "Backend & System Design",
    description: (
      <>
        Designing services and APIs that stay stable as systems grow. I focus on
        clear boundaries, predictable behavior, and maintainable architectures.
      </>
    ),
    Illustration: BackEndIllustration,
    variant: "dark",
  },
  {
    id: "frontend",
    eyebrow: "Interfaces & UX",
    title: "Frontend Engineering",
    description: (
      <>
        Building interfaces that translate product ideas into dependable user
        experiences without sacrificing simplicity or maintainability.
      </>
    ),
    Illustration: FrontEndIllustration,
    variant: "dark",
  },
  {
    id: "ml",
    eyebrow: "AI & Agents",
    title: "AI & Automation",
    description: (
      <>
        Creating practical AI workflows and agents that combine language models,
        APIs, and automation to solve real-world tasks.
      </>
    ),
    Illustration: MLIllustration,
    variant: "dark",
  },
  {
    id: "devops",
    eyebrow: "CI/CD & Cloud",
    title: "Infrastructure & Deployment",
    description: (
      <>
        Setting up environments and deployment pipelines from scratch to keep
        systems secure, observable, and reliable in production.
      </>
    ),
    Illustration: DevOpsIllustration,
    variant: "dark",
  },
];

const DynamicRoleSection = () => {
  const { ref } = useSectionsProgress();
  const [currentIndex, setCurrentIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % roles.length);
    }, SECTION_DISPLAY_DURATION);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleSectionSelect = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const currentRole = roles[currentIndex];
  const Illustration = currentRole.Illustration;

  return (
    <Section ref={ref} variant="dark">
      <div className={styles.heroSection}>
        <div className={styles.heroInner}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentRole.id}
              className={styles.heroLayout}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduceMotion ? 0 : -10 }}
              transition={{
                duration: reduceMotion ? 0.01 : 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className={styles.heroIllustration}>
                <Illustration />
              </div>

              <div className={styles.heroContent}>
                <motion.span
                  className={styles.roleEyebrow}
                  initial={{ opacity: 0, x: reduceMotion ? 0 : -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: reduceMotion ? 0 : 0.15, duration: 0.4 }}
                >
                  {currentRole.eyebrow}
                </motion.span>
                <motion.div
                  className={styles.accentLine}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: reduceMotion ? 0 : 0.2, duration: 0.5, ease: "easeOut" }}
                  style={{ transformOrigin: "left" }}
                />
                <SectionContent
                  className={styles.roleContent}
                  title={currentRole.title}
                  description={currentRole.description}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <SectionIndicator
          totalSections={roles.length}
          currentIndex={currentIndex}
          onSelect={handleSectionSelect}
        />
      </div>
    </Section>
  );
};

export default DynamicRoleSection;
