import type React from "react"
import { createContext, SetStateAction, useState, useRef, useEffect, useContext } from "react";

interface Props {
  // eslint-disable-next-line no-undef
  children: React.ReactNode;
}

export type TRefs = {
  formRef: React.RefObject<HTMLFormElement> | null;
  MessageSvgRef: React.RefObject<HTMLDivElement> | null;
  MessageRef: React.RefObject<HTMLDivElement> | null,
}

interface IContetx {
  refs?: TRefs;
  setRefs?: React.Dispatch<SetStateAction<TRefs>>
}

const contactFieldContext = createContext<IContetx>({});

const ContactFieldProvider = ({ children }: Props) => {
  const [refs, setRefs] = useState<TRefs>({
    formRef: null,
    MessageSvgRef: null,
    MessageRef: null
  })
  return (
    <contactFieldContext.Provider value={{ setRefs, refs }}>
      {children}
    </contactFieldContext.Provider>
  );
};

type TRefName = "formRef" | "MessageSvgRef" | "MessageRef";

export const useContactFieldRef = (name: TRefName) => {
  const { setRefs } = useContext(contactFieldContext);
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && setRefs) {
      setRefs(p => ({
        ...p,
        [name]: ref
      }))
    }
  }, [name, ref, setRefs])

  return ref;
}

export const useContactFieldContext = () => {
  const { refs } = useContext(contactFieldContext);
  return refs;
}

export default ContactFieldProvider;