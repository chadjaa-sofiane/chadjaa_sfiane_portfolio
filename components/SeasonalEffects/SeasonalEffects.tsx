import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import SeasonCanvas from "./SeasonCanvas";

export type ActiveSeason = "winter" | "spring" | "summer" | "autumn";
export type Season = ActiveSeason | "none";

const SEASONS: ActiveSeason[] = ["winter", "spring", "summer", "autumn"];

/** Meteorological seasons, northern hemisphere: Dec-Feb is winter, and so on. */
export const seasonFor = (date: Date): ActiveSeason => SEASONS[Math.floor(((date.getMonth() + 1) % 12) / 3)];

/**
 * Picks the season from today's date. `?season=winter|spring|summer|autumn|none`
 * overrides it, which is handy for previewing. Nothing renders for visitors who
 * prefer reduced motion.
 */
export const useSeason = (): Season => {
  const [season, setSeason] = useState<Season>("none");
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("season");
    const valid = requested && ([...SEASONS, "none"] as string[]).includes(requested);
    setSeason(valid ? (requested as Season) : seasonFor(new Date()));
  }, []);
  return season;
};

const SeasonalEffects = ({ season }: { season: Season }) => {
  const reduceMotion = useReducedMotion();
  return (
    <AnimatePresence>
      {season !== "none" && !reduceMotion ? (
        <motion.div
          key={season}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 1.2, delay: 0.8 } }}
          exit={{ opacity: 0 }}
        >
          <SeasonCanvas season={season} />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default SeasonalEffects;
