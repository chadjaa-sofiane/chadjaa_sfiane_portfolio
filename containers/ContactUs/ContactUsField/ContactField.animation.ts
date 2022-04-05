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
  const { formRef, MessageRef } = refs;
  tl.to(formRef!?.current, { opacity: 0, scale: 0.9 }).to(
    MessageRef!?.current,
    { visibility: "visible", opacity: 1, scale: 1 }
  );
};

export const reverseAnimation = () => {
  tl.reverse();
};
