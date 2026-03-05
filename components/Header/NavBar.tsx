import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import styles from "./Header.module.scss";

const NavBar = () => {
  const { pathname } = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path ? styles["navLink--active"] : "";

  return (
    <nav className={`${styles["navBar"]} ${menuOpen ? styles["navBar--open"] : ""}`}>
      <button
        type="button"
        className={styles["menuButton"]}
        aria-label="Toggle navigation"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        <span />
        <span />
        <span />
      </button>
      <ul className={styles["navBar__list"]}>
        <li>
          <Link
            href="/"
            className={`${styles["navLink"]} ${isActive("/")}`}
            onClick={() => setMenuOpen(false)}
          >
            home
          </Link>
        </li>
        <li>
          <Link
            href="/projects"
            className={`${styles["navLink"]} ${isActive("/projects")}`}
            onClick={() => setMenuOpen(false)}
          >
            projects
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
