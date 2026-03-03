/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";

interface SectionIndicatorProps {
    totalSections: number;
    currentIndex: number;
    onSelect: (...args: [number]) => void;
}

const SectionIndicator: React.FC<SectionIndicatorProps> = ({
    totalSections,
    currentIndex,
    onSelect,
}) => {
    return (
        <div
            style={{
                marginTop: "auto",
                paddingTop: "1rem",
                paddingBottom: "1rem",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "12px",
            }}
        >
            {Array.from({ length: totalSections }).map((_, index) => {
                const isActive = index === currentIndex;
                return (
                    <motion.button
                        key={index}
                        onClick={() => onSelect(index)}
                        aria-label={`Go to section ${index + 1}`}
                        aria-current={isActive ? "true" : undefined}
                        initial={false}
                        animate={{
                            width: isActive ? 48 : 14,
                            backgroundColor: isActive
                                ? "rgba(255, 255, 255, 0.9)"
                                : "transparent",
                        }}
                        whileHover={{
                            scale: 1.1,
                            backgroundColor: isActive
                                ? "rgba(255, 255, 255, 1)"
                                : "rgba(255, 255, 255, 0.25)",
                        }}
                        whileTap={{ scale: 0.95 }}
                        transition={{
                            width: { type: "spring", stiffness: 300, damping: 25 },
                            backgroundColor: { duration: 0.2 },
                        }}
                        style={{
                            height: 14,
                            borderRadius: 10,
                            border: "2px solid rgba(255, 255, 255, 0.5)",
                            cursor: "pointer",
                            padding: 0,
                            outline: "none",
                        }}
                    />
                );
            })}
        </div>
    );
};

export default SectionIndicator;
