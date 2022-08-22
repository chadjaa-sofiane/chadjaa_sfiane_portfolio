import Head from "next/head";
import {
  HeroSection,
  BackendSection,
  FrontendSection,
  WordpressSection,
  AboutMe,
} from "containers/Home";
import { SectionsProgressProvider } from "@components/SectionsProgress";
import { client, urlFor } from "@services/sanity";

const Home = ({ profileImage }: { profileImage: string }) => {
  return (
    <SectionsProgressProvider>
      <Head>
        <title> Home Page </title>
      </Head>
      <HeroSection />
      <BackendSection />
      <FrontendSection />
      <WordpressSection />
      <AboutMe profileImage={profileImage} />
    </SectionsProgressProvider>
  );
};

export const getStaticProps = async () => {
  const dataQuery = "*[_type == 'profile']";
  const data = await client.fetch(dataQuery);
  const profileImage = urlFor(data[0].image).url();

  return {
    props: {
      profileImage,
    },
  };
};

export default Home;
