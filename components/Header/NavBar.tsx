/* eslint-disable no-unused-vars */
import { useState } from "react"
import Link from "next/link";
import { useRouter } from "next/router";
import { Tabs, Tab } from "@components/core/Tabs";
import styles from "./Header.module.scss";

const NavBar = () => {
  const { pathname } = useRouter();
  const [open, setOpen] = useState(false);
  const closeMenu = () => setOpen(false);
  return (
    <nav className={styles["navBar"]}>
      <Tabs handleAction={closeMenu} className={`${styles["navBar__list"]} ${open ? styles["navBar__list--open"] : ""}`} defaultValue={pathname}>
        <Tab name="/">
          <Link href="/">home</Link>
        </Tab>
        <Tab name="/projects">
          <Link href="/projects">projects</Link>
        </Tab>
      </Tabs>
      <MenuIcon open={open} setOpen={setOpen} />
    </nav>
  );
};

type menuIconProps = {
  open: boolean,
  setOpen: (open: boolean) => void
}

const MenuIcon = ({ open, setOpen }: menuIconProps) => {
  return (
    <>
      <input onChange={(e) => setOpen(e.target.checked)} checked={open} type="checkbox" className={styles["menu__input"]} hidden id="menu" />
      <label htmlFor="menu" className={styles["menu__icon"]}>
        <span></span>
        <span></span>
        <span></span>
      </label>
    </>
  )
}

export default NavBar;
