import Link from "next/link";
import { useRouter } from "next/router";
import { Tabs, Tab } from "@components/core/Tabs";
import styles from "./Header.module.scss";

const NavBar = () => {
  const { pathname } = useRouter();
  return (
    <nav className={styles["navBar"]}>
      <Tabs defaultValue={pathname}>
        <Tab name="/">
          <Link href="/">home</Link>
        </Tab>
        <Tab name="/projects">
          <Link href="/projects">projects</Link>
        </Tab>
        <Tab name="/contact">
          <Link href="/contact">contact</Link>
        </Tab>
      </Tabs>
    </nav>
  );
};

export default NavBar;
