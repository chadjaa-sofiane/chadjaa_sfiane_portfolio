import { Paragraph, Title4 } from "@components/core/Typography";
import { Button } from "@components/core/Button";
import { useCardContext } from "./Card.context"
import styles from "./Card.module.scss";

const CardContent = () => {
    const { title, body } = useCardContext();
    return (
        <div className={styles["card__content"]}>
            <Title4> {title} </Title4>
            <Paragraph>{body}</Paragraph>
            <CardButtons />
        </div>
    )
}

const CardButtons = () => {
    const { handleOpen } = useCardContext();
    return (
        <Button variant="outlined" onClick={() => handleOpen(true)}>
            view details
        </Button>)
}

export default CardContent