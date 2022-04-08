import { useRef, useEffect } from "react"
import { appearAnimation } from "./Wrapper.animation";
import styles from "./Wrapper.module.scss";
interface Props {
  // eslint-disable-next-line no-undef
  children: React.ReactNode;
  variant?: "dark" | "light";
}

const Wrapper = ({ children, variant = "light" }: Props) => {
  const ref = useRef(null)
  const classes = [styles["wrapper"], variant === "dark" ? styles["wrapper--dark"] : ""];

  useEffect(() => {
    if (ref.current) {
      appearAnimation(ref);
    }
  }, [])

  return <div ref={ref} className={classes.join(" ")}>{children}</div>;
};

export default Wrapper;
