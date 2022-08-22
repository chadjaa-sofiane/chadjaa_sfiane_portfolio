import styles from "./Footer.module.scss";
import Container from "@components/core/Container";

const year = new Date().getFullYear();

const Footer = () => {
  return (
    <div className={styles["footer__wrapper"]}>
      <Container classNames={styles["footer__container"]}>
        <div className={styles["footer__text"]}>
          <p>© {year}</p>
        </div>
      </Container>
    </div>
  );
};


export default Footer;
