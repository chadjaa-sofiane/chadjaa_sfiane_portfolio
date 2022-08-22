import Container from "@components/core/Container";
import Wrapper from "@components/core/Wrapper";
import { forwardRef, Ref } from "react";
import styles from "./Section.module.scss";

interface Props {
  children: React.ReactNode;
  variant?: "dark" | "light";
  ref?: Ref<HTMLDivElement>
}

// eslint-disable-next-line react/display-name
const Section = forwardRef(({ children, variant = "light" }: Props, ref: Ref<HTMLDivElement>) => {
  return (
    <Wrapper variant={variant}>
      <Container variant={variant}>
        <div ref={ref} className={styles["section__container"]}>{children}</div>
      </Container>
    </Wrapper>
  );
});

export default Section;
