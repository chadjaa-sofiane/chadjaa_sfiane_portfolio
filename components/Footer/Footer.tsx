import Container from "@components/core/Container";
import { Paragraph } from "@components/core/Typography";
import styles from "./footer.module.scss";

const Footer = () => {
  return (
    <div className={styles["footer__wrapper"]}>
      <Container>
        <div className={styles["footer__content"]}>
          <Paragraph>©chadjaa sofiane;</Paragraph>
          <Paragraph>2022</Paragraph>
        </div>
      </Container>
    </div>
  );
};

export default Footer;
