import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Snow from "./Snow/Snow";
import styles from "./SeasonalEffects.module.scss";

// Define available seasons
export type Season = "winter" | "spring" | "summer" | "autumn" | "none";

interface SeasonalEffectsProps {
    season?: Season;
    onSeasonChange?: React.Dispatch<React.SetStateAction<Season>>;
}

const seasonOptions: Array<{ label: string; value: Season; emoji: string }> = [
    { label: "Winter", value: "winter", emoji: "❄️" },
    { label: "Spring", value: "spring", emoji: "🌸" },
    { label: "Summer", value: "summer", emoji: "☀️" },
    { label: "Autumn", value: "autumn", emoji: "🍂" },
    { label: "Off", value: "none", emoji: "✦" },
];

const SeasonalEffects: React.FC<SeasonalEffectsProps> = ({
    season = "none",
    onSeasonChange = () => null,
}) => {
    return (
        <>
            <AnimatePresence mode="wait">
                {season !== "none" ? <Snow key={season} season={season} /> : null}
            </AnimatePresence>
            <motion.div
                className={styles["seasonSwitch"]}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
            >
                {seasonOptions.map((option) => (
                    <button
                        key={option.value}
                        type="button"
                        className={`${styles["seasonSwitch__button"]} ${season === option.value ? styles["seasonSwitch__button--active"] : ""}`}
                        onClick={() => onSeasonChange(option.value)}
                        aria-label={`Switch to ${option.label} theme`}
                    >
                        {season === option.value && (
                            <motion.span
                                className={styles["seasonSwitch__indicator"]}
                                layoutId="seasonIndicator"
                                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                            />
                        )}
                        <span className={styles["seasonSwitch__emoji"]}>{option.emoji}</span>
                        <span className={styles["seasonSwitch__label"]}>{option.label}</span>
                    </button>
                ))}
            </motion.div>
        </>
    );
};

export default SeasonalEffects;
