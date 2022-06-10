import BackEndIllustration from "./BackEndIllustration";
import { Section, SectionContent } from "@components/Section";
import { HightlightedText } from "@components/core/Typography";

const BackendSection = () => {
  return (
    <Section variant="dark">
      <BackEndIllustration />
      <SectionContent
        title="backend"
        description={<>I can maintain and build backend servers using <HightlightedText>node-js</HightlightedText></>}
      />
    </Section>
  );
};

export default BackendSection;
