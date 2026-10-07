import { forwardRef, ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import styles from "./HomeSection.module.scss";

interface Props {
  /** Two-digit position on the page, e.g. "02". */
  index: string;
  label: string;
  title: ReactNode;
  lede?: ReactNode;
  id?: string;
  children: ReactNode;
}

/**
 * The one section shell every home-page block below the hero uses, so they
 * share a measure, a header and a rhythm instead of each inventing its own.
 */
// eslint-disable-next-line react/display-name
const HomeSection = forwardRef<HTMLElement, Props>(({ index, label, title, lede, id, children }, ref) => {
  const reduceMotion = useReducedMotion();
  return (
    <section ref={ref} id={id} className={styles.section} aria-labelledby={`${id ?? label}-title`}>
      <motion.header
        className={styles.header}
        initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: reduceMotion ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className={styles.marker}>
          <span>{index}</span>
          {label}
        </p>
        <h2 id={`${id ?? label}-title`} className={styles.title}>{title}</h2>
        {lede ? <p className={styles.lede}>{lede}</p> : null}
      </motion.header>
      {children}
    </section>
  );
});

export default HomeSection;
