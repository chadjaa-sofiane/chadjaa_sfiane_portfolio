import TabsProvider, { useTabsContext } from "./TabsContext";
import styles from "./tabs.module.scss";

interface IProps {
  // eslint-disable-next-line no-undef
  children: React.ReactNode;
  defaultValue?: string;
}

const Tabs = ({ children, defaultValue = "" }: IProps) => {
  return (
    <TabsProvider defaultValue={defaultValue}>
      <div className={styles["tabs"]}>{children}</div>
    </TabsProvider>
  );
};

interface ItabProps {
  // eslint-disable-next-line no-undef
  children: React.ReactNode;
  name: string;
}

export const Tab = ({ children, name }: ItabProps) => {
  const { active, setActive } = useTabsContext();
  const onClickAction = (name: string) => {
    setActive(name);
  };

  const classes = [styles["tab"], active === name ? styles["tab--active"] : ""];

  return (
    <span className={classes.join(" ")} onClick={() => onClickAction(name)}>
      {children}
    </span>
  );
};

export default Tabs;
