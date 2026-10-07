import NavBar from "./NavBar";
import styles from "./Header.module.scss";
import Container from "@components/core/Container";

const Header = () => {
  return (
    <header className={styles["header"]}>
      <div className={styles["header__wrapper"]}>
        <Container>
          <div className={styles["header__container"]}>
            <div className={styles["logo"]}>
              Chadjaa<span>.</span>
            </div>
            <NavBar />
          </div>
        </Container>
      </div>
    </header>
  );
};

export default Header;
