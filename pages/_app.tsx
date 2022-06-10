import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import AlertProvider from "@components/core/Alert/Alert.context";
import { Header } from "@components/Header";
import Footer from "@components/Footer";
import "@styles/index.scss";

function MyApp({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  return (
    <AlertProvider position={"top-right"}>
      <Header color={pathname === "/projects" ? "dark" : "light"} />
      <Component {...pageProps} />
      <Footer />
    </AlertProvider>
  );
}

export default MyApp;