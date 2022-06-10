import { useEffect } from "react";
import styles from "./Modal.module.scss";

interface Props {
    isOpen: boolean;
    // eslint-disable-next-line no-unused-vars
    setOpen: (isOpen: boolean) => void;
    children: React.ReactNode;
}

const Modal = ({ isOpen, setOpen, children }: Props) => {
    useEffect(() => {
        if (isOpen) {
            const scrollTop = window.pageYOffset;
            document.body.style.overflowY = "hidden";
            window.scrollTo(0, scrollTop);
        }
        return () => {
            const scrollTop = window.pageYOffset;
            document.body.style.overflowY = "auto";
            window.scrollTo(0, scrollTop);
        }
    }, [isOpen]);
    return (
        <>
            {isOpen && <div className={styles["modal__wrapper"]}>
                <div className={styles["modal__overlay"]} onClick={() => setOpen(false)}></div>
                <div className={styles["modal__content"]}>
                    <span className={styles["modal__closeButton"]} onClick={() => setOpen(false)}>X</span>
                    {children}
                </div>
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