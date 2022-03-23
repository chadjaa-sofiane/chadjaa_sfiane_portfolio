import FrontendIllustration from "@svg/froneend_illustration.svg";
import {
  Section,
  SectionContent,
  SectionIllustration,
} from "@components/Section";

//backend_illustration

const FrontendSection = () => {
  return (
    <Section>
      <SectionContent
        title="a designer can build your world"
        description="a nodeJs develoer.I will build and maintain your servers."
      />
      <SectionIllustration>
        <FrontendIllustration />
      </SectionIllustration>
    </Section>
  );
};

export default FrontendSection;
