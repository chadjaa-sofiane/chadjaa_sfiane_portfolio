import { Suspense, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, ThreeEvent, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { Lights } from "containers/Home/HeroScene/HeroScene";
import { useDragSpin } from "containers/Home/HeroScene/useDragSpin";

/**
 * Live version of the workshop built by scripts/blender/projects_scene.py.
 *
 * The GLB has one "intro" clip that assembles the desk, played once. Each
 * clickable piece sits under an un-animated hot_<id> empty whose extras carry
 * `target` (a page anchor) and `label`; hovering lifts it, clicking jumps there.
 */

export const PROJECTS_MODEL_URL = "/3d/projects.glb";
export const PROJECTS_POSTER = "/3d/projects-poster.webp";

const LIFT = 0.16;
/** A press that travels further than this (px) was a drag, not a click. */
const CLICK_SLOP = 6;

export interface Hotspot {
  target: string;
  label: string;
}

export interface ProjectsSceneProps {
  active: boolean;
  onReady?: () => void;
  // eslint-disable-next-line no-unused-vars
  onHover?: (spot: Hotspot | null) => void;
  // eslint-disable-next-line no-unused-vars
  onSelect?: (spot: Hotspot) => void;
}

const hotRoot = (obj: THREE.Object3D | null) => {
  for (let node = obj; node; node = node.parent) if (node.userData.target) return node;
  return null;
};

const Workshop = ({ onReady, onHover, onSelect }: Omit<ProjectsSceneProps, "active">) => {
  const gltf = useLoader(GLTFLoader, PROJECTS_MODEL_URL, (loader) => loader.setMeshoptDecoder(MeshoptDecoder));
  const camera = useThree((state) => state.camera) as THREE.PerspectiveCamera;
  const size = useThree((state) => state.size);
  const gl = useThree((state) => state.gl);
  const spin = useRef<THREE.Group>(null);
  const hovered = useRef<THREE.Object3D | null>(null);
  const dragSpin = useDragSpin();

  const rig = useMemo(() => {
    const scene = gltf.scene;
    const mixer = new THREE.AnimationMixer(scene);
    const spinners: { obj: THREE.Object3D; speed: number }[] = [];
    const hots: { obj: THREE.Object3D; rest: number; lift: number }[] = [];
    let glow: THREE.MeshStandardMaterial | null = null;

    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        const material = mesh.material as THREE.MeshStandardMaterial;
        // The glass is see-through; letting it cast would paint a solid blot.
        mesh.castShadow = material.name !== "glass";
        mesh.receiveShadow = true;
        if (material.name === "glow") glow = material;
      }
      if (obj.userData.idle === "spin") spinners.push({ obj, speed: Number(obj.userData.idle_speed) || 0.6 });
      if (obj.userData.target) hots.push({ obj, rest: obj.position.y, lift: 0 });
    });

    const intro = gltf.animations.find((clip) => clip.name === "intro");
    if (intro) {
      const action = mixer.clipAction(intro);
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true;
      action.play();
    }
    const glowMat = glow as THREE.MeshStandardMaterial | null;
    return { scene, mixer, spinners, hots, glow: glowMat, glowBase: (glowMat?.emissiveIntensity ?? 1) * 0.45, elapsed: 0 };
  }, [gltf]);

  useLayoutEffect(() => {
    const source = gltf.cameras[0] as THREE.PerspectiveCamera | undefined;
    if (!source) return;
    gltf.scene.updateMatrixWorld(true);
    source.getWorldPosition(camera.position);
    source.getWorldQuaternion(camera.quaternion);
    const aspect = size.width / Math.max(size.height, 1);
    const halfV = THREE.MathUtils.degToRad(source.fov / 2);
    camera.fov = aspect >= 1 ? source.fov : THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(halfV) / aspect));
    camera.near = 0.1;
    camera.far = 60;
    camera.updateProjectionMatrix();
  }, [camera, gltf, size.width, size.height]);

  // Latest callbacks, so effects and handlers never depend on their identity.
  const callbacks = useRef({ onReady, onHover, onSelect });
  callbacks.current = { onReady, onHover, onSelect };

  useEffect(() => {
    callbacks.current.onReady?.();
    return () => {
      rig.mixer.stopAllAction();
      gl.domElement.style.cursor = "";
    };
  }, [rig, gl]);

  const setHovered = (obj: THREE.Object3D | null) => {
    if (hovered.current === obj) return;
    hovered.current = obj;
    gl.domElement.style.cursor = obj ? "pointer" : "";
    callbacks.current.onHover?.(obj ? { target: obj.userData.target, label: obj.userData.label } : null);
  };

  const handleMove = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setHovered(hotRoot(event.object));
  };

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    if (event.delta > CLICK_SLOP) return;
    const hot = hotRoot(event.object);
    if (hot) callbacks.current.onSelect?.({ target: hot.userData.target, label: hot.userData.label });
  };

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 1 / 20);
    rig.elapsed += delta;
    rig.mixer.update(delta);
    for (const { obj, speed } of rig.spinners) obj.rotateY(delta * speed);

    const ease = 1 - Math.exp(-delta * 10);
    rig.hots.forEach((hot, i) => {
      hot.lift += ((hovered.current === hot.obj ? LIFT : 0) - hot.lift) * ease;
      hot.obj.position.y = hot.rest + hot.lift + Math.sin(rig.elapsed * 1.2 + i * 1.7) * 0.02;
    });

    if (rig.glow) {
      const boost = hovered.current ? 1.35 : 1;
      rig.glow.emissiveIntensity = rig.glowBase * boost * (0.82 + 0.18 * Math.sin(rig.elapsed * 2.1));
    }
    if (spin.current) spin.current.rotation.y = dragSpin(delta) + Math.sin(rig.elapsed * 0.25) * 0.08;
  });

  return (
    <group ref={spin}>
      <primitive
        object={rig.scene}
        onPointerMove={handleMove}
        onPointerOut={() => setHovered(null)}
        onClick={handleClick}
      />
    </group>
  );
};

const ProjectsScene = ({ active, onReady, onHover, onSelect }: ProjectsSceneProps) => (
  <Canvas
    dpr={[1, 1.75]}
    shadows="soft"
    frameloop={active ? "always" : "never"}
    gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
    camera={{ fov: 34, position: [6, 5, 6] }}
    onCreated={({ gl }) => {
      gl.toneMapping = THREE.AgXToneMapping;
      gl.toneMappingExposure = 1;
    }}
    onPointerMissed={() => onHover?.(null)}
  >
    <Lights />
    <Suspense fallback={null}>
      <Workshop onReady={onReady} onHover={onHover} onSelect={onSelect} />
    </Suspense>
  </Canvas>
);

export default ProjectsScene;
