import type { NextPage } from "next";
import { HeroSection } from "containers/Home/HeroSection";
import Head from "next/head";
import Container from "@components/core/Container";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title> Home Page </title>
      </Head>
      <Container>
        <HeroSection />
      </Container>
    </div>
  );
};

export default Home;
