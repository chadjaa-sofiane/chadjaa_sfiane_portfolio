import styles from "./heroSection.module.scss";
import { LargeParagraph, Title1 } from "@components/core/Typography";
import { Button } from "@components/core/Button";

const HeroContent = () => {
  return (
    <div className={styles["hero__section__content"]}>
      <Title1> welcome in sotfolio </Title1>
      <LargeParagraph>
        welcome in chadjaa sofiane world, here I describe myself.
      </LargeParagraph>
      <Button> About ME </Button>
    </div>
  );
};

export default HeroContent;
