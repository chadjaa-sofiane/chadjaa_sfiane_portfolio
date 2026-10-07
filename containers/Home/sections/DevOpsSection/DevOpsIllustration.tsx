import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { SectionIllustration } from "@components/Section";
import DeploymentIllustration from "@svg/deployment_illustration.svg";

const DevOpsIllustration = ({ active = true, onComplete }: { active?: boolean; onComplete?: () => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!ref.current || !active || reduceMotion) return;

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        onComplete,
        defaults: { duration: 0.65, ease: "power3.out" },
      });

      timeline
        .from('[data-part="background"]', { opacity: 0 }, 0)
        .from('[data-part="platform"]', { opacity: 0, y: 10 }, 0.1)
        .from('[data-part="laptop"]', { opacity: 0, x: -24 }, 0.15)
        .from('[data-part="pipeline"]', { opacity: 0, y: 8 }, 0.4)
        .from('[data-part="cloud"]', { opacity: 0, y: -18 }, 0.55)
        .from('[data-part="rocket"]', { opacity: 0, y: 45, duration: 1 }, 0.7)
        .from('[data-part="release"]', { opacity: 0, y: 12 }, 1.25)
        .from('[data-part="flame"]', {
          opacity: 0.35,
          scaleY: 0.8,
          transformOrigin: "50% 0%",
          duration: 0.3,
          repeat: 3,
          yoyo: true,
          ease: "sine.inOut",
        }, 1.1);
      timeline.duration(2.3);
    }, ref);

    return () => context.revert();
  }, [active, reduceMotion, onComplete]);

  return (
    <SectionIllustration ref={ref}>
      <DeploymentIllustration />
    </SectionIllustration>
  );
};

export default DevOpsIllustration;
