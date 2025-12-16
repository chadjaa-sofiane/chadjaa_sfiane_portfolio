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
          duration: 0.4
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

      if (serverBg) tl.from(serverBg, { opacity: 0 });
      if (l3) tl.from(l3, { opacity: 0, y: -15 });
      if (l2) tl.from(l2, { opacity: 0, y: -15 });
      if (l1) tl.from(l1, { opacity: 0, y: -15 });
      if (cercle) tl.from(cercle, { opacity: 0 });
      if (watch) tl.from(watch, { x: 15, opacity: 0 });
      if (phone) tl.from(phone, { x: -15, opacity: 0 });
      if (pc) tl.from(pc, { y: -15, opacity: 0 });
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
