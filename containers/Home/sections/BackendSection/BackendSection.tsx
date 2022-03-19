import SectionContent from "../SectionContent";
import styles from "../sections.module.scss";
import BackendIllustration from "@svg/backend_illustration.svg";
import Wrapper from "@components/core/Wrapper";
import Container from "@components/core/Container";

//backend_illustration

const BackendSection = () => {
  return (
    <Wrapper variant="dark">
      <Container variant="dark">
        <div className={styles["section__container"]}>
          <div className={styles["section__illustration"]}>
            <BackendIllustration />
          </div>
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
