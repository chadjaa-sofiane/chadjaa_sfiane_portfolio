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
        title="a back end developer"
        description={<>I can maintain and build backend servers using <HightlightedText>node-js</HightlightedText></>}
      />
    </Section>
  );
};

export default BackendSection;
