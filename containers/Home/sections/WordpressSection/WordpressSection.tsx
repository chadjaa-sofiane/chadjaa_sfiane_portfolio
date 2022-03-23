import WordPressIllustration from "@svg/wordpress_illustration.svg";
import {
  Section,
  SectionContent,
  SectionIllustration,
} from "@components/Section";

//backend_illustration

const WordpressSection = () => {
  return (
    <Section variant="dark">
      <SectionIllustration>
        <WordPressIllustration />
      </SectionIllustration>

      <SectionContent
        title="a wordpress manager"
        description="I can build and manage wordpress templates."
      />
    </Section>
  );
};

export default WordpressSection;
