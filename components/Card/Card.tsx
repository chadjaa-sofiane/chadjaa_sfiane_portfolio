import Image from "next/image";
import { Button } from "@components/core/Button";
import { Paragraph, Title4 } from "@components/core/Typography";
import styles from "./Card.module.scss";

interface props {
  // eslint-disable-next-line no-undef
  title: string;
}

const Card = ({ title }: props) => {
  return (
    <div className={styles["card__wrapper"]}>
      <div className={styles["card__image__field"]}>
        <Image
          className={styles["card__image"]}
          src="/images/test.png"
          alt="bowowo"
          layout="fill"
        />
      </div>
      <div className={styles["card__content"]}>
        <Title4> {title} </Title4>
        <Paragraph>
          this is the project description where I describe what the shit I have
          built here
        </Paragraph>
        <Button variant="outlined">View Project</Button>
      </div>
    </div>
  );
};

export default Card;
