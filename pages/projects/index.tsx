import Head from "next/head";
import { GetServerSideProps } from "next";
import { useEffect } from "react"
import { cardProps } from "@components/Card"
import { client, urlFor } from "@services/sanity";
import { Suspense } from "react"
import dynamic from "next/dynamic"

const ProjectsHero = dynamic(() => import('containers/Projects/ProjectsHero'));
const ProjectsField = dynamic(() => import('containers/Projects/ProjectsField'), {
  loading: () => <> lodaing... </>
});


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
      <Suspense fallback={<div>Loading...</div>}>
        <ProjectsField projects={projects} />
      </Suspense>
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