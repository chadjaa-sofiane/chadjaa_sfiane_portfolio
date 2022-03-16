import HeroContent from "./HeroContent";
import styles from "./heroSection.module.scss";
import HeroIllustration from "@svg/hero_illustration.svg";

const HeroSection = () => {
  return (
    <div className={styles["hero__section__container"]}>
      <HeroContent />
      <div className={styles["hero__section__hero__illustration"]}>
        <HeroIllustration />
      </div>
    </div>
  );
};

export default HeroSection;
