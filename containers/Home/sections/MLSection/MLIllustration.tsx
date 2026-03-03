import { useEffect, useRef } from "react";
import MLIllustrationSvg from "@svg/machine_learning.svg";
import { gsap } from "gsap";
import { SectionIllustration } from "@components/Section";

const MLIllustration = () => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const { current } = ref;
        if (!current) return;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                defaults: {
                    duration: 0.78,
                    ease: "power3.out",
                }
            });
            const girl = current.querySelector("#machine_learning_svg__girl");
            const phone = current.querySelector("#machine_learning_svg__phone");
            const botBody = current.querySelector("#machine_learning_svg__bot_body");
            const botHead = current.querySelector("#machine_learning_svg__bot_head");
            const charger = current.querySelector("#machine_learning_svg__bot_charger");

            if (girl) tl.from(girl, { opacity: 0, y: -14 });
            if (phone) tl.from(phone, { opacity: 0, y: -12 }, "-=0.36");
            if (botBody) tl.from(botBody, { opacity: 0, y: -16, scale: 0.97, transformOrigin: "50% 50%" }, "-=0.38");
            if (botHead) tl.from(botHead, { opacity: 0, y: -14 }, "-=0.42");
            if (charger) tl.from(charger, { opacity: 0, x: -8 }, "-=0.42");

            gsap.to(current, {
                y: -6,
                duration: 4.5,
                ease: "sine.inOut",
                repeat: -1,
                yoyo: true,
            });
        }, ref);

        return () => ctx.revert();
    }, []);

    return (
        <SectionIllustration ref={ref}>
            <MLIllustrationSvg />
        </SectionIllustration>
    );
};

export default MLIllustration;
