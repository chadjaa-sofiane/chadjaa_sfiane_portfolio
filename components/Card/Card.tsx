import Image from "next/image";
import { Button } from "@components/core/Button";
import { Paragraph, Title4 } from "@components/core/Typography";
import styles from "./Card.module.scss";

interface props {
  title: string;
  body: string;
  imageSrc?: string;
  url?: string;
}

const Card = ({ title, body, imageSrc, url = "" }: props) => {
  return (
    <div className={styles["card__wrapper"]}>
      <div className={styles["card__image__field"]}>
        <Image
          className={styles["card__image"]}
          src={imageSrc || "/images/test.png"}
          alt="bowowo"
          layout="fill"
        />
      </div>
      <div className={styles["card__content"]}>
        <Title4> {title} </Title4>
        <Paragraph>{body}</Paragraph>
        <Button variant="outlined">
          <a href={url} target="_blank" rel="noopener noreferrer">
            View Project
          </a>
        </Button>
      </div>
    </div>
  );
};

export default Card;
