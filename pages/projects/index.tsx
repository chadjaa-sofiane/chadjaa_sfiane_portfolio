import Head from "next/head";
import { useEffect } from "react"
import { ProjectsField, ProjectsHero } from "containers/Projects";
import { db, storage } from "@services/firebase";
import { ref, getDownloadURL } from "firebase/storage";
import { collection, getDocs } from "firebase/firestore";
import { cardProps } from "@components/Card"


const ProjectsRef = collection(db, "projects");
const getImageRef = (id: string) => ref(storage, `projects/${id}`);

const Projects = ({ projects }: { projects: cardProps[] }) => {
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


const getImageSrc = async (id: string) => {
  const imageRef = getImageRef(id);
  const url = await getDownloadURL(imageRef);
  return url;
};

export const getServerSideProps = async () => {
  const data = await getDocs(ProjectsRef);
  const projects = await Promise.all(data.docs.map(async project => {
    const imageUrl = await getImageSrc(project.data().imageName);
    return {
      ...project.data(),
      id: project.id,
      imageSrc: imageUrl
    }
  }));

  return {
    props: {
      projects
    }
  }
}


export default Projects;