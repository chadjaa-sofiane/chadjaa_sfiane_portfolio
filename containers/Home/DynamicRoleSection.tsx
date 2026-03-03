import React, { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
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

const SECTION_DISPLAY_DURATION = 6000; // 6 seconds per section

const roles = [
  {
    id: "hero",
    title: "Sofiane Chadjaa",
    description: (
      <>
        Full-stack engineer with 6+ years building secure, scalable software
        from architecture to production.
      </>
    ),
    Illustration: HeroIllustration,
    variant: "dark",
  },
  {
    id: "backend",
    title: "Backend & System Design",
    description: (
      <>
        I design resilient services, APIs, and integration boundaries with a
        system-level focus on security, performance, and maintainability.
      </>
    ),
    Illustration: BackEndIllustration,
    variant: "dark",
  },
  {
    id: "frontend",
    title: "Product-Facing Engineering",
    description: (
      <>
        I build clean, responsive interfaces that turn product requirements
        into reliable user experiences and maintainable delivery workflows.
      </>
    ),
    Illustration: FrontEndIllustration,
    variant: "dark",
  },
  {
    id: "ml",
    title: "AI & Agent Systems",
    description: (
      <>
        I build practical AI workflows and agents that combine automation,
        APIs, and language models for real-world outcomes.
      </>
    ),
    Illustration: MLIllustration,
    variant: "dark",
  },
  {
    id: "devops",
    title: "Infrastructure & Reliability",
    description: (
      <>
        I set up environments from scratch to keep deployment pipelines secure,
        observable, and stable across releases.
      </>
    ),
    Illustration: DevOpsIllustration,
    variant: "dark",
  },
];

const DynamicRoleSection = () => {
  const { ref } = useSectionsProgress();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotate sections
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % roles.length);
    }, SECTION_DISPLAY_DURATION);

    return () => clearInterval(interval);
  }, [currentIndex]); // Reset timer when index changes (including manual navigation)

  // Handle manual section selection
  const handleSectionSelect = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const currentRole = roles[currentIndex];
  const Illustration = currentRole.Illustration;

  return (
    <Section ref={ref} variant="dark">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          minHeight: "550px",
        }}
      >
        <div style={{ flex: 1, display: "flex", alignItems: "center", width: "100%" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentRole.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              style={{
                display: "flex",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                gap: "2em",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  flex: 1,
                  minWidth: "300px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Illustration />
              </div>

              <div style={{ flex: 1, minWidth: "300px" }}>
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
