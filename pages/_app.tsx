import { Header } from "@components/Header";
import type { AppProps } from "next/app";
import "@styles/index.scss";
import Footer from "@components/Footer";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </>
  );
}

export default MyApp;
