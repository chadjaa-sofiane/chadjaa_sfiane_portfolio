import Image from "next/image";
import { LargeParagraph, Title2 } from "@components/core/Typography";
import { Button } from "@components/core/Button";
import Wrapper from "@components/core/Wrapper";
import Container from "@components/core/Container";
import TwitterIcon from "@svg/twitter.svg";
import LinkedInIcon from "@svg/linked_in.svg";
import GithubIcon from "@svg/github.svg";
import styles from "./AboutMe.module.scss";

import { HightlightedText } from "@components/core/Typography";
// import { Title2 } from "@components/AnimationText";
import { useSectionsProgress } from "@components/SectionsProgress";

const downloadCv = () => {
  const a: HTMLAnchorElement = document.createElement("a");
  a.href = "/resume.pdf";
  a.download = "chadjaa_sofiane_resume";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const AboutMe = ({ profileImage }: { profileImage: string }) => {
  const { ref } = useSectionsProgress();
  return (
    <Wrapper>
      <Container>
        <div ref={ref} className={styles["aboutMe__wrapper"]}>
          <div className={styles["aboutMe"]}>
            <div className={styles["aboutMe__links"]}>
              <Twitter />
              <LinkedIn />
              <GitHub />
            </div>
            <div className={styles["aboutMe__content"]}>
              <Title2> Chadjaa Sofiane </Title2>
              <LargeParagraph>
                my name is chadjaa sofiane. I&apos;am a
                <HightlightedText> full-stack </HightlightedText> developer.
                <br />
              </LargeParagraph>
              <Button variant="outlined" onClick={downloadCv}>
                download my cv
              </Button>
            </div>
          </div>
          <div className={styles["aboutMe__image__field"]}>
            <Image src={profileImage || ""} alt="my photo" layout="fill" />
          </div>
        </div>
      </Container>
    </Wrapper>
  );
};

const Twitter = () => {
  return (
    <a
      href="https://twitter.com/ChadjaaSofiane"
      target="_blank"
      rel="noopener noreferrer"
      className={`${styles["icon"]} ${styles["icon--twitter"]}`}
    >
      <TwitterIcon />
    </a>
  );
};

const LinkedIn = () => {
  return (
    <a
      href="https://www.linkedin.com/in/chadjaa-sofiane-749045217/"
      target="_blank"
      rel="noopener noreferrer"
      className={`${styles["icon"]} ${styles["icon--linkedin"]}`}
    >
      <LinkedInIcon />
    </a>
  );
};

const GitHub = () => {
  return (
    <a
      href="https://github.com/chadjaa-sofiane"
      target="_blank"
      rel="noopener noreferrer"
      className={`${styles["icon"]} ${styles["icon--github"]}`}
    >
      <GithubIcon />
    </a>
  );
};

export default AboutMe;
