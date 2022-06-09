import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { Header } from "@components/Header";
import Footer from "@components/Footer";
import "@styles/index.scss";

function MyApp({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  return (
    <>
      <Header color={pathname === "/projects" ? "dark" : "light"} />
      <Component {...pageProps} />
      <Footer />
    </>
  );
}

export default MyApp;