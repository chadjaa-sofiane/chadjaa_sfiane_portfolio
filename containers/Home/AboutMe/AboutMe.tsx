import Image from "next/image";
import { LargeParagraph, Title1 } from "@components/core/Typography";
import { Button } from "@components/core/Button";
import Wrapper from "@components/core/Wrapper";
import Container from "@components/core/Container";
import styles from "./AboutMe.module.scss";

const AboutMe = () => {
  return (
    <Wrapper>
      <Container>
        <div className={styles["aboutMe__container"]}>
          <div className={styles["aboutMe__content"]}>
            <Title1>Chadjaa Sofiane</Title1>
            <LargeParagraph>
              my name is chadjaa sofiane and I can build your dreams and hobs
              and bring you with me to the hell.
            </LargeParagraph>
            <Button variant="outlined"> download my cv </Button>
          </div>
          <div className={styles["aboutMe__image__field"]}>
            <Image src="/images/my_avatar.png" alt="my photo" layout="fill" />
          </div>
        </div>
      </Container>
    </Wrapper>
  );
};

export default AboutMe;
