import React, { useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Experience } from "./types";
import styles from "./ExperienceSection.module.scss";

interface ExperienceDetailOverlayProps {
    experience: Experience;
    onClose: () => void;
}

const ExperienceDetailOverlay: React.FC<ExperienceDetailOverlayProps> = ({
    experience,
    onClose,
}) => {
    const showLogo = Boolean(experience.logo) && !experience.company.includes("USTO");
    // Handle Escape key
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        },
        [onClose]
    );

    // Lock scroll and add keyboard listener
    useEffect(() => {
        document.body.style.overflow = "hidden";
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = "";
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleKeyDown]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
        exit: {
            opacity: 0,
            transition: { duration: 0.3 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" },
        },
    };

    const slideVariants = {
        hidden: { x: "100%" },
        visible: {
            x: 0,
            transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
        },
        exit: {
            x: "100%",
            transition: { duration: 0.4, ease: [0.55, 0.06, 0.68, 0.19] },
        },
    };

    return (
        <motion.div
            className={styles.overlayBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
        >
            <motion.div
                className={styles.overlayContent}
                variants={slideVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    className={styles.closeButton}
                    onClick={onClose}
                    aria-label="Close details"
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M18 6L6 18M6 6l12 12"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>

                {/* Header */}
                <motion.div
                    className={styles.detailHeader}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.span className={styles.detailPeriod} variants={itemVariants}>
                        {experience.period}
                    </motion.span>
                    <motion.div className={styles.detailCompanyRow} variants={itemVariants}>
                        {showLogo ? (
                            <div className={styles.detailCompanyMeta}>
                                <img
                                    src={experience.logo as string}
                                    alt={`${experience.company} logo`}
                                    className={styles.detailCompanyLogo}
                                    loading="lazy"
                                />
                            </div>
                        ) : null}
                        <h2 className={styles.detailCompany}>{experience.company}</h2>
                    </motion.div>
                    <motion.p className={styles.detailRole} variants={itemVariants}>
                        {experience.role}
                    </motion.p>
                    <motion.p className={styles.detailSummary} variants={itemVariants}>
                        {experience.summary}
                    </motion.p>
                </motion.div>

                {/* Duties Section */}
                <motion.section
                    className={styles.detailSection}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.h3 className={styles.sectionHeading} variants={itemVariants}>
                        <span className={styles.headingIcon}>💼</span>
                        Key Responsibilities
                    </motion.h3>
                    <div className={styles.dutiesGrid}>
                        {experience.duties.map((duty) => (
                            <motion.div
                                key={duty.id}
                                className={styles.dutyCard}
                                variants={itemVariants}
                            >
                                <h4 className={styles.dutyTitle}>{duty.title}</h4>
                                <p className={styles.dutyDescription}>{duty.description}</p>
                                <div className={styles.techList}>
                                    {duty.technologies.map((tech) => (
                                        <span key={tech} className={styles.techBadge}>
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Achievements Section */}
                <motion.section
                    className={styles.detailSection}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.h3 className={styles.sectionHeading} variants={itemVariants}>
                        <span className={styles.headingIcon}>🏆</span>
                        Key Achievements
                    </motion.h3>
                    <div className={styles.achievementsGrid}>
                        {experience.achievements.map((achievement) => (
                            <motion.div
                                key={achievement.id}
                                className={styles.achievementCard}
                                variants={itemVariants}
                            >
                                <h4 className={styles.achievementTitle}>
                                    {achievement.title}
                                </h4>
                                <p className={styles.achievementDescription}>
                                    {achievement.description}
                                </p>
                                <div className={styles.impactBadge}>
                                    <span className={styles.impactIcon}>⚡</span>
                                    {achievement.impact}
                                </div>
                                <div className={styles.techList}>
                                    {achievement.technologies.map((tech) => (
                                        <span key={tech} className={styles.techBadge}>
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Systems Section */}
                {experience.systems.length > 0 && (
                    <motion.section
                        className={styles.detailSection}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.h3 className={styles.sectionHeading} variants={itemVariants}>
                            <span className={styles.headingIcon}>🔧</span>
                            Systems & Platforms
                        </motion.h3>
                        <div className={styles.systemsGrid}>
                            {experience.systems.map((system) => (
                                <motion.div
                                    key={system.name}
                                    className={styles.systemCard}
                                    variants={itemVariants}
                                >
                                    <h4 className={styles.systemName}>{system.name}</h4>
                                    <p className={styles.systemDescription}>
                                        {system.description}
                                    </p>
                                    <ul className={styles.responsibilitiesList}>
                                        {system.responsibilities.map((resp, idx) => (
                                            <li key={idx}>{resp}</li>
                                        ))}
                                    </ul>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>
                )}
            </motion.div>
        </motion.div>
    );
};

export default ExperienceDetailOverlay;
