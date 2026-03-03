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

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const dataQuery = `*[_type == 'projects']`;
    const data = await client.fetch(dataQuery);

    if (!data) {
      return { props: { projects: [] } };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const projects = data.map((project: any) => {
      let imageSrc = undefined;
      try {
        if (project.image) {
          imageSrc = urlFor(project.image).url();
        }
      } catch (err) {
        console.error(`Error generating image URL for project ${project._id}:`, err);
      }

      return {
        ...project,
        id: project._id,
        imageSrc,
      };
    });

    return {
      props: {
        projects,
      },
    };
  } catch (error) {
    console.error("Error fetching projects from Sanity:", error);
    return {
      props: {
        projects: [],
      },
    };
  }
};


export default Projects;