import Head from "next/head";
import { GetServerSideProps } from "next";
import { useEffect } from "react"
import { ProjectsField, ProjectsHero } from "containers/Projects";
import { cardProps } from "@components/Card"
import { client, urlFor } from "@services/sanity";


const Projects = ({ projects = [] }: { projects: cardProps[] }) => {
  useEffect(() => {
    document.documentElement.style.scrollSnapType = "y proximity";
    return () => {
      document.documentElement.style.scrollSnapType = "y mandatory";
    }
  }, []);

  return (
    <>
      <Head>
        <title> Projects </title>
      </Head>
      <ProjectsHero />
      <ProjectsField projects={projects} />
    </>
  );
};

const TYPES = ["website", "experiment", "wordpress"];

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const type = query?.type as string || "";

  if (!TYPES.includes(type)) {
    return {
      redirect: {
        permanent: false,
        destination: "/projects?type=website",
      },
      props: {}
    }
  }

  const dataQuery = `*[_type == 'projects' && type == '${type}']`;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const projects = (await client.fetch(dataQuery)).map((project: any) => (
    {
      ...project,
      id: project._id,
      imageSrc: urlFor(project.image).url() || undefined,
    }
  ));
  return {
    props: {
      projects
    }
  }
}


export default Projects;