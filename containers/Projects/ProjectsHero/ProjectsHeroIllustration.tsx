import { useRef, useEffect } from "react"
import { SectionIllustration } from "@components/Section";
import { gsap } from "gsap";
import ProjectsIllustrationSvg from "@svg/projects_illustration.svg";

const ProjectsHeroIllustration = () => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const { current } = ref;
        if (!current) return;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: current,
                    start: "top 85%",
                    once: true,
                },
                defaults: {
                    duration: 0.62,
                    ease: "power3.out",
                }
            });

            const girl = current.querySelector("#projects_illustration_svg__girl");
            const monitor = current.querySelector("#projects_illustration_svg__monitor");

            tl.
                from(girl, { x: 16, opacity: 0, y: -8 }).
                from(monitor, { x: -16, opacity: 0 }, "-=0.44");

            gsap.to(current, {
                y: -5,
                duration: 3.2,
                ease: "sine.inOut",
                repeat: -1,
                yoyo: true,
            });
        }, ref);

        return () => ctx.revert();
    }, []);

    return (
        <SectionIllustration ref={ref}>
            <ProjectsIllustrationSvg />
        </SectionIllustration>
    )
}

export default ProjectsHeroIllustration
