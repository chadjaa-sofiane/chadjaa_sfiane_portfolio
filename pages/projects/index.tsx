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
export default Projects;