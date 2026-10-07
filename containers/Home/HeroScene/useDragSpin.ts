import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";

/**
 * Drag-to-rotate for a diorama: the angle follows the pointer, coasts on
 * release and then settles back to 0 (the framing the posters were rendered
 * with). Call `step(delta)` once per frame and apply the returned angle.
 */
export const useDragSpin = () => {
  const gl = useThree((state) => state.gl);
  const drag = useRef({ active: false, lastX: 0, angle: 0, velocity: 0 });

  useEffect(() => {
    const el = gl.domElement;
    const down = (event: PointerEvent) => {
      drag.current.active = true;
      drag.current.lastX = event.clientX;
      drag.current.velocity = 0;
      el.setPointerCapture(event.pointerId);
    };
    const move = (event: PointerEvent) => {
      const state = drag.current;
      if (!state.active) return;
      const delta = ((event.clientX - state.lastX) / el.clientWidth) * Math.PI * 1.6;
      state.lastX = event.clientX;
      state.angle += delta;
      state.velocity = delta * 60;
    };
    const up = (event: PointerEvent) => {
      drag.current.active = false;
      if (el.hasPointerCapture(event.pointerId)) el.releasePointerCapture(event.pointerId);
    };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
  }, [gl]);

  const step = (delta: number) => {
    const turn = drag.current;
    if (!turn.active) {
      turn.angle += turn.velocity * delta;
      turn.velocity *= Math.exp(-delta * 4);
      if (Math.abs(turn.velocity) < 0.05) turn.angle *= Math.exp(-delta * 0.9);
    }
    return turn.angle;
  };

  return step;
};
