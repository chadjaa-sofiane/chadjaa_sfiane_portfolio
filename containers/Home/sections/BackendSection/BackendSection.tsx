import BackEndIllustration from "./BackEndIllustration";
import { Section, SectionContent } from "@components/Section";
import { HightlightedText } from "@components/core/Typography";
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
            <HightlightedText> NodeJS</HightlightedText>,
            <HightlightedText> Python</HightlightedText> and
            <HightlightedText> Django</HightlightedText> for crafting powerful
            backend solutions.
          </>
        }
      />
    </Section>
  );
};

export default BackendSection;
