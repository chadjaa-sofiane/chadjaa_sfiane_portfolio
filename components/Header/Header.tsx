import NavBar from "./NavBar";
import styles from "./header.module.scss";

interface IProps {
  color?: "dark" | "light";
}

const Header = ({ color = "light" }: IProps) => {
  const classes = [
    styles["header"],
    color === "light" ? styles["header--light"] : styles["header--dark"],
  ];
  return (
    <div className={classes.join(" ")}>
      <div className={styles["logo"]}> softfolio </div>
      <NavBar />
    </div>
  );
};

export default Header;
