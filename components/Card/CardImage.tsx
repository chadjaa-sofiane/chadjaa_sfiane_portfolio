import Image from "next/image";
import { useCardContext } from "./Card.context"
import styles from "./Card.module.scss";


const CardImage = () => {
    const { imageSrc, showImage, isPrivate } = useCardContext();
    if (isPrivate) {
        return <div className={styles["card__image__placeholder"]} />;
    }
    if (showImage === false || !imageSrc) {
        return null;
    }
    return (
        <div className={styles["card__image__field"]}>
            <Image
                className={styles["card__image"]}
                src={imageSrc || ""}
                alt="project card"
                layout="fill"
            />
        </div>
    )
}

export default CardImage
