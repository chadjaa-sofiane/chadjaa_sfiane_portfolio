import { useSectionsProgress } from "@components/SectionsProgress";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import HomeSection from "../HomeSection/HomeSection";
import ExperienceDetailOverlay from "./ExperienceDetailOverlay";
import styles from "./ExperienceSection.module.scss";
import { splitName } from "./splitName";
import { Experience } from "./types";

const GROUPS = [
  { title: "Work", files: ["3spay.json", "datamaster.json", "freelance.json"] },
  { title: "Education", files: ["master.json", "bachelor.json"] },
];

const ExperienceSection: React.FC = () => {
  const { ref } = useSectionsProgress();
  const reduceMotion = useReducedMotion();
  const [groups, setGroups] = useState<{ title: string; items: Experience[] }[]>([]);
  const [selected, setSelected] = useState<Experience | null>(null);

  useEffect(() => {
    Promise.all(
      GROUPS.map(async (group) => ({
        title: group.title,
        items: await Promise.all(
          group.files.map(async (file) => (await fetch(`/data/experiences/${file}`)).json() as Promise<Experience>),
        ),
      })),
    )
      .then(setGroups)
      .catch((error) => console.error("Error fetching experiences:", error));
  }, []);

  return (
    <HomeSection
      ref={ref}
      id="experience"
      index="02"
      label="Experience"
      title={<>Shipping to production <em>since 2020.</em></>}
      lede="Payments, IoT device control and internal platforms, most of it under NDA. Open a role for the systems and decisions behind it."
    >
      {groups.map((group) => (
        <div key={group.title} className={styles.group}>
          <h3 className={styles.groupTitle}>{group.title}</h3>
          <ol className={styles.ledger}>
            {group.items.map((experience, i) => {
              const { name, org } = splitName(experience.company);
              return (
                <motion.li
                  key={experience.company}
                  initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                >
                  <button type="button" className={styles.row} onClick={() => setSelected(experience)}>
                    <span className={styles.period}>{experience.period}</span>
                    <span className={styles.main}>
                      <span className={styles.nameRow}>
                        {experience.logo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={experience.logo} alt="" className={styles.logo} loading="lazy" />
                        ) : (
                          <span className={styles.logoFallback} aria-hidden="true">{name.charAt(0)}</span>
                        )}
                        <span className={styles.name}>{name}</span>
                      </span>
                      <span className={styles.role}>{org ? `${experience.role} · ${org}` : experience.role}</span>
                      <span className={styles.summary}>{experience.summary}</span>
                      <span className={styles.tags}>
                        {experience.duties.slice(0, 3).map((duty) => <span key={duty.id}>{duty.title}</span>)}
                      </span>
                    </span>
                    <span className={styles.open}>
                      Details <ArrowUpRight size={16} aria-hidden="true" />
                    </span>
                  </button>
                </motion.li>
              );
            })}
          </ol>
        </div>
      ))}

      <AnimatePresence>
        {selected && <ExperienceDetailOverlay experience={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </HomeSection>
  );
};

export default ExperienceSection;
