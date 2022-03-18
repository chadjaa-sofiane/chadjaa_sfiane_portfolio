import HeroContent from "./HeroContent";
import styles from "./heroSection.module.scss";
import HeroIllustration from "@svg/hero_illustration.svg";
import Wrapper from "@components/core/Wrapper";
import Container from "@components/core/Container";

const HeroSection = () => {
  return (
    <Wrapper>
      <Container>
        <div className={styles["hero__section__container"]}>
          <HeroContent />
          <div className={styles["hero__section__hero__illustration"]}>
            <HeroIllustration />
          </div>
        </div>
      </Container>
    </Wrapper>
  );
};

export default HeroSection;
