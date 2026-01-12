import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import styles from "./ExperienceSection.module.scss";

interface TimelineLineProps {
    containerRef: React.RefObject<HTMLDivElement>;
}

const TimelineLine: React.FC<TimelineLineProps> = ({ containerRef }) => {
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    // Transform scroll progress to line height percentage
    const lineHeight = useTransform(scrollYProgress, [0, 0.8], ["0%", "100%"]);
    const glowOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

    return (
        <div className={styles.timelineLine}>
            {/* Background line (unfilled) */}
            <div className={styles.lineBackground} />

            {/* Animated fill line */}
            <motion.div
                className={styles.lineFill}
                style={{ height: lineHeight }}
            />

            {/* Glowing effect at the fill point */}
            <motion.div
                className={styles.lineGlow}
                style={{
                    top: lineHeight,
                    opacity: glowOpacity,
                }}
            />
        </div>
    );
};

export default TimelineLine;
