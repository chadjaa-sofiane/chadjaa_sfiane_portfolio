import { forwardRef } from "react";
import styles from "./Typography.module.scss";

interface props {
  children: React.ReactNode;
}

// eslint-disable-next-line react/display-name
export const Title1 = forwardRef<HTMLHeadingElement, props>(
  ({ children }, ref) => (
    <h1 ref={ref} className={styles["title1"]}>
      {children}
    </h1>
  ),
);

// eslint-disable-next-line react/display-name
export const Title2 = forwardRef<HTMLHeadingElement, props>(
  ({ children }, ref) => (
    <h2 ref={ref} className={styles["title2"]}>
      {children}
    </h2>
  ),
);

// eslint-disable-next-line react/display-name
export const Title3 = forwardRef<HTMLHeadingElement, props>(
  ({ children }, ref) => (
    <h3 ref={ref} className={styles["title3"]}>
      {children}
    </h3>
  ),
);

// eslint-disable-next-line react/display-name
export const Title4 = forwardRef<HTMLHeadingElement, props>(
  ({ children }, ref) => (
    <h4 ref={ref} className={styles["title4"]}>
      {children}
    </h4>
  ),
);

export const Paragraph = ({ children }: props) => (
  <p className={styles["paragraph"]}>{children}</p>
);
export const LargeParagraph = ({ children }: props) => (
  <p className={styles["large__paragraph"]}>{children}</p>
);
export const HightlightedText = ({ children }: props) => (
  <span className={styles["highlighted__text"]}>{children}</span>
);

