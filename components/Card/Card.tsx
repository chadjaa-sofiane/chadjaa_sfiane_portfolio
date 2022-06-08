import { useState } from "react"
import { Modal } from "../Modal";
import Image from "next/image";
import { Button } from "@components/core/Button";
import styles from "./Card.module.scss";
import { Paragraph, Title4 } from "@components/core/Typography";

interface props {
  title: string;
  body: string;
  imageSrc?: string;
  url?: string;
}

const Card = ({ title, body, imageSrc }: props) => {
  const [isOpen, setOpen] = useState(false);
  const handleOpen = (isOpen: boolean) => setOpen(isOpen);
  return (
    <>
      <Modal isOpen={isOpen} setOpen={handleOpen}>
        hi
      </Modal>
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
          <Button variant="outlined" onClick={() => setOpen(true)}>
            {/* <a href={url} target="_blank" rel="noopener noreferrer">
              View Project
            </a> */}
            view details
          </Button>
        </div>
      </div>
    </>
  );
};

export default Card;
