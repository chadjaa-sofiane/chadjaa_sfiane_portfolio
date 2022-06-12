import styles from "./Button.module.scss";

// eslint-disable-next-line no-undef
interface props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // eslint-disable-next-line no-undef
  children: React.ReactNode;
  variant?: "outlined" | "field";
  size?: "large" | "normal";
  color?: "primary" | "secondary";
}

export const Button = ({ children, variant, size, color = "primary", ...rest }: props) => {
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

interface AnchorButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
}

export const AnchorButton = ({ children, ...rest }: AnchorButtonProps) => {
  const clasess = [
    styles["button"],
    styles["button--field"],
    styles["button--primary"]
  ].join(" ")
  return (
    <a {...rest} role="button" className={clasess}> {children} </a>
  )
}