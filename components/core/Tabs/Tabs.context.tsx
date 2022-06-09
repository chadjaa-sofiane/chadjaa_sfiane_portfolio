import { createContext, useContext, useEffect, useState } from "react";

interface IContext {
  active: string;
  // eslint-disable-next-line no-unused-vars
  setActive: (active: string) => void;
  // eslint-disable-next-line no-unused-vars
  handleAction: (name:string) => void;
}
interface IProps {
  children: React.ReactNode;
  defaultValue?: string;
  // eslint-disable-next-line no-unused-vars
  handleAction?: (name:string) => void;
}

const TabsContext = createContext<IContext>({
  active: "",
  setActive: () => null,
  handleAction: () => null
});

const TabsProvider = ({ children, defaultValue = "", handleAction = () => null }: IProps) => {
  const [active, setActive] = useState("");
  useEffect(() => {
    setActive(defaultValue);
  }, []);

  return (
    <TabsContext.Provider value={{ active, setActive, handleAction }}>
      {children}
    </TabsContext.Provider>
  );
};

export const useTabsContext = () => {
  const context = useContext(TabsContext);
  return context;
};

export default TabsProvider;
