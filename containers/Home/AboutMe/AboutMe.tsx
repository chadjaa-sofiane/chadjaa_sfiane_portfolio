import Image from "next/image";
import { LargeParagraph } from "@components/core/Typography";
import { AnimationText } from "@components/AnimationText"
import { Button } from "@components/core/Button";
import Wrapper from "@components/core/Wrapper";
import Container from "@components/core/Container";
import styles from "./AboutMe.module.scss";
import { HightlightedText } from "@components/core/Typography";


const downloadCv = () => {
  const a: HTMLAnchorElement = document.createElement("a");
  a.href = "/resume.pdf";
  a.download = "chadjaa_sofiane_resume";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const AboutMe = ({ profileImage }: { profileImage: string }) => {
  return (
    <Wrapper>
      <Container>
        <div className={styles["aboutMe__container"]}>
          <div className={styles["aboutMe__content"]}>
            <AnimationText>Chadjaa Sofiane</AnimationText>
            <LargeParagraph>
              my name is chadjaa sofiane. I&apos;am a <HightlightedText>full-stack</HightlightedText> developer.
              <br />
              I have a bachelor degree in computer science.
              <br />
              I&aops;m a self-taught developer and I&apos;m always learning new things.
            </LargeParagraph>
            <Button variant="outlined" onClick={downloadCv}> download my cv </Button>
          </div>
          <div className={styles["aboutMe__image__field"]}>
            <Image src={profileImage || ""} alt="my photo" layout="fill" />
          </div>
        </div>
      </Container>
    </Wrapper>
  );
};

export default AboutMe;
