import { createContext, useContext, useEffect, useState } from "react";

interface IContext {
  active: string;
  setActive: (active: string) => void;
}
interface IProps {
  children: React.ReactNode;
  defaultValue?: string;
}

const TabsContext = createContext<IContext>({
  active: "",
  setActive: () => null,
});

const TabsProvider = ({ children, defaultValue = "" }: IProps) => {
  const [active, setActive] = useState("");
  useEffect(() => {
    setActive(defaultValue);
  }, []);

  return (
    <TabsContext.Provider value={{ active, setActive }}>
      {children}
    </TabsContext.Provider>
  );
};

export const useTabsContext = () => {
  const context = useContext(TabsContext);
  return context;
};

export default TabsProvider;
