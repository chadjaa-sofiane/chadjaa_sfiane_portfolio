import { useEffect, useRef } from "react";
import BackendIllustration from "@svg/backend_illustration.svg";
import { gsap } from "gsap";
import { SectionIllustration } from "@components/Section";

const BackEndIllustration = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { current } = ref;
    if (!current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: {
          duration: 0.78,
          ease: "power3.out",
        },
      });

      const svgRoot = current.querySelector("svg");
      const floor = current.querySelector("#backend_illustration_svg__floor");
      const server1 = current.querySelector("#backend_illustration_svg__server_1");
      const server2 = current.querySelector("#backend_illustration_svg__server_2");
      const server3 = current.querySelector("#backend_illustration_svg__server_3");
      const serverBars = current.querySelectorAll(
        '[id^="backend_illustration_svg__server_"][id*="_bar"]'
      );
      const serverDots = current.querySelectorAll(
        '[id^="backend_illustration_svg__server_"][id*="_dot_"]'
      );
      const ladder = current.querySelector("#backend_illustration_svg__ladder");
      const tshirt = current.querySelector("#backend_illustration_svg__tshirt");
      const pants = current.querySelector("#backend_illustration_svg__pants");
      const laptop = current.querySelector("#backend_illustration_svg__laptop");
      const arms = [
        current.querySelector("#backend_illustration_svg__arm"),
        current.querySelector("#backend_illustration_svg__arm_sleeve"),
      ].filter(Boolean);
      const head = [
        current.querySelector("#backend_illustration_svg__head"),
        current.querySelector("#backend_illustration_svg__hair"),
      ].filter(Boolean);
      const personBody = [
        current.querySelector("#backend_illustration_svg__tshirt"),
        current.querySelector("#backend_illustration_svg__pants"),
        current.querySelector("#backend_illustration_svg__laptop"),
        current.querySelector("#backend_illustration_svg__hand_1"),
        current.querySelector("#backend_illustration_svg__hand_2"),
        current.querySelector("#backend_illustration_svg__foot_1"),
        current.querySelector("#backend_illustration_svg__foot_2"),
        current.querySelector("#backend_illustration_svg__shoe_1"),
        current.querySelector("#backend_illustration_svg__shoe_2"),
        ...arms,
        ...head,
      ].filter(Boolean);

      if (svgRoot) tl.from(svgRoot, { opacity: 0, scale: 0.985, transformOrigin: "50% 50%" });
      if (floor) tl.from(floor, { opacity: 0, x: -26 }, "-=0.45");
      if (server3) tl.from(server3, { opacity: 0, x: 30 }, "-=0.5");
      if (server2) tl.from(server2, { opacity: 0, x: 26 }, "-=0.5");
      if (server1) tl.from(server1, { opacity: 0, x: 22 }, "-=0.5");
      if (serverBars.length) {
        tl.from(serverBars, { opacity: 0, x: 12, stagger: 0.05 }, "-=0.45");
      }
      if (serverDots.length) {
        tl.from(
          serverDots,
          { opacity: 0, scale: 0.3, transformOrigin: "50% 50%", stagger: 0.012 },
          "-=0.5"
        );
      }
      if (ladder) tl.from(ladder, { opacity: 0, y: -20, rotation: -3, transformOrigin: "100% 100%" }, "-=0.45");
      if (personBody.length) {
        tl.from(
          personBody,
          {
            opacity: 0,
            y: 14,
            x: -8,
            scale: 0.985,
            transformOrigin: "50% 60%",
            duration: 0.9,
            ease: "power3.out",
          },
          "-=0.52"
        );
      } else {
        if (pants) tl.from(pants, { opacity: 0, y: 18 }, "-=0.45");
        if (tshirt) tl.from(tshirt, { opacity: 0, y: 16 }, "-=0.5");
        if (arms.length) tl.from(arms, { opacity: 0, x: -16, stagger: 0.08 }, "-=0.5");
        if (head.length) tl.from(head, { opacity: 0, y: -10, stagger: 0.07 }, "-=0.46");
        if (laptop) tl.from(laptop, { opacity: 0, y: 12, x: -14 }, "-=0.5");
      }

      gsap.to(current, {
        y: -6,
        duration: 4.6,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <SectionIllustration ref={ref}>
      <BackendIllustration />
    </SectionIllustration>
  );
};

export default BackEndIllustration;
