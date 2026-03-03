import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import AlertProvider from "@components/core/Alert/Alert.context";
import { Header } from "@components/Header";
import Footer from "@components/Footer";
import { BackToTop } from "@components/BackToTop";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { Analytics } from "@vercel/analytics/react";
import "@styles/index.scss";
import { Contact } from "@components/Contact";
import SeasonalEffects, { Season } from "@components/SeasonalEffects/SeasonalEffects";

gsap.registerPlugin(ScrollTrigger);

function MyApp({ Component, pageProps }: AppProps) {
  const [currentSeason, setCurrentSeason] = useState<Season>("winter");

  useEffect(() => {
    document.body.dataset.season = currentSeason;
    return () => {
      delete document.body.dataset.season;
    };
  }, [currentSeason]);

  return (
    <>
      <AlertProvider position={"top-right"}>
        <SeasonalEffects season={currentSeason} onSeasonChange={setCurrentSeason} />
        <Contact />
        <BackToTop />
        <Header />
        <Component {...pageProps} />
        <Footer />
      </AlertProvider>
      <Analytics />
    </>
  );
}

export default MyApp;
