import { Paragraph, Title4 } from "@components/core/Typography";
import { Button } from "@components/core/Button";
import { useCardContext } from "./Card.context"
import styles from "./Card.module.scss";

import ProjectIcon from "./ProjectIcon";

const CardContent = () => {
    const { title, body, type, isPrivate } = useCardContext();
    return (
        <div
            className={`${styles["card__content"]} ${
                isPrivate ? styles["card__content--private"] : ""
            }`}
        >
            <div className={styles["card__header"]}>
                <div className={styles["card__title"]}>
                    <Title4> {title} </Title4>
                    <span className={styles["card__scribble"]} aria-hidden="true" />
                </div>
                <div className={styles["card__meta"]}>
                    {isPrivate && <span className={styles["card__badge--bottom"]}>Private</span>}
                    <ProjectIcon type={type} />
                </div>
            </div>
            <Paragraph>{body}</Paragraph>
            <CardButtons />
        </div>
    )
}

const CardButtons = () => {
    const { handleOpen } = useCardContext();
    return (
        <Button
            variant="outlined"
            onClick={() => handleOpen(true)}
            className={styles["card__detailsButton"]}
        >
            view details
        </Button>)
}

export default CardContent
