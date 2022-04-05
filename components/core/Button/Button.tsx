import styles from "./Button.module.scss";

// eslint-disable-next-line no-undef
interface props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // eslint-disable-next-line no-undef
  children: React.ReactNode;
  variant?: "outlined" | "field";
  size?: "large" | "normal";
  color?: "primary" | "secondary";
}

const Button = ({ children, variant, size, color = "primary", ...rest }: props) => {
  const styelArray = [
    styles["button"],
    variant === "outlined"
      ? styles["button--outlined"]
      : styles["button--field"],
    color === "secondary" ? styles["button--secondary"] : styles["button--primary"],
    size === "large" ? styles["button--large"] : "",
  ];

  return (
    <button {...rest} className={styelArray.join(" ")}>
      {children}
    </button>
  );
};

export default Button;
