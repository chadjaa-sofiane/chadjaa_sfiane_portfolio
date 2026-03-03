import { useEffect, useRef } from "react";
import HeroIllustrationSvg from "@svg/hero_illustration.svg";
import { gsap } from "gsap";
import { SectionIllustration } from "@components/Section";

const HeroIllustration = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { current } = ref;
    if (!current) return;

    const ctx = gsap.context(() => {
      const bg = current.querySelector("#hero_illustration_svg__background");
      const table = current.querySelector("#hero_illustration_svg__table");
      const monitor = current.querySelector("#hero_illustration_svg__monitor");
      const person = current.querySelector("#hero_illustration_svg__person");
      const laptop = current.querySelector("#hero_illustration_svg__laptop");
      const mug = current.querySelector("#hero_illustration_svg__mug");
      const curtains = current.querySelector(
        "#hero_illustration_svg__curtains"
      );

      const tl = gsap.timeline({
        defaults: { duration: 0.72, ease: "power3.out" },
      });

      if (bg) tl.from(bg, { opacity: 0, scale: 0.985, transformOrigin: "50% 50%" });
      if (curtains) tl.from(curtains, { opacity: 0, y: -12 }, "-=0.36");
      if (table) tl.from(table, { x: -28, opacity: 0 }, "-=0.3");
      if (mug) tl.from(mug, { y: -14, opacity: 0 }, "-=0.36");
      if (monitor) tl.from(monitor, { y: -24, opacity: 0 }, "-=0.38");
      if (person) tl.from(person, { x: -42, opacity: 0 }, "-=0.34");
      if (laptop) tl.from(laptop, { x: 12, opacity: 0 }, "-=0.36");

      gsap.to(current, {
        y: -7,
        duration: 4.6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      if (monitor) {
        gsap.to(monitor, {
          filter: "drop-shadow(0 0 10px rgba(106, 224, 255, 0.28))",
          duration: 3.8,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      }
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <SectionIllustration ref={ref}>
      <div
        style={{
          filter:
            "drop-shadow(0 8px 24px rgba(17, 40, 68, 0.32)) drop-shadow(0 0 20px rgba(106, 224, 255, 0.18))",
        }}
      >
        <HeroIllustrationSvg />
      </div>
    </SectionIllustration>
  );
};

export default HeroIllustration;
