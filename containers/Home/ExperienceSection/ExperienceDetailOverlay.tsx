import React, { useCallback, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { splitName } from "./splitName";
import { Experience } from "./types";
import styles from "./ExperienceDetailOverlay.module.scss";

interface ExperienceDetailOverlayProps {
  experience: Experience;
  onClose: () => void;
}

/** Mono section marker, the same "01 Label" pattern as the home sections. */
const Marker = ({ index, label }: { index: number; label: string }) => (
  <h3 className={styles.marker}>
    <span>{String(index).padStart(2, "0")}</span>
    {label}
  </h3>
);

const Chips = ({ items }: { items: string[] }) =>
  items.length ? (
    <ul className={styles.chips}>
      {items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  ) : null;

const ExperienceDetailOverlay: React.FC<ExperienceDetailOverlayProps> = ({ experience, onClose }) => {
  const reduceMotion = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const { name, org } = splitName(experience.company);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const ease = [0.22, 1, 0.36, 1];
  const list = {
    hidden: {},
    visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.06, delayChildren: reduceMotion ? 0 : 0.15 } },
  };
  const item = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 14 },
    visible: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : 0.45, ease } },
  };

  const sections = [
    experience.duties.length > 0 && "duties",
    experience.achievements.length > 0 && "achievements",
    experience.systems.length > 0 && "systems",
  ].filter(Boolean) as string[];
  const indexOf = (id: string) => sections.indexOf(id) + 1;

  return (
    <motion.div
      className={styles.backdrop}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <motion.aside
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-labelledby="experience-detail-title"
        initial={{ x: reduceMotion ? 0 : "100%", opacity: reduceMotion ? 0 : 1 }}
        animate={{ x: 0, opacity: 1, transition: { duration: reduceMotion ? 0.2 : 0.5, ease } }}
        exit={{ x: reduceMotion ? 0 : "100%", opacity: reduceMotion ? 0 : 1, transition: { duration: 0.35, ease: [0.55, 0.06, 0.68, 0.19] } }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.topBar}>
          <span className={styles.period}>{experience.period}</span>
          <button ref={closeRef} type="button" className={styles.close} onClick={onClose} aria-label="Close details">
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <motion.div variants={list} initial="hidden" animate="visible">
          <motion.header className={styles.header} variants={item}>
            <div className={styles.nameRow}>
              {experience.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={experience.logo} alt="" className={styles.logo} />
              ) : (
                <span className={styles.logoFallback} aria-hidden="true">{name.charAt(0)}</span>
              )}
              <h2 id="experience-detail-title" className={styles.name}>{name}</h2>
            </div>
            <p className={styles.role}>{org ? `${experience.role} · ${org}` : experience.role}</p>
            <p className={styles.summary}>{experience.summary}</p>
          </motion.header>

          {experience.duties.length > 0 && (
            <motion.section className={styles.section} variants={item}>
              <Marker index={indexOf("duties")} label="Responsibilities" />
              <ol className={styles.ledger}>
                {experience.duties.map((duty) => (
                  <li key={duty.id}>
                    <h4>{duty.title}</h4>
                    <p>{duty.description}</p>
                    <Chips items={duty.technologies} />
                  </li>
                ))}
              </ol>
            </motion.section>
          )}

          {experience.achievements.length > 0 && (
            <motion.section className={styles.section} variants={item}>
              <Marker index={indexOf("achievements")} label="Achievements" />
              <ol className={styles.ledger}>
                {experience.achievements.map((achievement) => (
                  <li key={achievement.id}>
                    <h4>{achievement.title}</h4>
                    <p>{achievement.description}</p>
                    {achievement.impact && <p className={styles.impact}>{achievement.impact}</p>}
                    <Chips items={achievement.technologies} />
                  </li>
                ))}
              </ol>
            </motion.section>
          )}

          {experience.systems.length > 0 && (
            <motion.section className={styles.section} variants={item}>
              <Marker index={indexOf("systems")} label="Systems" />
              <ol className={styles.ledger}>
                {experience.systems.map((system) => (
                  <li key={system.name}>
                    <h4>{system.name}</h4>
                    <p>{system.description}</p>
                    {system.responsibilities.length > 0 && (
                      <ul className={styles.points}>
                        {system.responsibilities.map((point) => <li key={point}>{point}</li>)}
                      </ul>
                    )}
                  </li>
                ))}
              </ol>
            </motion.section>
          )}
        </motion.div>
      </motion.aside>
    </motion.div>
  );
};

export default ExperienceDetailOverlay;
