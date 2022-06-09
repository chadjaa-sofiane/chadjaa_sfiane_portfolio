import Image from "next/image";
import { useCardContext } from "./Card.context"
import styles from "./Card.module.scss";


const CardImage = () => {
    const { imageSrc } = useCardContext();
    return (
        <div className={styles["card__image__field"]}>
            <Image
                className={styles["card__image"]}
                src={imageSrc || ""}
                alt="bowowo"
                layout="fill"
            />
        </div>
    )
}

export default CardImage