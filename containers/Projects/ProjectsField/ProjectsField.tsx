import { Title2 } from "@components/core/Typography";
import { Section } from "@components/Section";
import ProjectsCards from "./ProjectsCards";
import { cardProps } from "@components/Card";
import styles from "./ProjectsField.module.scss";
import { useRef } from "react";


const ProjectsField = ({ projects }: { projects: cardProps[] }) => {
  const divRef = useRef(null);
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
        <div className={styles["projects__field"]} ref={divRef}>
          <Title2>  My Projects  </Title2>
          <ProjectsCards
            projects={orderedMainProjects}
            highlightPrivate
          />
        </div>
      </Section>
      <Section variant="projects">
        <div
          className={`${styles["projects__field"]} ${styles["projects__field--lab"]}`}
        >
          <Title2>  Lab  </Title2>
          <ProjectsCards
            projects={labProjects}
            showImages={false}
            emptyLabel="No lab projects available yet"
          />
        </div>
      </Section>
    </>
  );
};

export default ProjectsField;
