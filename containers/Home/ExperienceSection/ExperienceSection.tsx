import { Section } from "@components/Section";
import { useSectionsProgress } from "@components/SectionsProgress";
import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback, useEffect, useState } from "react";
import ExperienceCard from "./ExperienceCard";
import ExperienceDetailOverlay from "./ExperienceDetailOverlay";
import styles from "./ExperienceSection.module.scss";
import TimelineLine from "./TimelineLine";
import { Experience } from "./types";

const ExperienceSection: React.FC = () => {
  const { ref: sectionProgressRef } = useSectionsProgress();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedExperience, setSelectedExperience] =
    useState<Experience | null>(null);
  const [highestCardIndexInView, setHighestCardIndexInView] = useState(-1);

  const setSectionRef = useCallback(
    (el: HTMLDivElement | null) => {
      (
        sectionProgressRef as React.MutableRefObject<HTMLDivElement | null>
      ).current = el;
    },
    [sectionProgressRef],
  );

  const handleCardInView = (index: number) => {
    setHighestCardIndexInView((prev) => Math.max(prev, index));
  };

  const handleViewDetails = (experience: Experience) => {
    setSelectedExperience(experience);
  };

  const handleCloseDetails = () => {
    setSelectedExperience(null);
  };

  // Fetch experiences data
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        // Fetch the list of experience files
        // For now, we'll fetch the known files directly
        const experienceFiles = [
          "3spay.json",
          "datamaster.json",
          "freelance.json",
        ];

        const experienceData = await Promise.all(
          experienceFiles.map(async (filename) => {
            const response = await fetch(`/data/experiences/${filename}`);
            return response.json() as Promise<Experience>;
          }),
        );

        setExperiences(experienceData);
      } catch (error) {
        console.error("Error fetching experiences:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <Section ref={setSectionRef} variant="dark">
      <div className={styles.experienceSection}>
        {/* Section Header */}
        <motion.div
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.sectionTitle}>Professional Experience</h2>
          <p className={styles.sectionSubtitle}>
            My journey building reliable systems and growing as an engineer
          </p>
        </motion.div>

        {/* Timeline Container */}
        <div className={styles.timelineContainer}>
          <TimelineLine
            numberOfCards={experiences.length}
            filledUpToIndex={highestCardIndexInView}
          />

          <div className={styles.cardsContainer}>
            {experiences.map((experience, index) => (
              <ExperienceCard
                key={experience.company}
                experience={experience}
                index={index}
                isLeft={index % 2 === 0}
                onViewDetails={handleViewDetails}
                onInView={handleCardInView}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Experience Detail Overlay */}
      <AnimatePresence>
        {selectedExperience && (
          <ExperienceDetailOverlay
            experience={selectedExperience}
            onClose={handleCloseDetails}
          />
        )}
      </AnimatePresence>
    </Section>
  );
};

export default ExperienceSection;
