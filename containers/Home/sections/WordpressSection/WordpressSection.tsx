import SectionContent from "../SectionContent";
import WordPressIllustration from "@svg/wordpress_illustration.svg";
import Wrapper from "@components/core/Wrapper";
import Container from "@components/core/Container";
import styles from "../sections.module.scss";

//backend_illustration

const WordpressSection = () => {
  return (
    <Wrapper variant="dark">
      <Container variant="dark">
        <div className={styles["section__container"]}>
          <div className={styles["section__illustration"]}>
            <WordPressIllustration />
          </div>
          <SectionContent
            title="a wordpress manager"
            description="I can build and manage wordpress templates."
          />
        </div>
      </Container>
    </Wrapper>
  );
};

export default WordpressSection;
