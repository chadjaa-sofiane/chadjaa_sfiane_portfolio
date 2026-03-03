import styles from "./Wrapper.module.scss";
interface Props {
  // eslint-disable-next-line no-undef
  children: React.ReactNode;
  variant?: "dark" | "light" | "projects";
}

const Wrapper = ({ children, variant = "light" }: Props) => {
  const classes = [
    styles["wrapper"],
    variant === "dark" ? styles["wrapper--dark"] : "",
    variant === "projects" ? styles["wrapper--projects"] : "",
  ];
  return <div className={classes.join(" ")}>{children}</div>;
};

export default Wrapper;
