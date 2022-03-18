import { Header } from "@components/Header";
import type { AppProps } from "next/app";
import "@styles/index.scss";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="scroll__snap__container">
      <Header />
      <Component {...pageProps} />;
    </div>
  );
}

export default MyApp;
