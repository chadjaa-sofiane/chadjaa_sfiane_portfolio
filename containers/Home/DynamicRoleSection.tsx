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
        I build fintech, IoT, and SaaS platforms — reliable systems for products
        where failure isn't cheap.
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
        Designing services and APIs that stay stable as systems grow. I focus on
        clear boundaries, predictable behavior, and maintainable architectures.
      </>
    ),
    Illustration: BackEndIllustration,
    variant: "dark",
  },
  {
    id: "frontend",
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
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            width: "100%",
          }}
        >
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
