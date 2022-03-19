import HeroContent from "./HeroContent";
import styles from "./heroSection.module.scss";
import Wrapper from "@components/core/Wrapper";
import Container from "@components/core/Container";
import HeroIllustration from "./HeroIllustration";

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
