/* eslint-disable react/display-name */
import { forwardRef } from "react";
import styles from "./Section.module.scss";

interface Props {
  children: React.ReactNode;
}

const SectionIllustration = forwardRef<HTMLDivElement, Props>(
  ({ children }, ref) => (
    <div ref={ref} className={styles["section__illustration"]}>
      {children}
    </div>
  )
);

export default SectionIllustration;
