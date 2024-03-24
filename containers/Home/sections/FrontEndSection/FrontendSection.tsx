import { Section, SectionContent } from "@components/Section";
import FrontEndIllustration from "./FrontEndIllustration";
import { HighlightedText } from "@components/core/Typography";
import { useSectionsProgress } from "@components/SectionsProgress";

//backend_illustration

const FrontendSection = () => {
  const { ref } = useSectionsProgress();
  return (
    <Section ref={ref}>
      <SectionContent
        title="a front end developer"
        description={
          <>
            Crafted responsive websites and applications using the dynamic
            capabilities of <HighlightedText>React</HighlightedText>,
            <HighlightedText>React-native</HighlightedText> and
            <HighlightedText>Next</HighlightedText>
          </>
        }
      />
      <FrontEndIllustration />
    </Section>
  );
};

export default FrontendSection;
