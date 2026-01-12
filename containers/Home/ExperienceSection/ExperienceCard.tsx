import React from "react";
import { motion } from "framer-motion";
import { Experience } from "./types";
import styles from "./ExperienceSection.module.scss";

interface ExperienceCardProps {
    experience: Experience;
    index: number;
    isLeft: boolean;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({
    experience,
    index,
    isLeft,
}) => {
    return (
        <motion.div
            className={`${styles.experienceCard} ${isLeft ? styles.left : styles.right}`}
            initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
        >
            {/* Timeline Node */}
            <div className={styles.timelineNode}>
                <motion.div
                    className={styles.nodeInner}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
                />
            </div>

            {/* Card Content */}
            <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                    <span className={styles.period}>{experience.period}</span>
                    <h3 className={styles.company}>{experience.company}</h3>
                    <p className={styles.role}>{experience.role}</p>
                </div>

                <p className={styles.summary}>{experience.summary}</p>

                <div className={styles.techTags}>
                    {experience.duties.slice(0, 3).map((duty) => (
                        <span key={duty.id} className={styles.tag}>
                            {duty.title}
                        </span>
                    ))}
                </div>

                <button className={styles.detailsButton}>
                    <span>View Details</span>
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M5 12h14m-7-7l7 7-7 7"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
            </div>
        </motion.div>
    );
};

export default ExperienceCard;
