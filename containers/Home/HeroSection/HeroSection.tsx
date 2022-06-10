import HeroIllustration from "./HeroIllustration";
import { Section, SectionContent } from "@components/Section";
import { Button } from "@components/core/Button";
import { HightlightedText } from "@components/core/Typography";

const HeroSection = () => {
  return (
    <Section>
      <SectionContent
        title=" welcome in sotfolio"
        description={<>I&apos;m a <HightlightedText>full-stack</HightlightedText> developer with a passion for building beautiful, responsive websites and applications.</>}
        button={<Button> about me </Button>}
      />
      <HeroIllustration />
    </Section>
  );
};

export default HeroSection;
