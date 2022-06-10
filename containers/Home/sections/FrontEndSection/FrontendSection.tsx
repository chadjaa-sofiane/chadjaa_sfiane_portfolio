import {
  Section,
  SectionContent,
} from "@components/Section";
import FrontEndIllustration from "./FrontEndIllustration";
import { HightlightedText } from "@components/core/Typography";

//backend_illustration

const FrontendSection = () => {
  return (
    <Section>
      <SectionContent
        title="a front end developer"
        description={<>I can build responsive websites and applications. with the power of <HightlightedText>React</HightlightedText>, <HightlightedText>Racst-native</HightlightedText> and <HightlightedText>Next</HightlightedText> </>}
      />
      <FrontEndIllustration />
    </Section>
  );
};

export default FrontendSection;
