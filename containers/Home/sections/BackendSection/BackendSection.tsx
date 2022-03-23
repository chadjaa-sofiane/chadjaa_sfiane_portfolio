import BackEndIllustration from "./BackEndIllustration";
import { Section, SectionContent } from "@components/Section";

//backend_illustration

const BackendSection = () => {
  return (
    <Section variant="dark">
      <BackEndIllustration />
      <SectionContent
        title="a back-end developer"
        description="a nodeJs develoer.I will build and maintain your servers."
      />
    </Section>
  );
};

export default BackendSection;
