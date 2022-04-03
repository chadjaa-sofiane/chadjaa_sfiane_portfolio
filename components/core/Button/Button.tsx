import styles from "./Button.module.scss";

// eslint-disable-next-line no-undef
interface props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // eslint-disable-next-line no-undef
  children: React.ReactNode;
  variant?: "outlined" | "field";
  size?: "large" | "normal";
}

const Button = ({ children, variant, size, ...rest }: props) => {
  const styelArray = [
    styles["button"],
    variant === "outlined"
      ? styles["button--outlined"]
      : styles["button--field"],
    size === "large" ? styles["button--large"] : "",
  ];

  return (
    <button {...rest} className={styelArray.join(" ")}>
      {children}
    </button>
  );
};

export default Button;
