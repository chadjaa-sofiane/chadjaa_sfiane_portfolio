import Head from "next/head";
import type { NextPage } from "next";
import { app } from "../services/firebase";

import {
  HeroSection,
  BackendSection,
  FrontendSection,
  WordpressSection,
  AboutMe,
} from "containers/Home";

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
