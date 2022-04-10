import { useEffect, useRef } from "react";
import WordpressIllustration from "@svg/wordpress_illustration.svg";
import { gsap } from "gsap";
import { SectionIllustration } from "@components/Section";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const WordPressIllustration = () => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const { current } = ref
        if (current) {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: current
                },
                defaults: {
                    duration: 1,
                    ease: "power3.inOut",
                }
            })
            const viewer1 = current.querySelector("#wordpress_illustration_svg__viewer_1");
            const viewer2 = current.querySelector("#wordpress_illustration_svg__viewer_2");
            const viewer3 = current.querySelector("#wordpress_illustration_svg__viewer_3");
            const logo = current.querySelector("#wordpress_illustration_svg__wordpress_logo");
            const persone = current.querySelector("#wordpress_illustration_svg__persone");
            tl.from(viewer1, {
                opacity: 0,
                y: -10
            }).from(viewer2, {
                opacity: 0,
                y: -10
            }).from(viewer3, {
                opacity: 0,
                y: -10
            }, "-=0.5").from(logo, {
                opacity: 0,
                y: -10
            }, "-=0.5").from(persone, {
                opacity: 0,
                x: 10
            }, "-=0.5")
        }
    }, []);

    return (
        <SectionIllustration ref={ref}>
            <WordpressIllustration />
        </SectionIllustration>
    );
};

export default WordPressIllustration;
