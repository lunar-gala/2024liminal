import { useRef } from "react";
import { Clone, useGLTF, MeshTransmissionMaterial } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  SelectiveBloom,
} from "@react-three/postprocessing";
import { useThree, useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import * as THREE from "three";

export default function Model(props) {
  const groupRef = useRef();
  const bloomPanelRef = useRef();
  const { nodes, materials } = useGLTF("./LG-Home-01.glb");
  const model = useGLTF("./LG-Home-01.glb");

  useFrame(({ delta, pointer, clock }) => {
    groupRef.current.rotation.x = clock.getElapsedTime() / 8;
  });

  function Scene() {
    const { camera } = useThree();
    camera.layers.enable(1); // Enable the bloom layer on the camera
    camera.layers.enable(0); // Enable the bloom layer on the camera

    const planes = [];
    const radius = 1; // radius of the circle
    const numPlanes = 15; // number of planes
    var angle = (2 * Math.PI) / numPlanes;

    for (let i = 0; i < numPlanes; i++) {
      angle = ((2 * Math.PI) / numPlanes) * i; // angle for each plane
      var x = radius * Math.cos(angle);
      var z = radius * Math.sin(angle);
      console.log("x: ", x, "z: ", z, "angle: ", angle);
      console.log("planes: ", planes);
      planes.push(
        <mesh key={i} position={[x, 0, z]} rotation={[0, -angle, 0]}>
          <boxGeometry args={[0.45, 2, 0.01]} />
          <MeshTransmissionMaterial
            background={new THREE.Color(config.bg)}
            {...config}
          />
        </mesh>
      );
    }

    return <>
      {planes}
    </>;
  }

  // Lower 'samples' and 'resolution' for better performance (less lag)
  const config = useControls({
    meshPhysicalMaterial: false,
    transmissionSampler: false,
    backside: false,
    samples: { value: 16, min: 1, max: 32, step: 1 },
    resolution: { value: 2048, min: 256, max: 2048, step: 256 },
    transmission: { value: 1.0, min: 0, max: 1 },
    roughness: { value: 0.28, min: 0, max: 1, step: 0.01 },
    thickness: { value: 0.53, min: 0, max: 10, step: 0.01 },
    ior: { value: 1.74, min: 1, max: 5, step: 0.01 },
    chromaticAberration: { value: 0.0, min: 0, max: 1 },
    anisotropy: { value: 0.03, min: 0, max: 1, step: 0.01 },
    anisotropicBlur: { value: 0.88, min: 0, max: 1, step: 0.01 },
    distortion: { value: 0.42, min: 0, max: 1, step: 0.01 },
    distortionScale: { value: 0.3, min: 0.01, max: 1, step: 0.01 },
    temporalDistortion: { value: 0.06, min: 0, max: 1, step: 0.01 },
    clearcoat: { value: 0.48, min: 0, max: 1 },
    attenuationDistance: { value: 3.24, min: 0, max: 10, step: 0.01 },
    attenuationColor: "#ffffff",
    color: "#b3cfff",
    bg: "#ffffff",
  });

  const { rotation } = useControls({
    rotation: {
      value: [0, 0, 1.57], // initial value
      step: 0.01, // step size for each value
    },
  });

  // Checkout 'Clone' props from R3F Drei docs: https://github.com/pmndrs/drei?tab=readme-ov-file#clone
  return (
    <>
      <group
        ref={groupRef}
        dispose={null}
        position={[0, 0, 0]}
        rotation={rotation}
      >
        <Scene />
      </group>

      {/* glowing panel */}
      <mesh position={[0, 0, 0.45]}>
        <boxGeometry args={[2, 0.85, 0.01]} />
        <meshStandardMaterial
          emissive="white"
          color={"white"}
          toneMapped={false}
        />
      </mesh>
      {/* Bloom documentation : https://docs.pmnd.rs/react-postprocessing/effects/bloom */}
      <EffectComposer>
        <Bloom luminanceThreshold={0} luminanceSmoothing={0.1} height={300} />
      </EffectComposer>
    </>
  );
}
