import NavBar from "./NavBar";
import styles from "./header.module.scss";
import Container from "@components/core/Container";

interface IProps {
  color?: "dark" | "light";
}

const Header = ({ color = "light" }: IProps) => {
  const classes = [
    styles["header"],
    color === "light" ? styles["header--light"] : styles["header--dark"],
  ];
  return (
    <div className={styles["header__wrapper"]}>
      <Container>
        <div className={classes.join(" ")}>
          <div className={styles["logo"]}> softfolio </div>
          <NavBar />
        </div>
      </Container>
    </div>
  );
};

export default Header;
