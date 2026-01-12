import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Section } from "@components/Section";
import { useSectionsProgress } from "@components/SectionsProgress";
import ExperienceCard from "./ExperienceCard";
import TimelineLine from "./TimelineLine";
import { Experience } from "./types";
import styles from "./ExperienceSection.module.scss";

const ExperienceSection: React.FC = () => {
    const { ref } = useSectionsProgress();
    const containerRef = useRef<HTMLDivElement>(null);
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch experiences data
    useEffect(() => {
        const fetchExperiences = async () => {
            try {
                // Fetch the list of experience files
                // For now, we'll fetch the known files directly
                const experienceFiles = ["3spay.json", 'datamaster.json'];

                const experienceData = await Promise.all(
                    experienceFiles.map(async (filename) => {
                        const response = await fetch(`/data/experiences/${filename}`);
                        return response.json() as Promise<Experience>;
                    })
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
        <Section ref={ref} variant="dark">
            <div className={styles.experienceSection} ref={containerRef}>
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
                    <TimelineLine containerRef={containerRef} />

                    {/* Experience Cards */}
                    <div className={styles.cardsContainer}>
                        {experiences.map((experience, index) => (
                            <ExperienceCard
                                key={experience.company}
                                experience={experience}
                                index={index}
                                isLeft={index % 2 === 0}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </Section>
    );
};

export default ExperienceSection;
