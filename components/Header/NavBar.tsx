import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./Header.module.scss";

const NavBar = () => {
  const { pathname } = useRouter();

  const isActive = (path: string) => pathname === path ? styles["navLink--active"] : "";

  return (
    <nav className={styles["navBar"]}>
      <ul className={styles["navBar__list"]}>
        <li>
          <Link href="/" className={`${styles["navLink"]} ${isActive("/")}`}>
            home
          </Link>
        </li>
        <li>
          <Link href="/projects" className={`${styles["navLink"]} ${isActive("/projects")}`}>
            projects
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
