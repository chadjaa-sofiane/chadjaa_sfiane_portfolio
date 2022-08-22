import { useRef, useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import BackToTopIcon from "@svg/next.svg";
import styles from "./BackToTop.module.scss";

const backToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const BackToTop = () => {
  const observerableRef = useRef(null);
  const [isAtTop, setIsAtTop] = useState(false);

  useEffect(() => {
    const { current } = observerableRef;
    if (current) {
      const observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry.isIntersecting) return setIsAtTop(true);
          setIsAtTop(false);
        },
        {
          root: null,
          rootMargin: "0px",
          threshold: 0.5,
        }
      );
      observer.observe(current);
    }
  }, [observerableRef.current]);

  return (
    <>
      <div ref={observerableRef} className={styles["observable__div"]} />
      {!isAtTop && (
        <motion.div
          onClick={backToTop}
          variants={variants}
          animate="visible"
          initial="hidden"
          className={styles["backToTop__wrapper"]}
        >
          <BackToTopIcon />
        </motion.div>
      )}
    </>
  );
};

const variants: Variants = {
  visible: {
    opacity: 1,
    scale: 1.1,
    transition: {
      duration: 0.2,
      type: "spring",
      damping: 15,
      stiffness: 500,
    },
  },
  hidden: {
    opacity: 0.5,
    scale: 0.75,
    transition: {
      duration: 0.2,
    },
  },
};

export default BackToTop;
