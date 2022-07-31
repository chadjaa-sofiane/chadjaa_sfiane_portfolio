import styles from "./Container.module.scss";

interface Props {
  // eslint-disable-next-line no-undef
  children: React.ReactNode;
  variant?: "dark" | "light";
  classNames?: string;
}

const container = ({ children, variant = "light",classNames = "" }: Props) => {
  const classes = [
    styles["container"],
    variant === "dark" ? styles["container--dark"] : "",
    classNames
  ];
  return <div className={classes.join(" ")}>{children}</div>;
};

export default container;
