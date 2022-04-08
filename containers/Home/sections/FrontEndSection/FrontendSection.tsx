import {
  Section,
  SectionContent,
} from "@components/Section";
import FrontEndIllustration from "./FrontEndIllustration";

//backend_illustration

const FrontendSection = () => {
  return (
    <Section>
      <SectionContent
        title="a designer can build your world"
        description="a nodeJs develoer.I will build and maintain your servers."
      />
      <FrontEndIllustration />
    </Section>
  );
};

export default FrontendSection;
