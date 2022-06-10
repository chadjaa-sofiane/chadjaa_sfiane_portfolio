import { useRef, useEffect } from "react";
import { SectionIllustration } from "@components/Section"
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import ContactIllustrationSvg from "@svg/contact.svg";

gsap.registerPlugin(ScrollTrigger);

const ContactHeroIllustration = () => {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const { current } = ref;
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
            const persone1 = current.querySelector("#contact_svg__persone");
            const persone2 = current.querySelector("#contact_svg__persone-2");
            const paper = current.querySelector("#contact_svg__paper");

            tl.from(persone1, { x: -10, opacity: 0 })
                .from(persone2, { x: 10, opacity: 0 })
                .from(paper, { y: -10, opacity: 0 })
        }
    }, [])
    return (
        <SectionIllustration ref={ref}>
            <ContactIllustrationSvg />
        </SectionIllustration>
    )
}

export default ContactHeroIllustration