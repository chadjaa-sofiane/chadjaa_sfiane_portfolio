import { useRef, useEffect } from "react"
import { SectionIllustration } from "@components/Section";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import ProjectsIllustrationSvg from "@svg/projects_illustration.svg";

gsap.registerPlugin(ScrollTrigger);

const ProjectsHeroIllustration = () => {
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
            //#wordpress_illustration_svg__viewer_1
            const girl = current.querySelector("#projects_illustration_svg__girl")
            const monitor = current.querySelector("#projects_illustration_svg__monitor")
            tl.
                from(girl, { x: 10, opacity: 0 }).
                from(monitor, { x: -10, opacity: 0 }, "-=0.5")
        }
    }
        , [])
    return (
        <SectionIllustration ref={ref}>
            <ProjectsIllustrationSvg />
        </SectionIllustration>
    )
}

export default ProjectsHeroIllustration