import React from "react";
import Snow from "./Snow/Snow";
import styles from "./SeasonalEffects.module.scss";

// Define available seasons
export type Season = "winter" | "spring" | "autumn" | "none";

interface SeasonalEffectsProps {
    season?: Season;
    onSeasonChange?: React.Dispatch<React.SetStateAction<Season>>;
}

const seasonOptions: Array<{ label: string; value: Season }> = [
    { label: "Winter", value: "winter" },
    { label: "Spring", value: "spring" },
    { label: "Autumn", value: "autumn" },
    { label: "Off", value: "none" },
];

const SeasonalEffects: React.FC<SeasonalEffectsProps> = ({
    season = "none",
    onSeasonChange = () => null,
}) => {
    return (
        <>
            {season !== "none" ? <Snow season={season} /> : null}
            <div className={styles["seasonSwitch"]}>
                {seasonOptions.map((option) => (
                    <button
                        key={option.value}
                        type="button"
                        className={`${styles["seasonSwitch__button"]} ${season === option.value ? styles["seasonSwitch__button--active"] : ""}`}
                        onClick={() => onSeasonChange(option.value)}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </>
    );
};

export default SeasonalEffects;
