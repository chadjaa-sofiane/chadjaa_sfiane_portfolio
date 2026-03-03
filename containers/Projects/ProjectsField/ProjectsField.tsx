import { Title2 } from "@components/core/Typography";
import { Section } from "@components/Section";
import ProjectsCards from "./ProjectsCards";
import { cardProps } from "@components/Card";
import styles from "./ProjectsField.module.scss";
import { useRef } from "react";


const ProjectsField = ({ projects }: { projects: cardProps[] }) => {
  const divRef = useRef(null);

  return (
    <Section variant="projects">
      <div className={styles["projects__field"]} ref={divRef}>
        <Title2>  My Projects  </Title2>
        <ProjectsCards projects={projects} />
      </div>
    </Section>
  );
};

export default ProjectsField;
