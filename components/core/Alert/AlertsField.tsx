
import { useEffect, useRef } from "react";
import { useAlert, Position, IAlert } from "./Alert.context"
import styles from "./Alert.module.scss"

const AlertsField = ({ position }: { position: Position }) => {
    const { alerts } = useAlert();
    const [vertical, horizontal] = position.split("-");

    const classes = [
        styles["alert__field"],
        styles[`alert--${vertical}`],
        styles[`alert--${horizontal}`]
    ].join(" ")

    return (
        <div className={classes}>
            {alerts?.map(({ id, message, type }) => (
                <Alert key={id} id={id} message={message} type={type} />
            ))}
        </div>
    )
}

const Alert = ({ message, type, id }: IAlert) => {
    const { removeAlert } = useAlert();
    const ref = useRef(null);

    const classes = [
        styles["alert__container"],
        styles[`alert--${type}`]
    ].join(" ")


    const handleClose = (div: HTMLDivElement) => {
        div.classList.add(styles["alert__container--closing"]);
        div.addEventListener("animationend", () => { removeAlert(id) })
    }

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        handleClose(e.currentTarget);
    }

    useEffect(() => {
        const { current } = ref;
        let timeout: NodeJS.Timeout;
        if (current) {
            timeout = setTimeout(() => {
                handleClose(current);
            }, 3000)
        }
        () => {
            clearTimeout(timeout);
        }
    }, [ref])

    return <div ref={ref} className={classes} onClick={handleClick}>
        {message}
    </div>
}

AlertsField.defaultProps = {
    position: "bottom-left"
}

export default AlertsField