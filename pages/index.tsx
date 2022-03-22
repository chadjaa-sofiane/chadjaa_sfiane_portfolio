import type { NextPage } from "next";
import { HeroSection } from "containers/Home/HeroSection";
import Head from "next/head";
import { BackendSection } from "containers/Home/sections";
import FrontendSection from "containers/Home/sections/FrontEndSection/FrontendSection";
import WordpressSection from "containers/Home/sections/WordpressSection";
import AboutMe from "containers/Home/AboutMe";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title> Home Page </title>
      </Head>
      <HeroSection />
      <BackendSection />
      <FrontendSection />
      <WordpressSection />
      <AboutMe />
    </>
  );
};

export default Home;
