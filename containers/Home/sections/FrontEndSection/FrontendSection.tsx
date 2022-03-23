import SectionContent from "../SectionContent";
import FrontendIllustration from "@svg/froneend_illustration.svg";
import Wrapper from "@components/core/Wrapper";
import Container from "@components/core/Container";
import styles from "../Sections.module.scss";

//backend_illustration

const FrontendSection = () => {
  return (
    <Wrapper>
      <Container>
        <div className={styles["section__container"]}>
          <SectionContent
            title="a back-end developer"
            description="a nodeJs develoer.I will build and maintain your servers."
          />
          <div className={styles["section__illustration"]}>
            <FrontendIllustration />
          </div>
        </div>
      </Container>
    </Wrapper>
  );
};

export default FrontendSection;
