import { TRefs } from "./ContactField.context";
import { gsap } from "gsap";
const tl = gsap.timeline({
  defaults: {
    duration: 0.5,
    ease: "power2.inOut",
  },
});

export const startAnimation = (refs: TRefs) => {
  if (tl.reversed()) {
    tl.play();
    return;
  }
  const { formRef, MessageRef, MessageSvgRef } = refs;

  if (!formRef || !MessageRef || !MessageSvgRef?.current) return;
  const papper = MessageSvgRef.current?.querySelector("#message_svg__papper");
  const open = MessageSvgRef.current?.querySelector("#message_svg__open");

  tl.to(formRef?.current, { opacity: 0, scale: 0.9 })
    .to(MessageRef?.current, { visibility: "visible", opacity: 1, scale: 1 })
    .to(papper, { y: 50, opacity: 0 }, "-=0.5")
    .to(open, { opacity: 0 }, "-=0.5");
};

export const reverseAnimation = () => {
  tl.reverse();
};
