import HeroIllustration from "./HeroIllustration";
import { Section, SectionContent } from "@components/Section";
import { Button } from "@components/core/Button";

const HeroSection = () => {
  return (
    <Section>
      <SectionContent
        title=" welcome in sotfolio "
        description="welcome in chadjaa sofiane world, here I describe myself."
        button={<Button> about me </Button>}
      />
      <HeroIllustration />
    </Section>
  );
};

export default HeroSection;
