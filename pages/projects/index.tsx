import Head from "next/head";
import { ProjectsField, ProjectsHero } from "containers/Projects";

const Projects = () => {
  return (
    <>
      <Head>
        <title> Projects </title>
      </Head>
      <ProjectsHero />
      <ProjectsField />
    </>
  );
};

Projects.headerColor = "dark";

export default Projects;
