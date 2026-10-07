import { Title2 } from "@components/core/Typography";
import { Section } from "@components/Section";
import ProjectsCards from "./ProjectsCards";
import { Card, cardProps } from "@components/Card";
import styles from "./ProjectsField.module.scss";
import { motion, useReducedMotion } from "framer-motion";
import {
  FALLBACK_ARCHITECTURE,
  FALLBACK_LOGO,
  FALLBACK_METRICS,
  FALLBACK_TECH_STACK,
} from "./featuredFallback";

const sectionVariants = {
  hidden: (reduceMotion: boolean) => ({
    opacity: 0,
    y: reduceMotion ? 0 : 20,
    scale: reduceMotion ? 1 : 0.99,
  }),
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 1, 0.5, 1],
      when: "beforeChildren",
      staggerChildren: 0.06,
    },
  },
};

const titleVariants = {
  hidden: (reduceMotion: boolean) => ({
    opacity: 0,
    y: reduceMotion ? 0 : 14,
    filter: reduceMotion ? "blur(0px)" : "blur(4px)",
  }),
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.45,
      ease: [0.25, 1, 0.5, 1],
    },
  },
};


const ProjectsField = ({ projects }: { projects: cardProps[] }) => {
  const reduceMotion = useReducedMotion() ?? false;
  const isCoreType = (type?: string) => {
    const normalized = type?.toLowerCase();
    return (
      normalized === "website" ||
      normalized === "ml" ||
      normalized === "machine learning" ||
      normalized === "other"
    );
  };
  const labProjects = projects.filter((project) => !isCoreType(project.type));
  const mainProjects = projects.filter((project) => isCoreType(project.type));
  // `featured` falls back to `isPrivate`, so the NDA card is already featured
  // before anyone ticks the flag in the studio.
  const isFeatured = (project: cardProps) =>
    project.featured ?? !!project.isPrivate;

  // Featured projects lead. A full-width card in the middle of a two-column
  // grid leaves an empty half-row above it whenever an odd number of cards
  // precede it, so the front is also the only safe position for it.
  const rank = (project: cardProps) =>
    (isFeatured(project) ? 1000 : 0) + (project.priority ?? 0);

  // Authored content always wins; the fallbacks only fill genuine gaps.
  const withFallbacks = (project: cardProps): cardProps =>
    isFeatured(project)
      ? {
          ...project,
          featured: true,
          metrics: project.metrics?.length ? project.metrics : FALLBACK_METRICS,
          architecture: project.architecture?.nodes?.length
            ? project.architecture
            : FALLBACK_ARCHITECTURE,
          techStack: project.techStack?.length
            ? project.techStack
            : FALLBACK_TECH_STACK,
          logoSrc: project.logoSrc ?? FALLBACK_LOGO.src,
          logoAlt: project.logoAlt ?? FALLBACK_LOGO.alt,
        }
      : project;

  // The featured project sits under the grid as one wide card, so it never
  // leaves a half-empty row in the two-column layout.
  const featuredProject = mainProjects.filter(isFeatured).map(withFallbacks)[0];
  const orderedMainProjects = mainProjects
    .filter((project) => !isFeatured(project))
    .sort((a, b) => rank(b) - rank(a));

  return (
    <>
      <Section variant="projects">
        <motion.div
          id="projects-grid"
          className={styles["projects__field"]}
          custom={reduceMotion}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: "some" }}
          variants={sectionVariants}
        >
          <motion.div variants={titleVariants} custom={reduceMotion}>
            <Title2>  My Projects  </Title2>
          </motion.div>
          <ProjectsCards projects={orderedMainProjects} />
          {featuredProject ? (
            <motion.div
              id="in-production"
              className={styles["projects__featured"]}
              variants={titleVariants}
              custom={reduceMotion}
            >
              <Card {...featuredProject} />
            </motion.div>
          ) : null}
        </motion.div>
      </Section>
      <Section variant="projects">
        <motion.div
          id="lab"
          className={`${styles["projects__field"]} ${styles["projects__field--lab"]}`}
          custom={reduceMotion}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: "some" }}
          variants={sectionVariants}
        >
          <motion.div variants={titleVariants} custom={reduceMotion}>
            <Title2>  Lab  </Title2>
          </motion.div>
          <ProjectsCards
            projects={labProjects}
            showImages={false}
            emptyLabel="No lab projects available yet"
          />
        </motion.div>
      </Section>
    </>
  );
};

export default ProjectsField;
