import styles from "./wrapper.module.scss";

interface Props {
  // eslint-disable-next-line no-undef
  children: React.ReactNode;
  variant?: "dark" | "light";
}

const Wrapper = ({ children, variant = "light" }: Props) => {
  const classes = [styles["wrapper"], variant === "dark" ? styles["wrapper--dark"] : ""];
  return <div className={classes.join(" ")}>{children}</div>;
};

export default Wrapper;
