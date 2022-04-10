import {
  Section,
  SectionContent,
} from "@components/Section";
import WordPressIllustration from "./WordPressIllustration";

//backend_illustration

const WordpressSection = () => {
  return (
    <Section variant="dark">
      <WordPressIllustration />
      <SectionContent
        title="a wordpress manager"
        description="I can build and manage wordpress templates."
      />
    </Section>
  );
};

export default WordpressSection;
