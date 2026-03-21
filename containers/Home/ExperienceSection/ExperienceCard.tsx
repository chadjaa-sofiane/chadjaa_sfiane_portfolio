import React, { useEffect, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
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
    const reduceMotion = useReducedMotion();

    const isInView = useInView(cardRef, {
        once: false,
        amount: 0.55,
        margin: "-10% 0px -35% 0px",
    });

    useEffect(() => {
        if (isInView && onInView) onInView(index);
    }, [index, isInView, onInView]);

    const enterX = reduceMotion ? 0 : isLeft ? -52 : 52;
    const showLogo = Boolean(experience.logo) && !experience.company.includes("USTO");

    return (
        <motion.div
            ref={cardRef}
            className={`${styles.experienceCard} ${isLeft ? styles.left : styles.right}`}
            initial={{
                opacity: 0,
                x: enterX,
                y: reduceMotion ? 0 : 44,
            }}
            animate={
                isInView
                    ? {
                          opacity: 1,
                          x: 0,
                          y: 0,
                      }
                    : {
                          opacity: 1,
                          x: 0,
                          y: 0,
                      }
            }
            transition={{
                duration: reduceMotion ? 0.01 : 0.28,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: reduceMotion ? 0 : index * 0.03,
            }}
        >
            <motion.div
                className={styles.timelineNode}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={
                    isInView
                        ? {
                              scale: 1,
                              opacity: 1,
                              boxShadow:
                                  "0 0 0 5px rgba(45, 180, 160, 0.25), 0 0 22px rgba(200, 130, 60, 0.3), 0 0 36px rgba(45, 180, 160, 0.15)",
                          }
                        : { scale: 1, opacity: 1, boxShadow: "0 0 0 3px rgba(200, 160, 110, 0.1), 0 0 12px rgba(200, 160, 110, 0.15)" }
                }
                transition={{
                    duration: reduceMotion ? 0.01 : 0.22,
                    delay: reduceMotion ? 0 : index * 0.03 + 0.04,
                    type: "spring",
                    stiffness: 300,
                    damping: 24,
                }}
            />

            <motion.div
                className={styles.cardContent}
                animate={
                    isInView
                        ? {
                              scale: reduceMotion ? 1 : 1.02,
                              backgroundColor: "rgba(200, 130, 60, 0.04)",
                              borderColor: "rgba(45, 180, 160, 0.5)",
                              boxShadow:
                                  "0 0 0 1px rgba(200, 130, 60, 0.3), 0 0 24px rgba(45, 180, 160, 0.15), 0 14px 36px rgba(0, 0, 0, 0.35)",
                          }
                        : {
                              scale: 1,
                              backgroundColor: "rgba(255, 255, 255, 0.02)",
                              borderColor: "rgba(200, 160, 110, 0.08)",
                              boxShadow: "none",
                          }
                }
                transition={{
                    duration: reduceMotion ? 0.01 : 0.26,
                    delay: reduceMotion ? 0 : index * 0.03 + 0.04,
                    ease: [0.25, 0.46, 0.45, 0.94],
                }}
                whileHover={
                    reduceMotion
                        ? undefined
                        : {
                              y: -5,
                              boxShadow:
                                  "0 0 0 1px rgba(45, 180, 160, 0.6), 0 0 28px rgba(45, 180, 160, 0.2), 0 18px 40px rgba(0, 0, 0, 0.35)",
                              borderColor: "rgba(45, 180, 160, 0.65)",
                          }
                }
                whileTap={reduceMotion ? undefined : { scale: 0.998 }}
            >
                <motion.span
                    className={styles.focusWash}
                    aria-hidden
                    animate={{ opacity: isInView && !reduceMotion ? 0.24 : 0 }}
                    transition={{ duration: reduceMotion ? 0.01 : 0.2 }}
                />

                <div className={styles.cardHeader}>
                    <span className={styles.period}>{experience.period}</span>
                    <div className={styles.companyTitleRow}>
                        {showLogo ? (
                            <div className={styles.companyMeta}>
                                <img
                                    src={experience.logo as string}
                                    alt={`${experience.company} logo`}
                                    className={styles.companyLogo}
                                    loading="lazy"
                                />
                            </div>
                        ) : null}
                        <h3 className={styles.company}>{experience.company}</h3>
                    </div>
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

                <motion.button
                    className={styles.detailsButton}
                    onClick={() => onViewDetails(experience)}
                    whileHover={reduceMotion ? undefined : { x: 3 }}
                    whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                >
                    <span>View Details</span>
                    <motion.svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        animate={reduceMotion ? undefined : { x: [0, 2, 0] }}
                        transition={{
                            duration: 1.8,
                            repeat: Infinity,
                            repeatDelay: 1.2,
                            ease: "easeInOut",
                        }}
                    >
                        <path
                            d="M5 12h14m-7-7l7 7-7 7"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </motion.svg>
                </motion.button>
            </motion.div>
        </motion.div>
    );
};

export default ExperienceCard;
