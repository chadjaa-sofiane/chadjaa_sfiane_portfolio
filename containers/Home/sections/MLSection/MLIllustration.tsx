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
                scrollTrigger: {
                    trigger: current
                },
                defaults: {
                    duration: 0.6,
                    ease: "power3.inOut",
                }
            });
            const girl = current.querySelector("#machine_learning_svg__girl");
            const phone = current.querySelector("#machine_learning_svg__phone");
            const botBody = current.querySelector("#machine_learning_svg__bot_body");
            const botHead = current.querySelector("#machine_learning_svg__bot_head");
            const charger = current.querySelector("#machine_learning_svg__bot_charger");

            if (girl) tl.from(girl, { opacity: 0, y: -20 });
            if (phone) tl.from(phone, { opacity: 0, y: -10 });
            if (botBody) tl.from(botBody, { opacity: 0, y: -20 });
            if (botHead) tl.from(botHead, { opacity: 0, y: -20 }, "-=0.5");
            if (charger) tl.from(charger, { opacity: 0 }, "-=0.5");
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
