import TabsProvider, { useTabsContext } from "./Tabs.context";
import styles from "./Tabs.module.scss";

interface IProps {
  // eslint-disable-next-line no-undef
  children: React.ReactNode;
  defaultValue?: string;
  className?: string;
  // eslint-disable-next-line no-unused-vars
  handleAction?: (name: string) => void;
}

const Tabs = ({ children, defaultValue = "", className = "", handleAction = () => null }: IProps) => {
  return (
    <TabsProvider defaultValue={defaultValue} handleAction={handleAction}>
      <div className={`${styles["tabs"]} ${className}`}>{children}</div>
    </TabsProvider>
  );
};

interface ItabProps {
  // eslint-disable-next-line no-undef
  children: React.ReactNode;
  name: string;
}

export const Tab = ({ children, name }: ItabProps) => {
  const { active, setActive, handleAction } = useTabsContext();
  const onClickAction = (name: string) => {
    setActive(name);
    handleAction(name);
  };

  const classes = [styles["tab"], active === name ? styles["tab--active"] : ""];

  return (
    <span className={classes.join(" ")} onClick={() => onClickAction(name)}>
      {children}
    </span>
  );
};

export default Tabs;
