import Head from "next/head";
import { GetServerSideProps } from "next";
import { cardProps } from "@components/Card"
import { client } from "@services/sanity";
import { cardImageUrl } from "@services/sanityImage";
import { GalleryImage } from "@components/Card/types";
import { Suspense } from "react"
import dynamic from "next/dynamic"

const ProjectsHero = dynamic(() => import('containers/Projects/ProjectsHero'));
const ProjectsField = dynamic(() => import('containers/Projects/ProjectsField'), {
  loading: () => <> lodaing... </>
});


const Projects = ({ projects = [] }: { projects: cardProps[] }) => {
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
      const imageSrc = cardImageUrl(project.image);

      // The gallery arrives as raw Sanity image objects; resolve each to a CDN
      // URL and drop entries whose asset failed to resolve.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const gallery: GalleryImage[] = (project.gallery ?? [])
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((entry: any) => {
          const src = cardImageUrl(entry?.image, 1200);
          return src
            ? { src, alt: entry?.alt ?? "", caption: entry?.caption ?? "" }
            : null;
        })
        .filter(Boolean) as GalleryImage[];

      return {
        ...project,
        id: project._id,
        imageSrc,
        gallery,
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
