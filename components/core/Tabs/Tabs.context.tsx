import { createContext, useContext, useEffect, useState } from "react";

interface IContext {
  active: string;
  // eslint-disable-next-line no-unused-vars
  setActive: (active: string) => void;
}

interface IProps {
  // eslint-disable-next-line no-undef
  children: React.ReactNode;
  defaultValue?: string;
}

const TabsContext = createContext<IContext>({
  active: "",
  setActive: () => { },
});

const TabsProvider = ({ children, defaultValue = "" }: IProps) => {
  const [active, setActive] = useState("");
  useEffect(() => {
    setActive(defaultValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
