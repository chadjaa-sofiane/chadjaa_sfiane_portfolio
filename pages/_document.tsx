import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Oldenburg&family=Open+Sans:wght@300;400;700&family=Pavanam&family=Petit+Formal+Script&family=Poppins:wght@300;500;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" sizes="196x196" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
