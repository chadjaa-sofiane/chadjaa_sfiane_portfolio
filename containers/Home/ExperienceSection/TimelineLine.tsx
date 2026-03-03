import React from "react";
import { motion } from "framer-motion";
import styles from "./ExperienceSection.module.scss";

interface TimelineLineProps {
    numberOfCards: number;
    filledUpToIndex: number;
}

const TimelineLine: React.FC<TimelineLineProps> = ({
    numberOfCards,
    filledUpToIndex,
}) => {
    const fillPercentage =
        numberOfCards <= 0
            ? 0
            : filledUpToIndex < 0
              ? 0
              : ((filledUpToIndex + 1) / numberOfCards) * 100;

    return (
        <div className={styles.timelineLine}>
            {/* Present Indicator (Top) */}
            <div className={styles.presentIndicator}>
                <div className={styles.pulseDisk} />
                <span className={styles.presentLabel}>Present</span>
            </div>

            {/* Background line (unfilled) */}
            <div className={styles.lineBackground} />

            {/* Segment-based fill: grows as each card enters view */}
            <motion.div
                className={styles.lineFill}
                initial={{ height: "0%" }}
                animate={{ height: `${fillPercentage}%` }}
                transition={{
                    duration: 0.7,
                    ease: [0.25, 0.46, 0.45, 0.94],
                }}
            />
        </div>
    );
};

export default TimelineLine;
