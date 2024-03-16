import { useEffect, useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";
import styles from "./Modal.module.scss";

const usePortal = () => {
  const containerRef = useRef<HTMLDivElement>(document.createElement("div"));
  useLayoutEffect(() => {
    const container = containerRef.current;

    if (container) {
      container.id = "dialog-container";
      container.style.zIndex = "9999";
      document.body.appendChild(container);
    }
    return () => {
      if (container) {
        document.body.removeChild(container);
      }
    };
  }, []);

  return containerRef.current;
};

interface Props {
  isOpen: boolean;
  // eslint-disable-next-line no-unused-vars
  setOpen: (isOpen: boolean) => void;
  children: React.ReactNode;
}

const Modal = ({ isOpen, setOpen, children }: Props) => {
  const container = usePortal();
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflowY = "hidden";
    }
    return () => {
      document.body.style.overflowY = "auto";
    };
  }, [isOpen]);
  return createPortal(
    <>
      {isOpen && (
        <div className={styles["modal__wrapper"]}>
          <div
            className={styles["modal__overlay"]}
            onClick={() => setOpen(false)}
          ></div>
          <div className={styles["modal__content"]}>
            <span
              className={styles["modal__closeButton"]}
              onClick={() => setOpen(false)}
            >
              X
            </span>
            {children}
          </div>
        </div>
      )}
    </>,
    container,
  );
};

Modal.defaultProps = {
  isOpen: false,
  setOpen: () => null,
};

export default Modal;
