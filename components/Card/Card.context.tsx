import { useState, createContext, useContext } from "react"
import { cardProps } from "./Card";

interface CardContextProps extends cardProps {
    children: React.ReactNode;
}

interface CardContextState extends cardProps {
    isOpen: boolean;
    // eslint-disable-next-line no-unused-vars
    handleOpen: (open: boolean) => void;
}

const CardContext = createContext<CardContextState>({
    isOpen: false,
    handleOpen: () => null,
    id: "",
    title: "",
    body: "",
    imageSrc: "",
    url: "",
    githubUrl: "",
    type: "",
    description: ""
})

const CardContextProvider = ({ children, ...rest }: CardContextProps) => {
    const [isOpen, setOpen] = useState(false);
    const handleOpen = (isOpen: boolean) => setOpen(isOpen);
    return <CardContext.Provider value={{ isOpen, handleOpen, ...rest }}>{children}</CardContext.Provider>
}

export const useCardContext = () => useContext(CardContext);

export default CardContextProvider;