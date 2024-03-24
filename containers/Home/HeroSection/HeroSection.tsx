import HeroIllustration from "./HeroIllustration";
import { Section, SectionContent } from "@components/Section";
import { HighlightedText } from "@components/core/Typography";
import { useSectionsProgress } from "@components/SectionsProgress";

const HeroSection = () => {
  const { ref } = useSectionsProgress();
  return (
    <Section ref={ref}>
      <SectionContent
        title=" welcome to SoftFolio"
        description={
          <>
            I&apos;m a <HighlightedText>full-stack</HighlightedText> developer
            with a passion for building beautiful and responsive websites and
            applications.
          </>
        }
      />
      <HeroIllustration />
    </Section>
  );
};

export default HeroSection;
