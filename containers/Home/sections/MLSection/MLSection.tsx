import { HighlightedText } from "@components/core/Typography";
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
        title="a ML Engineer"
        description={
          <>
            A skilled <HighlightedText>ML engineer</HighlightedText>, capable of
            using machine learning tools and frameworks to produce a valuable
            product.
          </>
        }
      />
    </Section>
  );
};

export default MLSection;
