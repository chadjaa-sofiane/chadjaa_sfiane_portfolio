import {
  Section,
  SectionContent,
} from "@components/Section";
import FrontEndIllustration from "./FrontEndIllustration";
import { HightlightedText } from "@components/core/Typography";
import { useSectionsProgress } from "@components/SectionsProgress";

//backend_illustration

const FrontendSection = () => {
  const { ref } = useSectionsProgress();
  return (
    <Section ref={ref}>
      <SectionContent
        title="a front end developer"
        description={<>I can build responsive websites and applications. with the power of <HightlightedText>React</HightlightedText>, <HightlightedText>React-native</HightlightedText> and <HightlightedText>Next</HightlightedText> </>}
      />
      <FrontEndIllustration />
    </Section>
  );
};

export default FrontendSection;
