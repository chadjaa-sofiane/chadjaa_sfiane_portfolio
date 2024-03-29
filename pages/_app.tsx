import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import AlertProvider from "@components/core/Alert/Alert.context";
import { Header } from "@components/Header";
import Footer from "@components/Footer";
import { BackToTop } from "@components/BackToTop";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { Analytics } from "@vercel/analytics/react";
import "@styles/index.scss";
import { Contact } from "@components/Contact";

gsap.registerPlugin(ScrollTrigger);

function MyApp({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  return (
    <>
      <AlertProvider position={"top-right"}>
        <Contact />
        <BackToTop />
        <Header color={pathname === "/projects" ? "dark" : "light"} />
        <Component {...pageProps} />
        <Footer />
      </AlertProvider>
      <Analytics />
    </>
  );
}

export default MyApp;
