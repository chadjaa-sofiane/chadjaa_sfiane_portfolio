import styles from "./style.module.scss";

interface props {
  // eslint-disable-next-line no-undef
  children: React.ReactNode;
}

export const Title1 = ({ children }: props) => (
  <h1 className={styles["title1"]}>{children}</h1>
);
export const Title2 = ({ children }: props) => (
  <h2 className={styles["title2"]}>{children}</h2>
);
export const Title3 = ({ children }: props) => (
  <h3 className={styles["title3"]}>{children}</h3>
);
export const Title4 = ({ children }: props) => (
  <h4 className={styles["title4"]}>{children}</h4>
);

export const Paragraph = ({ children }: props) => (
  <p className={styles["paragraph"]}>{children}</p>
);
export const LargeParagraph = ({ children }: props) => <p>{children}</p>;
