import BackEndIllustration from "./BackEndIllustration";
import { Section, SectionContent } from "@components/Section";
import { HighlightedText } from "@components/core/Typography";
import { useSectionsProgress } from "@components/SectionsProgress";

const BackendSection = () => {
  const { ref } = useSectionsProgress();
  return (
    <Section ref={ref} variant="dark">
      <BackEndIllustration />
      <SectionContent
        title="a backend developer"
        description={
          <>
            Skilled developer in
            <HighlightedText> NodeJS</HighlightedText>,
            <HighlightedText> Python</HighlightedText> and
            <HighlightedText> Django</HighlightedText> for crafting powerful
            backend solutions.
          </>
        }
      />
    </Section>
  );
};

export default BackendSection;
