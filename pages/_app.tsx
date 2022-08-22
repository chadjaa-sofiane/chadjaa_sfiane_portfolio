import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import AlertProvider from "@components/core/Alert/Alert.context";
import { Header } from "@components/Header";
import Footer from "@components/Footer";
import { BackToTop } from "@components/BackToTop";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import "@styles/index.scss";

gsap.registerPlugin(ScrollTrigger);

function MyApp({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  return (
    <AlertProvider position={"top-right"}>
      <BackToTop />
      <Header color={pathname === "/projects" ? "dark" : "light"} />
      <Component {...pageProps} />
      <Footer />
    </AlertProvider>
  );
}

export default MyApp;