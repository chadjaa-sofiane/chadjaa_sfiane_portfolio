import { useEffect, useRef } from "react";
import MLIllustrationSvg from "@svg/machine_learning.svg";
import { gsap } from "gsap";
import { SectionIllustration } from "@components/Section";

const MLIllustration = () => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const { current } = ref
        if (current) {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: current
                },
                defaults: {
                    duration: 0.6,
                    ease: "power3.inOut",
                }
            })
            const girl = current.querySelector("#machine_learning_svg__girl");
            const phone = current.querySelector("#machine_learning_svg__phone");
            const botBody = current.querySelector("#machine_learning_svg__bot_body");
            const botHead = current.querySelector("#machine_learning_svg__bot_head");
            const charger = current.querySelector("#machine_learning_svg__bot_charger");

            tl.from(girl, {
                opacity: 0,
                y: -20
            }).from(phone, {
                opacity: 0,
                y: -10
            }).from(botBody, {
                opacity: 0,
                y: -20
            }).from(botHead, {
                opacity: 0,
                y: -20
            }, "-=0.5").from(charger, {
                opacity: 0
            },"-=0.5")
        }
    }, []);

    return (
        <SectionIllustration ref={ref}>
            <MLIllustrationSvg />
        </SectionIllustration>
    );
};

export default MLIllustration;
