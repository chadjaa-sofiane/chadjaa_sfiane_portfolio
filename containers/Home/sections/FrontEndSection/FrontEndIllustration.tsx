import { useEffect, useRef } from "react";
import FrontendIllustration from "@svg/froneend_illustration.svg";
import { gsap } from "gsap";
import { SectionIllustration } from "@components/Section";

const FrontEndIllustration = () => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const { current } = ref;
        if (!current) return;

        const ctx = gsap.context(() => {
            const girl = current.querySelector("#froneend_illustration_svg__girl");
            const monitor = current.querySelector("#froneend_illustration_svg__monitor");
            const c1 = current.querySelector("#froneend_illustration_svg__canvas_1");
            const c2 = current.querySelector("#froneend_illustration_svg__canvas_2");
            const flower = current.querySelector("#froneend_illustration_svg__flower");
            const tl = gsap.timeline({
                defaults: { duration: 0.6, ease: "power2.inOut" },
                scrollTrigger: current
            });

            if (c1) tl.from(c1, { opacity: 0, x: 100 });
            if (c2) tl.from(c2, { opacity: 0, x: 100 });
            if (monitor) tl.from(monitor, { opacity: 0, x: 100, ease: "bounce.out" });
            if (girl) tl.from(girl, { opacity: 0, y: -10 });
            if (flower) tl.from(flower, { opacity: 0 });
        }, ref);

        return () => ctx.revert();
    }, []);

    return (
        <SectionIllustration ref={ref}>
            <FrontendIllustration />
        </SectionIllustration>
    );
};

export default FrontEndIllustration;
