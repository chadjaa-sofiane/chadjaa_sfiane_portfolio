import { useState, useRef, useEffect } from "react";
import { Title1 } from "../core/Typography/Typography";
import { gsap } from "gsap"
import { v4 as uuidV4 } from "uuid"
import { ScrollTrigger } from "gsap/dist/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger);

interface Props {
    children: string;
}

const AnimationText = ({ children }: Props) => {
    const ref = useRef(null)
    const [dataLetter, setDataLetter] = useState<string | null>(null);
    useEffect(() => {
        const { current } = ref;
        if (!dataLetter) setDataLetter(`letter-${uuidV4()}`);
        if (current && dataLetter) {
            const letters = document.querySelectorAll(`[data-letter= "${dataLetter}"]`);
            // animate letters with gsap 
            gsap.set(letters, { autoAlpha: 0, position: "relative", left: 10, top: -40 });
            gsap.to(letters, {
                scrollTrigger: current,
                duration: 0.5,
                autoAlpha: 1,
                top: 0,
                left: 0,
                stagger: 0.1,
                ease: "power2.out"
            });
        }
    }, [dataLetter])
    return (<Title1 ref={ref}>
        {children.split("").map((c, i) => (
            <span data-letter={dataLetter} key={i} >
                {c}
            </span>
        ))}
    </Title1>)
}


export default AnimationText