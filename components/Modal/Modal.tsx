import styles from "./Modal.module.scss";
styles;

interface Props {
    isOpen: boolean;
    // eslint-disable-next-line no-unused-vars
    setOpen: (isOpen: boolean) => void;
    children: React.ReactNode;
}

const Modal = ({ isOpen, setOpen, children }: Props) => {
    return (
        <>
            {isOpen && <div className={styles["modal__wrapper"]}>
                <div className={styles["modal__backdrop"]} onClick={() => setOpen(false)}></div>
                <div className={styles["modal__content"]}>{children}</div>
            </div>
            }
        </>
    )
}

Modal.defaultProps = {
    isOpen: false,
    setOpen: () => null
}

export default Modal