import SectionContent from "../SectionContent";
import Wrapper from "@components/core/Wrapper";
import Container from "@components/core/Container";
import styles from "../sections.module.scss";
import BackEndIllustration from "./BackEndIllustration";

//backend_illustration

const BackendSection = () => {
  return (
    <Wrapper variant="dark">
      <Container variant="dark">
        <div className={styles["section__container"]}>
          <BackEndIllustration />
          <SectionContent
            title="a back-end developer"
            description="a nodeJs develoer.I will build and maintain your servers."
          />
        </div>
      </Container>
    </Wrapper>
  );
};

export default BackendSection;
