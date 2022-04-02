import { Tab, Tabs } from "@components/core/Tabs";
import { Section } from "@components/Section";
import ProjectsCards from "./ProjectsCards";
import styles from "./ProjectsField.module.scss";

styles;

const ProjectsField = () => {
  return (
    <Section>
      <div className={styles["projects__field"]}>
        <Tabs className={styles["projects__tabs"]} defaultValue="all">
          <Tab name="all"> all </Tab>
          <Tab name="FRONT-END"> front-end </Tab>
          <Tab name="BACK-END"> back-end </Tab>
          <Tab name="WORDPRESS"> Wordpress </Tab>
        </Tabs>
        <ProjectsCards />
      </div>
    </Section>
  );
};

export default ProjectsField;
