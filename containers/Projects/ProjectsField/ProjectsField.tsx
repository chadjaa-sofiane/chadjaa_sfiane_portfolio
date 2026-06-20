import { Title2 } from "@components/core/Typography";
import { Section } from "@components/Section";
import ProjectsCards from "./ProjectsCards";
import { cardProps } from "@components/Card";
import styles from "./ProjectsField.module.scss";
import { motion, useReducedMotion } from "framer-motion";

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
  const orderedMainProjects = [...mainProjects].sort(
    (a, b) => (a.isPrivate ? 1 : 0) - (b.isPrivate ? 1 : 0)
  );

  return (
    <>
      <Section variant="projects">
        <motion.div
          className={styles["projects__field"]}
          custom={reduceMotion}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.18 }}
          variants={sectionVariants}
        >
          <motion.div variants={titleVariants} custom={reduceMotion}>
            <Title2>  My Projects  </Title2>
          </motion.div>
          <ProjectsCards
            projects={orderedMainProjects}
            highlightPrivate
          />
        </motion.div>
      </Section>
      <Section variant="projects">
        <motion.div
          className={`${styles["projects__field"]} ${styles["projects__field--lab"]}`}
          custom={reduceMotion}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.18 }}
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
