import styles from "./Footer.module.scss";
import Container from "@components/core/Container";
import GithubIcon from "@svg/github.svg";
import LinkedInIcon from "@svg/linked_in.svg";
import TwitterIcon from "@svg/twitter.svg";

const year = new Date().getFullYear();

const Footer = () => {
  return (
    <footer className={styles["footer__wrapper"]}>
      <Container classNames={styles["footer__container"]}>
        <div className={styles["footer__content"]}>
          <div className={styles["footer__brand"]}>
            <h2 className={styles["footer__logo"]}>CHADJAA<span>.</span></h2>
            <p className={styles["footer__description"]}>
              Building digital experiences with passion and precision.
            </p>
          </div>

          <div className={styles["footer__links"]}>
            <div className={styles["footer__links_group"]}>
              <h3>Social</h3>
              <div className={styles["footer__socials"]}>
                <a href="https://github.com/chadjaa" target="_blank" rel="noreferrer" title="GitHub">
                  <GithubIcon />
                </a>
                <a href="https://linkedin.com/in/chadjaa" target="_blank" rel="noreferrer" title="LinkedIn">
                  <LinkedInIcon />
                </a>
                <a href="https://twitter.com/chadjaa" target="_blank" rel="noreferrer" title="X">
                  <TwitterIcon />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className={styles["footer__bottom"]}>
          <p>© {year} CHADJAA SOFIANE. All rights reserved.</p>
          <div className={styles["footer__bottom_links"]}>
            <span>Built with Next.js & GSAP</span>
          </div>
        </div>
      </Container>
    </footer>
  );
};


export default Footer;
