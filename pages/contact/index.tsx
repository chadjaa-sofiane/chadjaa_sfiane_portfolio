import { ContactUsField } from "containers/ContactUs";
import { ContactHero } from "containers/ContactUs/ContactHero";
import Head from "next/head";

const Contact = () => {
  return (
    <>
      <Head>
        <title> Projects </title>
      </Head>
      <ContactHero />
      <ContactUsField />
    </>
  );
};

export default Contact;
