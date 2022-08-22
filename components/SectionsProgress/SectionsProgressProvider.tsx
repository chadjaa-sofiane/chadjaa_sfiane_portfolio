import { createContext, RefObject, useContext, useEffect, useRef, useState } from "react";
import SectionsProgress from "./SectionsProgress";

interface SectionsProgressProps {
    children: React.ReactNode;
}

type SectionRefs = Set<RefObject<Element>>;
type ActiveSection = Element | null;

//Dispatch<SetStateAction<ActiveSection>>
interface SectionsProgressContextProps {
    sections: SectionRefs;
    activeSection: ActiveSection;
    // eslint-disable-next-line no-unused-vars
    addSection: (ref: RefObject<Element>) => void;
    // eslint-disable-next-line no-unused-vars
    setActive: (Element: ActiveSection) => void;
    // eslint-disable-next-line no-unused-vars
    goTo: (ref: RefObject<HTMLDivElement>) => void;
}

const SectionsProgressContext = createContext<SectionsProgressContextProps>({
    sections: new Set(),
    activeSection: null,
    addSection: () => null,
    setActive: () => null,
    goTo: () => null
});

export const SectionsProgressProvider = ({ children }: SectionsProgressProps) => {
    const [sections, setSection] = useState<SectionRefs>(new Set);
    const [activeSection, setActive] = useState<ActiveSection>(null);

    const addSection = (ref: RefObject<Element>) => {
        setSection(prev => new Set([...prev, ref]));
    };

    const goTo = (ref: RefObject<HTMLDivElement>) => {
        if (ref.current) {
            window.scrollTo({
                top: ref.current.offsetTop,
                behavior: "smooth"
            });
        }
    };

    useEffect(() => {

        const observer = new IntersectionObserver((entries) => {
            const [entry] = entries;
            if (entry.isIntersecting) {
                setActive(entry.target);
            }
        });

        sections.forEach((section) => {
            if (section.current) {
                observer.observe(section.current);
            }
        });

        return () => {
            observer.disconnect();
        }
    }, [sections]);

    return (
        <SectionsProgressContext.Provider value={{
            sections,
            activeSection,
            addSection,
            setActive,
            goTo
        }}>
            <SectionsProgress />
            {children}
        </SectionsProgressContext.Provider>
    )
}

export const useSectionsProgress = () => {
    const context = useContext(SectionsProgressContext);
    const ref = useRef(null);

    if (!context) {
        throw new Error('useSectionsProgress must be used within a SectionsProgressProvider');
    }

    useEffect(() => {
        if (ref?.current) {
            context.addSection(ref);
        }
    }, [ref])

    return {
        ...context,
        ref
    };
}