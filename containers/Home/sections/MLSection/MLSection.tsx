import { HightlightedText } from "@components/core/Typography";
import { Section, SectionContent } from "@components/Section";
import { useSectionsProgress } from "@components/SectionsProgress";
import MLIllustration from "./MLIllustration";

//backend_illustration

const MLSection = () => {
  const { ref } = useSectionsProgress();
  return (
    <Section ref={ref} variant="dark">
      <MLIllustration />
      <SectionContent
        title="a ML manager"
        description={
          <>
            A skilled <HightlightedText>ML enginee</HightlightedText> r, capable
            of using machine learning tools and frameworks to produce a valuable
            product..
          </>
        }
      />
    </Section>
  );
};

export default MLSection;
