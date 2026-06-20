import { Card } from "@components/Card";
import styles from "./ProjectsField.module.scss";
import { cardProps } from "@components/Card"
import { Title3 } from "@components/core/Typography";
import { motion, useReducedMotion } from "framer-motion";

const cardsVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.04,
    },
  },
};

const cardVariants = {
  hidden: (reduceMotion: boolean) => ({
    opacity: 0,
    y: reduceMotion ? 0 : 24,
    scale: reduceMotion ? 1 : 0.96,
    rotateX: reduceMotion ? 0 : 5,
    transformPerspective: 1000,
  }),
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: {
      duration: 0.45,
      ease: [0.25, 1, 0.5, 1],
    },
  },
};


const ProjectsCards = ({
  projects,
  showImages = true,
  emptyLabel = "No projects available yet",
  pinPrivate = false,
  highlightPrivate = false,
}: {
  projects: cardProps[];
  showImages?: boolean;
  emptyLabel?: string;
  pinPrivate?: boolean;
  highlightPrivate?: boolean;
}) => {
  const reduceMotion = useReducedMotion() ?? false;
  const orderedProjects = pinPrivate
    ? [...projects].sort(
        (a, b) => (b.isPrivate ? 1 : 0) - (a.isPrivate ? 1 : 0)
      )
    : projects;
  return (
    <motion.div
      className={styles["projects__cards__field"]}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
      variants={cardsVariants}
    >
      {
        orderedProjects?.map((project: cardProps) => (
          <motion.div
            key={project.id}
            className={`${styles["projects__cards__item"]} ${
              highlightPrivate && project.isPrivate
                ? styles["projects__card--wide"]
                : ""
            }`}
            custom={reduceMotion}
            variants={cardVariants}
          >
            <Card
              {...project}
              showImage={showImages}
              cardClassName={
                highlightPrivate && project.isPrivate
                  ? styles["projects__card--wide"]
                  : undefined
              }
            />
          </motion.div>
        ))
      }
      {(!projects || projects.length === 0) && <EmptyProjectsCards label={emptyLabel} />}
    </motion.div>
  );
};

const EmptyProjectsCards = ({ label }: { label: string }) => {
  return (
    <div className={styles["projects__cards__empty"]}>
      <Title3> {label} </Title3>
    </div>
  );
}

export default ProjectsCards;
