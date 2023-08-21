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
        description={<>Proficient in maintaining and building backend servers using <HightlightedText>Node.js</HightlightedText>.</>}
      />
    </Section>
  );
};

export default BackendSection;
