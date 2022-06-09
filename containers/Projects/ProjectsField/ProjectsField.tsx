import { useState, useMemo } from "react";
import { Title2 } from "@components/core/Typography";
import { Section } from "@components/Section";
import { Tabs, Tab } from "@components/core/Tabs";
import ProjectsCards from "./ProjectsCards";
import { cardProps } from "@components/Card";
import styles from "./ProjectsField.module.scss";


const ProjectsField = ({ projects }: { projects: cardProps[] }) => {
  const [type, setType] = useState("website");  

  const filterProjects = useMemo(() => projects.filter((p) => p.type === type), [type])

  const handleAction = (name: string) => setType(name);

  return (
    <Section>
      <div className={styles["projects__field"]}>
        <Title2>  My Projects  </Title2>
        <Tabs handleAction={handleAction} defaultValue={type} className={styles["projects__tabs"]}>
          <Tab name="website"> Websites </Tab>
          <Tab name="experiment"> Experiments </Tab>
          <Tab name="wordpress"> Wordpress </Tab>
        </Tabs>
        <ProjectsCards projects={filterProjects} />
      </div>
    </Section>
  );
};

export default ProjectsField;
