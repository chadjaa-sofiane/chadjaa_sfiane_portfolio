import { useEffect, useRef } from "react";
import BackendIllustration from "@svg/backend_illustration.svg";
import { gsap } from "gsap";
import { SectionIllustration } from "@components/Section";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BackEndIllustration = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { current } = ref;
    if (current) {
      const tl = gsap.timeline({
        defaults: {
          duration: 0.5
        },
        scrollTrigger: {
          trigger: current,
        }
      });
      const serverBg = current.querySelector(
        "#backend_illustration_svg__background"
      );
      const cercle = current.querySelector(
        "#backend_illustration_svg__cercule"
      );
      const l1 = current.querySelector("#backend_illustration_svg__layout");
      const l2 = current.querySelector("#backend_illustration_svg__layout_2");
      const l3 = current.querySelector("#backend_illustration_svg__layout_3");

      const watch = current.querySelector("#backend_illustration_svg__watch");
      const phone = current.querySelector("#backend_illustration_svg__phone");
      const pc = current.querySelector("#backend_illustration_svg__pc");

      //backend_illustration_svg__watch
      //backend_illustration_svg__pc
      //backend_illustration_svg__phone

      tl.from(serverBg, { opacity: 0 })
        .from(l3, { opacity: 0, y: -15 })
        .from(l2, { opacity: 0, y: -15 })
        .from(l1, { opacity: 0, y: -15 })
        .from(cercle, { opacity: 0 })
        .from(watch, { x: 15, opacity: 0 })
        .from(phone, { x: -15, opacity: 0 })
        .from(pc, { y: -15, opacity: 0 });
    }
  }, []);

  return (
    <SectionIllustration ref={ref}>
      <BackendIllustration />
    </SectionIllustration>
  );
};

export default BackEndIllustration;
