import { ProjectsField, ProjectsHero } from "containers/Projects";
import Head from "next/head";

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
