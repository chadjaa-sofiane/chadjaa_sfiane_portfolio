import HeroIllustration from "./HeroIllustration";
import { Section, SectionContent } from "@components/Section";
import { HightlightedText } from "@components/core/Typography";

const HeroSection = () => {
  return (
    <Section>
      <SectionContent
        title=" welcome in sotfolio"
        description={<>I&apos;m a <HightlightedText>full-stack</HightlightedText> developer with a passion for building beautiful, responsive websites and applications.</>}
      />
      <HeroIllustration />
    </Section>
  );
};

export default HeroSection;
