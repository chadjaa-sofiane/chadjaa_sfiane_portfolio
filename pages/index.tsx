import Head from "next/head";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "@services/firebase";
import {
  HeroSection,
  BackendSection,
  FrontendSection,
  WordpressSection,
  AboutMe,
} from "containers/Home";

const Home = ({ profileImage }: { profileImage: string }) => {
  return (
    <>
      <Head>
        <title> Home Page </title>
      </Head>
      <HeroSection />
      <BackendSection />
      <FrontendSection />
      <WordpressSection />
      <AboutMe profileImage={profileImage} />
    </>
  );
};

export const getStaticProps = async () => {
  const imageRef = ref(storage, "profileImage.jpg");
  const profileImage = await getDownloadURL(imageRef);
  console.log(profileImage);
  return {
    props: {
      profileImage,
    },
  };
};

export default Home;
