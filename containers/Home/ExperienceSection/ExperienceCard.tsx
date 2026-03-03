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
                                  "0 0 0 6px rgba(163, 230, 53, 0.34), 0 0 28px rgba(234, 179, 8, 0.42), 0 0 44px rgba(163, 230, 53, 0.22)",
                          }
                        : { scale: 1, opacity: 1, boxShadow: "0 0 0 4px rgba(167, 139, 250, 0.15), 0 0 15px rgba(167, 139, 250, 0.3)" }
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
                              scale: reduceMotion ? 1 : 1.03,
                              backgroundColor: "rgba(255, 255, 255, 0.1)",
                              borderColor: "rgba(163, 230, 53, 0.75)",
                              boxShadow:
                                  "0 0 0 1px rgba(234, 179, 8, 0.75), 0 0 30px rgba(163, 230, 53, 0.24), 0 18px 42px rgba(3, 7, 18, 0.42)",
                          }
                        : {
                              scale: 1,
                              backgroundColor: "rgba(255, 255, 255, 0.03)",
                              borderColor: "rgba(255, 255, 255, 0.05)",
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
                              y: -6,
                              boxShadow:
                                  "0 0 0 1px rgba(132, 204, 22, 0.95), 0 0 34px rgba(163, 230, 53, 0.28), 0 22px 44px rgba(3, 7, 18, 0.38)",
                              borderColor: "rgba(132, 204, 22, 0.95)",
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
