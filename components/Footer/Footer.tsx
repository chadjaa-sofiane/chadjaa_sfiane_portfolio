import { Paragraph, Title2 } from "@components/core/Typography";
import { Section } from "@components/Section";
import styles from "./Footer.module.scss";
import SocialMediaContainer from "./SocialMediaContainer";

const Footer = () => {
  return (
    <Section variant="dark">
      <div className={styles["footer__wrapper"]}>
        <SocialMediaContainer />
        <div className={styles["footer__content"]}>
          <Title2> about me </Title2>
          <Paragraph><span> chadjaa sofiane </span>, a full-stack javascript developer</Paragraph>
          <Paragraph><span> front end </span> : react - next - svelte</Paragraph>
          <Paragraph><span> back end </span>: node js - express </Paragraph>
          <Paragraph><span> my email </span>: chadjaasofiane@gmail.com</Paragraph>
        </div>
      </div>
    </Section>
  );
};

export default Footer;
