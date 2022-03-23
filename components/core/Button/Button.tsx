import styles from "./Button.module.scss";

interface props {
  // eslint-disable-next-line no-undef
  children: React.ReactNode;
  variant?: "outlined" | "field";
  size?: "large" | "normal";
}

const Button = ({ children, variant, size }: props) => {
  const styelArray = [
    styles["button"],
    variant === "outlined"
      ? styles["button--outlined"]
      : styles["button--field"],
    size === "large" ? styles["button--large"] : "",
  ];

  return <button className={styelArray.join(" ")}>{children}</button>;
};

export default Button;
