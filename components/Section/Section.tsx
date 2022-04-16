import Container from "@components/core/Container";
import Wrapper from "@components/core/Wrapper";
import styles from "./Section.module.scss";

interface Props {
  children: React.ReactNode;
  variant?: "dark" | "light";
}

const Section = ({ children, variant = "light" }: Props) => {
  return (
    <Wrapper variant={variant}>
      <Container variant={variant}>
        <div className={styles["section__container"]}>{children}</div>
      </Container>
    </Wrapper>
  );
};

export default Section;
