import { AnimationText } from "@components/AnimationText";
import { LargeParagraph } from "@components/core/Typography";
import styles from "./Section.module.scss";

interface Props {
  title: string;
  description: string | React.ReactNode;
  button?: React.ReactNode | null;
}

const SectionContent = ({ title, description, button = null }: Props) => {
  return (
    <div className={styles["section__content"]}>
      <AnimationText>{title}</AnimationText>
      <LargeParagraph>{description}</LargeParagraph>
      {button}
    </div>
  );
};

export default SectionContent;
