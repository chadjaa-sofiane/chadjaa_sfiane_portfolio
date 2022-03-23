import { LargeParagraph, Title1 } from "@components/core/Typography";
import styles from "./Section.module.scss";

interface Props {
  title: string;
  description: string;
  // eslint-disable-next-line no-undef
  button?: React.ReactNode | null;
}

const SectionContent = ({ title, description, button = null }: Props) => {
  return (
    <div className={styles["section__content"]}>
      <Title1>{title}</Title1>
      <LargeParagraph>{description}</LargeParagraph>
      {button}
    </div>
  );
};

export default SectionContent;
