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
        defaults: { duration: 0.4 },
      });

      if (bg) tl.from(bg, { opacity: 0 });
      if (curtains) tl.from(curtains, { opacity: 0 });
      if (table) tl.from(table, { x: -30, opacity: 0 });
      if (mug) tl.from(mug, { y: -10, opacity: 0 });
      if (monitor) tl.from(monitor, { y: -30, opacity: 0 });
      if (person) tl.from(person, { x: -50, opacity: 0 });
      if (laptop) tl.from(laptop, { x: 10, opacity: 0 });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <SectionIllustration ref={ref}>
      <div style={{ filter: "drop-shadow(0px 0px 20px rgba(255, 255, 255, 0.15))" }}>
        <HeroIllustrationSvg />
      </div>
    </SectionIllustration>
  );
};

export default HeroIllustration;
