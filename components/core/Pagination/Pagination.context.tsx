import { createContext, useContext, useState } from "react";

interface IContext {
  activeNumber: number;
  // eslint-disable-next-line no-unused-vars
  setActiveNumber?: (active: number) => void;
}

interface props {
  // eslint-disable-next-line no-undef
  children: React.ReactNode;
}

const PaginationContext = createContext<IContext>({
  activeNumber: 1,
  setActiveNumber: () => null
});

const PaginationProvider = ({ children }: props) => {
  const [activeNumber, setActiveNumber] = useState(1);
  return (
    <PaginationContext.Provider value={{ activeNumber, setActiveNumber }}>
      {children}
    </PaginationContext.Provider>
  );
};

export const usePaginationContext = () => {
  const context = useContext(PaginationContext);
  return context;
};

export default PaginationProvider;
