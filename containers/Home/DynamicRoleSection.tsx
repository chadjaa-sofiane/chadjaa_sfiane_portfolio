import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Section, SectionContent } from "@components/Section";
import { HighlightedText } from "@components/core/Typography";
import { useSectionsProgress } from "@components/SectionsProgress";

// Import illustrations
import HeroIllustration from "./HeroSection/HeroIllustration";
import BackEndIllustration from "./sections/BackendSection/BackEndIllustration";
import FrontEndIllustration from "./sections/FrontEndSection/FrontEndIllustration";
import MLIllustration from "./sections/MLSection/MLIllustration";
import DevOpsIllustration from "./sections/DevOpsSection/DevOpsIllustration";

const roles = [
  {
    id: "hero",
    title: "Welcome to SoftFolio",
    description: (
      <>
        I build reliable web applications focused on clarity, performance and
        long-term maintenance.
        {/* Using */}
        {/* <HighlightedText>React</HighlightedText>,{" "} */}
        {/* <HighlightedText>Node.js</HighlightedText> and sound engineering */}
        practices.
      </>
    ),
    Illustration: HeroIllustration,
    variant: "dark",
  },
  {
    id: "backend",
    title: "Backend Developer",
    description: (
      <>
        Building stable APIs and data models with a focus on performance,
        security and clear integration points. Tech stack includes{" "}
        <HighlightedText>Node.js</HighlightedText>,{" "}
        <HighlightedText>Django</HighlightedText>, and {" "}
        <HighlightedText>Spring Boot</HighlightedText>,{" "}
      </>
    ),
    Illustration: BackEndIllustration,
    variant: "dark",
  },
  {
    id: "frontend",
    title: "Frontend Developer",
    description: (
      <>
        Creating accessible, responsive user interfaces by translating product
        goals into clean, reusable components. Primarily working with{" "}
        <HighlightedText>React</HighlightedText> and{" "}
        <HighlightedText>Next.js</HighlightedText>.
      </>
    ),
    Illustration: FrontEndIllustration,
    variant: "dark",
  },
  {
    id: "ml",
    title: "Machine Learning Focus",
    description: (
      <>
        Experience applying machine learning concepts in practical contexts,
        from experimentation to integration. Working with{" "}
        <HighlightedText>TensorFlow</HighlightedText> and{" "}
        <HighlightedText>PyTorch</HighlightedText> when the problem justifies
        it.
      </>
    ),
    Illustration: MLIllustration,
    variant: "dark",
  },
  {
    id: "devops",
    title: "DevOps & Deployment Practices",
    description: (
      <>
        Automating builds, deployments and monitoring to support reliable
        production systems. Using <HighlightedText>Docker</HighlightedText>,{" "}
        <HighlightedText>CI/CD</HighlightedText>,{" "}
        <HighlightedText>Jenkins</HighlightedText> and container-based
        workflows.
      </>
    ),
    Illustration: DevOpsIllustration,
    variant: "dark",
  },
];

const DynamicRoleSection = () => {
  const { ref } = useSectionsProgress();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % roles.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const currentRole = roles[currentIndex];
  const Illustration = currentRole.Illustration;

  return (
    <Section ref={ref} variant="dark">
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
            minHeight: "400px",
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
              title={currentRole.title}
              description={currentRole.description}
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </Section>
  );
};

export default DynamicRoleSection;
