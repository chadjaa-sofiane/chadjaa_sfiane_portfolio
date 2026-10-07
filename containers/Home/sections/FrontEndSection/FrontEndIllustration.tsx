import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import FrontendIllustration from "@svg/froneend_illustration.svg";
import { gsap } from "gsap";
import { SectionIllustration } from "@components/Section";

const FrontEndIllustration = ({ active = true, onComplete }: { active?: boolean; onComplete?: () => void }) => {
    const reduceMotion = useReducedMotion();
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const { current } = ref;
        if (!current || !active || reduceMotion) return;

        const ctx = gsap.context(() => {
            const girl = current.querySelector("#froneend_illustration_svg__girl");
            const monitor = current.querySelector("#froneend_illustration_svg__monitor");
            const c1 = current.querySelector("#froneend_illustration_svg__canvas_1");
            const c2 = current.querySelector("#froneend_illustration_svg__canvas_2");
            const flower = current.querySelector("#froneend_illustration_svg__flower");
            const tl = gsap.timeline({
                onComplete,
                defaults: { duration: 0.78, ease: "power3.out" }
            });

            if (c1) tl.from(c1, { opacity: 0, x: 48 });
            if (c2) tl.from(c2, { opacity: 0, x: 48 }, "-=0.4");
            if (monitor) tl.from(monitor, { opacity: 0, x: 44 }, "-=0.4");
            if (girl) tl.from(girl, { opacity: 0, y: -12 }, "-=0.36");
            if (flower) tl.from(flower, { opacity: 0, scale: 0.94, transformOrigin: "50% 50%" }, "-=0.36");

            tl.duration(2.3);
        }, ref);

        return () => ctx.revert();
    }, [active, reduceMotion, onComplete]);

    return (
        <SectionIllustration ref={ref}>
            <FrontendIllustration />
        </SectionIllustration>
    );
};

export default FrontEndIllustration;
