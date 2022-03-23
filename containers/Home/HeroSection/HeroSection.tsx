import HeroContent from "./HeroContent";
import Wrapper from "@components/core/Wrapper";
import Container from "@components/core/Container";
import HeroIllustration from "./HeroIllustration";
import styles from "./HeroSection.module.scss";

const HeroSection = () => {
  return (
    <Wrapper>
      <Container>
        <div className={styles["hero__section__container"]}>
          <HeroContent />
          <HeroIllustration />
        </div>
      </Container>
    </Wrapper>
  );
};

export default HeroSection;
