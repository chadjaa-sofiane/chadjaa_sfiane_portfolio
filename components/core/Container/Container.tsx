import styles from "./container.module.scss";

// eslint-disable-next-line no-undef
const container = ({ children }: { children: React.ReactNode }) => (
  <div className={styles["container"]}>{children}</div>
);

export default container;
