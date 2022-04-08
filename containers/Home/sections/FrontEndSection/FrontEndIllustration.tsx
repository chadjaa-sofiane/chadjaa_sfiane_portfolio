import { useEffect, useRef } from "react";
import FrontendIllustration from "@svg/froneend_illustration.svg";
import { gsap } from "gsap";
import { SectionIllustration } from "@components/Section";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FrontEndIllustration = () => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const { current } = ref
        if (current) {
            const girl = document.querySelector("#froneend_illustration_svg__girl");
            const monitor = document.querySelector("#froneend_illustration_svg__monitor");
            const c1 = document.querySelector("#froneend_illustration_svg__canvas_1");
            const c2 = document.querySelector("#froneend_illustration_svg__canvas_2");
            const flower = document.querySelector("#froneend_illustration_svg__flower");
            const tl = gsap.timeline({
                defaults: { duration: 1, ease: "power2.inOut" },
                scrollTrigger: current
            })
            tl.from(c1, { opacity: 0, x: 100 }).
                from(c2, { opacity: 0, x: 100 }).
                from(monitor, { opacity: 0, x: 100 }).
                from(girl, { opacity: 0, y: -10 }).
                from(flower, { opacity: 0 })
        }
    }, []);

    return (
        <SectionIllustration ref={ref}>
            <FrontendIllustration />
        </SectionIllustration>
    );
};

export default FrontEndIllustration;
