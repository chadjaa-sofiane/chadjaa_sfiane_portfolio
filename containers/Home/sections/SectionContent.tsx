import { LargeParagraph, Title1 } from "@components/core/Typography";
import styles from "./sections.module.scss";

interface Props {
  title: string;
  description: string;
}

const SectionContent = ({ title, description }: Props) => {
  return (
    <div className={styles["section__content"]}>
      <Title1>{title}</Title1>
      <LargeParagraph>{description}</LargeParagraph>
    </div>
  );
};

export default SectionContent;
