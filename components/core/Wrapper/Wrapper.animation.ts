import type React from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const appearAnimation = (ref: React.RefObject<HTMLDivElement>) => {
  gsap.from(ref.current, {
    scrollTrigger: {
      trigger: ref.current,
      start: "top center",
      toggleActions: "restart restart none none",
    },
  });
};
