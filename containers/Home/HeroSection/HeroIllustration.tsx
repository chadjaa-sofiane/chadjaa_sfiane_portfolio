import { useEffect, useRef } from "react";
import HeroIllustrationSvg from "@svg/hero_illustration.svg";
import { gsap } from "gsap";
import { SectionIllustration } from "@components/Section";

const HeroIllustration = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { current } = ref;
    if (current) {
      const bg = current.querySelector("#hero_illustration_svg__background");
      const table = current.querySelector("#hero_illustration_svg__table");
      const monitor = current.querySelector("#hero_illustration_svg__monitor");
      const person = current.querySelector("#hero_illustration_svg__person");
      const laptop = current.querySelector("#hero_illustration_svg__laptop");
      const mug = current.querySelector("#hero_illustration_svg__mug");
      const curtains = current.querySelector(
        "#hero_illustration_svg__curtains"
      );

      const tl = gsap.timeline({ duration: 0.5 });
      tl.from(bg, {
        opacity: 0,
      })
        .from(curtains, {
          opacity: 0,
        })
        .from(table, {
          x: -30,
          opacity: 0,
        })
        .from(mug, {
          y: -10,
          opacity: 0,
        })
        .from(monitor, {
          y: -30,
          opacity: 0,
        })
        .from(person, {
          x: -50,
          opacity: 0,
        })
        .from(laptop, {
          x: 10,
          opacity: 0,
        });
    }
  }, []);

  return (
    <SectionIllustration ref={ref}>
      <HeroIllustrationSvg />
    </SectionIllustration>
  );
};

export default HeroIllustration;
