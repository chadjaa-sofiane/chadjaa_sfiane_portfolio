import { useEffect, useRef } from "react";
import DevOpsIllustrationSvg from "@svg/devops_illustraction.svg";
import { gsap } from "gsap";
import { SectionIllustration } from "@components/Section";

const DevOpsIllustration = () => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const { current } = ref;
        if (!current) return;

        // Use gsap.context for automatic cleanup
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                defaults: {
                    duration: 0.78,
                    ease: "power3.out"
                },
            });

            // Get SVG elements by ID for precise targeting
            const floor = current.querySelector("#floor");
            const server1 = current.querySelector("#server_1");
            const server1Bar = current.querySelector("#server_1_bar");
            const server1Dots = current.querySelectorAll('[id^="server_1_dot"]');
            const server2 = current.querySelector("#server_2");
            const server2Bar = current.querySelector("#server_2_bar");
            const server2Dots = current.querySelectorAll('[id^="server_2_dot"]');
            const server3 = current.querySelector("#server_3");
            const server3Bar = current.querySelector("#server_3_bar");
            const server3Dots = current.querySelectorAll('[id^="server_3_dot"]');
            const ladder = current.querySelector("#ladder");
            const head = current.querySelector("#head");
            const hair = current.querySelector("#hair");
            const tshirt = current.querySelector("#tshirt");
            const arm = current.querySelector("#arm");
            const armSleeve = current.querySelector("#arm_sleeve");
            const hand1 = current.querySelector("#hand_1");
            const hand2 = current.querySelector("#hand_2");
            const pants = current.querySelector("#pants");
            const laptop = current.querySelector("#laptop");
            const foot1 = current.querySelector("#foot_1");
            const foot2 = current.querySelector("#foot_2");
            const shoe1 = current.querySelector("#shoe_1");
            const shoe2 = current.querySelector("#shoe_2");

            // Build animation with null checks
            if (floor) {
                tl.from(floor, {
                    opacity: 0,
                    x: -100,
                    duration: 0.4,
                });
            }

            // Servers slide in from right with stagger
            const serverElements3 = [server3, server3Bar, ...(server3Dots ? Array.from(server3Dots) : [])].filter(Boolean);
            if (serverElements3.length) {
                tl.from(serverElements3, {
                    opacity: 0,
                    x: 50,
                    stagger: 0.05,
                }, "-=0.2");
            }

            const serverElements2 = [server2, server2Bar, ...(server2Dots ? Array.from(server2Dots) : [])].filter(Boolean);
            if (serverElements2.length) {
                tl.from(serverElements2, {
                    opacity: 0,
                    x: 50,
                    stagger: 0.05,
                }, "-=0.4");
            }

            const serverElements1 = [server1, server1Bar, ...(server1Dots ? Array.from(server1Dots) : [])].filter(Boolean);
            if (serverElements1.length) {
                tl.from(serverElements1, {
                    opacity: 0,
                    x: 50,
                    stagger: 0.05,
                }, "-=0.4");
            }

            // Ladder slides in from top
            if (ladder) {
                tl.from(ladder, {
                    opacity: 0,
                    y: -30,
                    rotation: -10,
                    transformOrigin: "bottom right",
                }, "-=0.3");
            }

            // Person's body parts slide in smoothly
            const shoes = [shoe1, shoe2].filter(Boolean);
            if (shoes.length) {
                tl.from(shoes, {
                    opacity: 0,
                    y: 20,
                    stagger: 0.1,
                }, "-=0.3");
            }

            const feet = [foot1, foot2].filter(Boolean);
            if (feet.length) {
                tl.from(feet, {
                    opacity: 0,
                    y: 15,
                    stagger: 0.1,
                }, "-=0.2");
            }

            if (pants) {
                tl.from(pants, {
                    opacity: 0,
                    y: 20,
                }, "-=0.3");
            }

            if (tshirt) {
                tl.from(tshirt, {
                    opacity: 0,
                    y: 15,
                    scale: 0.95,
                }, "-=0.2");
            }

            const arms = [armSleeve, arm].filter(Boolean);
            if (arms.length) {
                tl.from(arms, {
                    opacity: 0,
                    x: -20,
                    stagger: 0.1,
                }, "-=0.3");
            }

            const hands = [hand1, hand2].filter(Boolean);
            if (hands.length) {
                tl.from(hands, {
                    opacity: 0,
                    scale: 0.8,
                    stagger: 0.1,
                }, "-=0.2");
            }

            const headParts = [head, hair].filter(Boolean);
            if (headParts.length) {
                tl.from(headParts, {
                    opacity: 0,
                    y: -15,
                    stagger: 0.1,
                }, "-=0.3");
            }

            // Laptop slides in last
            if (laptop) {
                tl.from(laptop, {
                    opacity: 0,
                    x: -30,
                    y: 10,
                }, "-=0.2");
            }

            gsap.to(current, {
                y: -6,
                duration: 4.7,
                ease: "sine.inOut",
                repeat: -1,
                yoyo: true,
            });
        }, ref);

        // Cleanup on unmount
        return () => ctx.revert();
    }, []);

    return (
        <SectionIllustration ref={ref}>
            <DevOpsIllustrationSvg />
        </SectionIllustration>
    );
};

export default DevOpsIllustration;
