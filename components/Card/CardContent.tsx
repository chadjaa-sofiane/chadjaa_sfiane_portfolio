import { Paragraph, Title4 } from "@components/core/Typography";
import { Button } from "@components/core/Button";
import { useCardContext } from "./Card.context"
import styles from "./Card.module.scss";

import ProjectIcon from "./ProjectIcon";

const CardContent = () => {
    const { title, body, type } = useCardContext();
    return (
        <div className={styles["card__content"]}>
            <div className={styles["card__header"]}>
                <Title4> {title} </Title4>
                <ProjectIcon type={type} />
            </div>
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