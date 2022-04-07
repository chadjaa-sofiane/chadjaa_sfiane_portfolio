// import { Tab, Tabs } from "@components/core/Tabs";
import { Title2 } from "@components/core/Typography";
import { Section } from "@components/Section";
import ProjectsCards from "./ProjectsCards";
import styles from "./ProjectsField.module.scss";

styles;

const ProjectsField = ({ projects }: any) => {
  return (
    <Section>
      <div className={styles["projects__field"]}>
        <Title2>  My Projects  </Title2>
        {/* <Tabs className={styles["projects__tabs"]} defaultValue="all">
          <Tab name="all"> all </Tab>
          <Tab name="FRONT-END"> front-end </Tab>
          <Tab name="BACK-END"> back-end </Tab>
          <Tab name="WORDPRESS"> Wordpress </Tab>
        </Tabs> */}
        <ProjectsCards projects={projects} />
      </div>
    </Section>
  );
};

export default ProjectsField;
