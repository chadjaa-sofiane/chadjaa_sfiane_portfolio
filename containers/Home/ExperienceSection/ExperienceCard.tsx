import React, { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Experience } from "./types";
import styles from "./ExperienceSection.module.scss";

interface ExperienceCardProps {
    experience: Experience;
    index: number;
    isLeft: boolean;
    onViewDetails: (experience: Experience) => void;
    onInView?: (index: number) => void;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({
    experience,
    index,
    isLeft,
    onViewDetails,
    onInView,
}) => {
    const cardRef = useRef(null);
    const isInView = useInView(cardRef, { once: true, amount: 0.3, margin: "0px 0px -100px 0px" });

    useEffect(() => {
        if (isInView && onInView) onInView(index);
    }, [isInView, index, onInView]);

    return (
        <motion.div
            ref={cardRef}
            className={`${styles.experienceCard} ${isLeft ? styles.left : styles.right}`}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{
                duration: 0.8,
                ease: [0.2, 0.65, 0.3, 0.9],
                delay: index * 0.1
            }}
        >
            {/* Timeline Node - Positioned on the center line */}
            <motion.div
                className={styles.timelineNode}
                initial={{ scale: 0, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.2, type: "spring", stiffness: 200 }}
            />

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

                <button
                    className={styles.detailsButton}
                    onClick={() => onViewDetails(experience)}
                >
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
