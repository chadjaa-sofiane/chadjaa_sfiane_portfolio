import { useRouter } from "next/router";
import { Title2 } from "@components/core/Typography";
import { Section } from "@components/Section";
import { Tabs, Tab } from "@components/core/Tabs";
import ProjectsCards from "./ProjectsCards";
import { cardProps } from "@components/Card";
import styles from "./ProjectsField.module.scss";
import { useRef } from "react";


const ProjectsField = ({ projects }: { projects: cardProps[] }) => {
  const { push } = useRouter();

  const divRef = useRef(null);
  const handleAction = (name: string) => push({
    pathname: "/projects",
    query: { type: name },
  }, undefined, { scroll: false });

  return (
    <Section>
      <div className={styles["projects__field"]} ref={divRef}>
        <Title2>  My Projects  </Title2>
        <Tabs handleAction={handleAction} defaultValue="website" className={styles["projects__tabs"]}>
          <Tab name="website"> Websites </Tab>
          <Tab name="experiment"> Experiments </Tab>
          <Tab name="ML"> Machine Learning </Tab>
        </Tabs>
        <ProjectsCards projects={projects} />
      </div>
    </Section>
  );
};

export default ProjectsField;
