import SocialMediaCard from "./SocialMediaCard";
import TwitterIcon from "@svg/twitter.svg";
import LinkedInIcon from "@svg/linked_in.svg";
import GithubIcon from "@svg/github.svg";
import styles from "./Footer.module.scss";
import Container from "@components/core/Container";

const year = new Date().getFullYear();

const Footer = () => {
  return (
    <div className={styles["footer__wrapper"]}>
      <Container classNames={styles["footer__container"]}>
        <div className={styles["footer__socialMedia__container"]}>
          <TwitterIconWrapper />
          <LinkedInIconWrapper />
          <GitHubIconWrapper />
        </div>
        <div className={styles["footer__text"]}>
          <p>© {year}</p>
        </div>
      </Container>
    </div>
  );
};

const TwitterIconWrapper = () => (
  <SocialMediaCard url="https://twitter.com/ChadjaaSofiane" color="twitter">
    <TwitterIcon />
  </SocialMediaCard>
);
const LinkedInIconWrapper = () => (
  <SocialMediaCard
    url="https://www.linkedin.com/in/chadjaa-sofiane-749045217/"
    color="linkedIn"
  >
    <LinkedInIcon />
  </SocialMediaCard>
);
const GitHubIconWrapper = () => (
  <SocialMediaCard url="https://www.github.com/chadjaa-sofiane" color="github">
    <GithubIcon />
  </SocialMediaCard>
);

export default Footer;
