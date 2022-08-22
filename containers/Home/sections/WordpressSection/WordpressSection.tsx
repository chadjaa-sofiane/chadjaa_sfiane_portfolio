import { HightlightedText } from "@components/core/Typography";
import {
  Section,
  SectionContent,
} from "@components/Section";
import { useSectionsProgress } from "@components/SectionsProgress";
import WordPressIllustration from "./WordPressIllustration";

//backend_illustration

const WordpressSection = () => {
  const { ref } = useSectionsProgress();
  return (
    <Section ref={ref} variant="dark">
      <WordPressIllustration />
      <SectionContent
        title="a wordpress manager"
        description={<>I can manage <HightlightedText> wordpress </HightlightedText>sites and plugins.</>}
      />
    </Section>
  );
};

export default WordpressSection;
