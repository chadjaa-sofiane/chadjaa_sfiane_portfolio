import { createContext, useContext, useState } from "react";
import AlertsField from "./AlertsField"


type vertical = "top" | "bottom"
type horizontal = "right" | "left"
export type Position = `${vertical}-${horizontal}`

type Type = "error" | "success";

export type AlertContent = {
    message: string,
    type: Type
}
export interface IAlert extends AlertContent {
    id: number
}

interface Props {
    position?: Position
    // eslint-disable-next-line no-empty-pattern
    children: React.ReactNode
}
interface IContext {
    alerts: IAlert[]
    // eslint-disable-next-line no-unused-vars
    alert: ({ message, type }: AlertContent) => void
    // eslint-disable-next-line no-unused-vars
    removeAlert: (id: number) => void
}

const alertContext = createContext<IContext>({
    alerts: [],
    alert: () => { null },
    removeAlert: () => null
});

const AlertProvider = ({ children, position }: Props) => {
    const [alerts, setAlert] = useState<IAlert[]>([]);
    const alert = ({ message, type }: AlertContent) => {
        setAlert((p) => [...p, { id: p.length + 1, message, type }]);
    }
    const removeAlert = (id: number) => {
        setAlert(p => [...p.filter(alert => alert.id !== id)])
    }
    return (<alertContext.Provider value={{ alerts, alert, removeAlert }}>
        <AlertsField position={position} />
        {children}
    </alertContext.Provider>)
}

export const useAlert = () => useContext(alertContext);

export default AlertProvider