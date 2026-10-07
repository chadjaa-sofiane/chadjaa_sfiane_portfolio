import { Suspense, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { HERO_MODEL_URL, RoleId } from "./roles";
import { useDragSpin } from "./useDragSpin";

/**
 * Live version of the hero diorama built by scripts/blender/hero_scene.py.
 *
 * The GLB holds one shared plinth, a role_<id> group per specialty and one
 * baked clip per role. Switching roles plays the outgoing clip backwards
 * (the diorama takes itself apart) and then the incoming one forwards. Parts
 * tagged idle="spin" in Blender turn slowly once a role is assembled.
 */

/** Time a role stays assembled before the parent may move on. */
const HOLD_SECONDS = 2.2;
/** Disassembly runs faster than assembly so switching never feels sluggish. */
const REVERSE_SPEED = 2.4;
/** The Blender camera is framed for this aspect; narrower canvases widen the FOV. */
const DESIGN_ASPECT = 1;

export interface HeroSceneProps {
  role: RoleId;
  active: boolean;
  // eslint-disable-next-line no-unused-vars
  onComplete?: (role: RoleId) => void;
  onReady?: () => void;
}

type Phase = "in" | "out" | "hold" | "idle";

const loadModel = (loader: GLTFLoader) => {
  loader.setMeshoptDecoder(MeshoptDecoder);
};

const Diorama = ({ role, onComplete, onReady }: Omit<HeroSceneProps, "active">) => {
  const gltf = useLoader(GLTFLoader, HERO_MODEL_URL, loadModel);
  const camera = useThree((state) => state.camera) as THREE.PerspectiveCamera;
  const size = useThree((state) => state.size);
  const parallax = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const dragSpin = useDragSpin();

  // Latest props, read from inside the frame loop without re-subscribing.
  const targetRef = useRef(role);
  const completeRef = useRef(onComplete);
  targetRef.current = role;
  completeRef.current = onComplete;

  const rig = useMemo(() => {
    const scene = gltf.scene;
    const mixer = new THREE.AnimationMixer(scene);
    const roles = new Map<string, { group: THREE.Object3D; action: THREE.AnimationAction }>();
    const spinners: { obj: THREE.Object3D; speed: number }[] = [];
    let glow: THREE.MeshStandardMaterial | null = null;

    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        const material = mesh.material as THREE.MeshStandardMaterial;
        if (material.name === "glow") glow = material;
      }
      if (obj.userData.idle === "spin") {
        spinners.push({ obj, speed: Number(obj.userData.idle_speed) || 0.6 });
      }
    });

    for (const clip of gltf.animations) {
      const group = scene.getObjectByName(`role_${clip.name}`);
      if (!group) continue;
      const action = mixer.clipAction(clip);
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true;
      group.visible = false;
      roles.set(clip.name, { group, action });
    }

    return {
      scene,
      mixer,
      roles,
      spinners,
      glow: glow as THREE.MeshStandardMaterial | null,
      // Cycles blooms nothing, so a strength tuned there reads as white under
      // AgX here; a lower intensity keeps the seam teal.
      glowBase: ((glow as THREE.MeshStandardMaterial | null)?.emissiveIntensity ?? 1) * 0.45,
      state: { shown: null as string | null, phase: "idle" as Phase, holdUntil: 0, elapsed: 0, started: false },
    };
  }, [gltf]);

  // Match the camera Blender framed (and rendered the posters with), widening
  // the vertical FOV on narrow canvases so the plinth is never cropped.
  useLayoutEffect(() => {
    const source = gltf.cameras[0] as THREE.PerspectiveCamera | undefined;
    if (!source) return;
    gltf.scene.updateMatrixWorld(true);
    source.getWorldPosition(camera.position);
    source.getWorldQuaternion(camera.quaternion);
    const aspect = size.width / Math.max(size.height, 1);
    const halfV = THREE.MathUtils.degToRad(source.fov / 2);
    camera.fov =
      aspect >= DESIGN_ASPECT
        ? source.fov
        : THREE.MathUtils.radToDeg(2 * Math.atan((Math.tan(halfV) * DESIGN_ASPECT) / aspect));
    camera.near = 0.1;
    camera.far = 60;
    camera.updateProjectionMatrix();
  }, [camera, gltf, size.width, size.height]);

  useEffect(() => {
    const { mixer, state, roles } = rig;
    const onFinished = (event: { action: THREE.AnimationAction; direction: number }) => {
      if (event.direction < 0) {
        const outgoing = state.shown ? roles.get(state.shown) : undefined;
        if (outgoing) outgoing.group.visible = false;
        state.shown = null;
        state.phase = "idle";
      } else if (state.phase === "in") {
        state.phase = "hold";
        state.holdUntil = state.elapsed + HOLD_SECONDS;
      }
    };
    mixer.addEventListener("finished", onFinished as never);
    return () => mixer.removeEventListener("finished", onFinished as never);
  }, [rig]);

  useEffect(() => {
    const move = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  useEffect(() => () => {
    rig.mixer.stopAllAction();
  }, [rig]);

  useFrame((_, rawDelta) => {
    // Clamp so a backgrounded tab does not skip straight to the end of a clip.
    const delta = Math.min(rawDelta, 1 / 20);
    const { mixer, roles, state, spinners, glow, glowBase } = rig;
    state.elapsed += delta;
    const target = targetRef.current;

    if (!state.started) {
      // First frame: show the role fully assembled so the handoff from the
      // static poster is seamless, then hold as if it had just been built.
      const first = roles.get(target);
      if (first) {
        first.group.visible = true;
        first.action.reset().play();
        first.action.time = first.action.getClip().duration;
        state.shown = target;
        state.phase = "hold";
        state.holdUntil = state.elapsed + HOLD_SECONDS;
      }
      state.started = true;
      onReady?.();
    } else if (state.shown !== target && state.phase !== "out") {
      const current = state.shown ? roles.get(state.shown) : undefined;
      if (current) {
        // Take the current role apart from wherever it is, even mid-build.
        current.action.paused = false;
        current.action.enabled = true;
        current.action.timeScale = -REVERSE_SPEED;
        current.action.play();
        state.phase = "out";
      } else {
        const next = roles.get(target);
        if (next) {
          next.action.reset();
          next.action.timeScale = 1;
          next.action.play();
          next.group.visible = true;
          state.shown = target;
          state.phase = "in";
        }
      }
    } else if (state.phase === "hold" && state.elapsed >= state.holdUntil) {
      state.phase = "idle";
      if (state.shown) completeRef.current?.(state.shown as RoleId);
    }

    mixer.update(delta);

    for (const { obj, speed } of spinners) obj.rotateY(delta * speed);
    if (glow) glow.emissiveIntensity = glowBase * (0.82 + 0.18 * Math.sin(state.elapsed * 2.1));
    if (state.shown) {
      const shown = roles.get(state.shown);
      if (shown) shown.group.position.y = Math.sin(state.elapsed * 1.1) * 0.035;
    }

    const angle = dragSpin(delta);
    if (spin.current) spin.current.rotation.y = angle;

    const group = parallax.current;
    if (group) {
      const sway = Math.sin(state.elapsed * 0.25) * 0.09;
      const ease = 1 - Math.exp(-delta * 3);
      group.rotation.y += (pointer.current.x * 0.22 + sway - group.rotation.y) * ease;
      group.rotation.x += (pointer.current.y * 0.05 - group.rotation.x) * ease;
    }
  });

  return (
    <group ref={spin}>
      <group ref={parallax}>
        <primitive object={rig.scene} />
      </group>
    </group>
  );
};

export const Lights = () => {
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);

  // A procedural studio for reflections: no HDR download, nothing external.
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const env = pmrem.fromScene(room, 0.04).texture;
    scene.environment = env;
    scene.environmentIntensity = 0.18;
    return () => {
      scene.environment = null;
      env.dispose();
      room.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);

  // Positions mirror the Blender key/fill/rim rig (Z-up converted to Y-up).
  return (
    <>
      <hemisphereLight args={["#c9d8e6", "#06090d", 0.35]} />
      <directionalLight
        position={[-3.5, 6.5, 5]}
        color="#fff1dc"
        intensity={2.4}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
        shadow-camera-left={-3}
        shadow-camera-right={3}
        shadow-camera-top={3}
        shadow-camera-bottom={-3}
        shadow-camera-near={1}
        shadow-camera-far={20}
      />
      <directionalLight position={[6, 2.5, 1]} color="#cfe3ff" intensity={0.7} />
      <directionalLight position={[1.5, 4.5, -6]} color="#5fe0cf" intensity={2.2} />
    </>
  );
};

const HeroScene = ({ role, active, onComplete, onReady }: HeroSceneProps) => (
  <Canvas
    dpr={[1, 1.75]}
    shadows="soft"
    frameloop={active ? "always" : "never"}
    gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
    camera={{ fov: 34, position: [6, 5, 6] }}
    onCreated={({ gl }) => {
      gl.toneMapping = THREE.AgXToneMapping; // same view transform as the Cycles posters
      gl.toneMappingExposure = 1;
    }}
  >
    <Lights />
    <Suspense fallback={null}>
      <Diorama role={role} onComplete={onComplete} onReady={onReady} />
    </Suspense>
  </Canvas>
);

export default HeroScene;
