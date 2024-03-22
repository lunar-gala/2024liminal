import './App.css'
import { useRef } from "react";
import { CameraControls, MeshTransmissionMaterial, RoundedBox, Text3D } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  SelectiveBloom,
} from "@react-three/postprocessing";
import { useThree, useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import * as THREE from "three";
import { fonts } from '../../src/index.jsx'

function Model() {
  const groupRef = useRef();
  const { viewport } = useThree();
  
  const paneWidth = viewport.width * 0.5
  const paneHeight = 0.3 * paneWidth
  const textSize = 0.22 * paneHeight
  const textRadScale = 0.9 * paneWidth
  const textY = 0.47 * paneWidth

  useFrame(({ delta, pointer, clock }) => {
    groupRef.current.rotation.x = clock.getElapsedTime() / 8;
  });


  function Pane({position, rotation, text, config, x, z, angle}) {
    
    return(
      <>
        <mesh 
          position={position} 
          rotation={rotation}
          onClick = { (e) => sendBack() }
          onPointerDown = { (e) => redirect(id) } 
        >
          <RoundedBox args={[paneHeight, paneWidth, 0.1]} radius={0.005} smoothness={2}>
            <meshLambertMaterial {...lambertConfig}/>
            {/* <MeshTransmissionMaterial
              background={new THREE.Color("#ffffff")}
              {...config}
            /> */}
          </RoundedBox>
        </mesh>
        
        <Text3D
          font="./fonts/Wordmark/NewEdge-666-Regular.json"
          size={textSize}
          height={0.01}
          position={[-x*textRadScale, textY, -z*textRadScale]}
          rotation={[0,-angle,-Math.PI / 2]}>
          {text}
          <meshBasicMaterial color="white" />
        </Text3D>
      </>
    )
  }

  const textConfig = {
    positiontext: {value: [0.01, .06 * paneWidth, -0.4 * paneWidth]},
    rotationtext: {value: [3.2 * paneWidth,3.14 * paneWidth, 0.07 * paneWidth]}
  };

  // Lower 'samples' and 'resolution' for better performance (less lag)
  const config = useControls({
    meshPhysicalMaterial: false,
    transmissionSampler: false,
    backside: false,
    samples: { value: 16, min: 1, max: 32, step: 1 },
    resolution: { value: 1024, min: 256, max: 2048, step: 256 },
    transmission: { value: .94, min: 0, max: 1 },
    roughness: { value: 0.24, min: 0, max: 1, step: 0.01 },
    thickness: { value: .4, min: 0, max: 10, step: 0.01 },
    ior: { value: 1.28, min: 1, max: 5, step: 0.01 },
    chromaticAberration: { value: 0.16, min: 0, max: 1 },
    anisotropy: { value: 0.25, min: 0, max: 1, step: 0.01 },
    anisotropicBlur: { value: 0.89, min: 0, max: 1, step: 0.01 },
    distortion: { value: 0.23, min: 0, max: 1, step: 0.01 },
    distortionScale: { value: 0.14, min: 0.01, max: 1, step: 0.01 },
    temporalDistortion: { value: 0.19, min: 0, max: 1, step: 0.01 },
    clearcoat: { value: 1.0, min: 0, max: 1 },
    attenuationDistance: { value: 4.53, min: 0, max: 10, step: 0.01 },
    attenuationColor: "#ffffff",
    color: "#92969d",
    bg: "#ffffff",
  });

  const lambertConfig = {
    transparent: true,
    opacity: 0.86,
    depthTest: true,
    depthWrite: true,
    alphaTest: 0,
    alphaHash: true,
    visible: true,
    side: THREE.DoubleSide,
    color: '#0b1926',
    emissive: '#000000',
    fog: true,
    combine: THREE.MultiplyOperation,
    reflectifity: 1,
    refractionRatio: 1
  }

  function Scene() {
    const { camera } = useThree();
    camera.layers.enable(1); // Enable the bloom layer on the camera
    camera.layers.enable(0); // Enable the bloom layer on the camera

    const planes = [];
    const radius = paneWidth / 3; // radius of the circle
    const numPlanes = 12; // number of planes
    var angle = (2 * Math.PI) / numPlanes;

    // Generate the planes
    const pages = ["TICKETS", "ABOUT", "PEOPLE", "LINES"]
    for (let i = 0; i < numPlanes; i++) {
      angle = ((2 * Math.PI) / numPlanes) * i; // angle for each plane
      var x = radius * Math.cos(angle);
      var z = radius * Math.sin(angle);

      let text = pages[i%4]

      planes.push(
        <Pane key={i} position={[x, 0, z]} rotation={[0, -angle, 0]} text={text} config={config} x={x} z={z} angle={angle} />
      );
    }

    return (
      <>
        {planes}
      </>
    )
  }

  const glowPosition = useControls({
    position: {value: [0, 0, 0.2], step: 0.01}
  });
  
  // const glowSize = useControls({
  //   glowSizing: {value: [2, 0.85, 0.01], step: 0.01}
  // })
  // const paneSize = useControls({
  //   paneSizing: {value: [0.45, 2, 0.01], step: 0.01}
  // })


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
      <mesh {...glowPosition}>
        <boxGeometry args={[paneWidth, 0.25 * paneWidth, 0.01]} />
        <meshStandardMaterial
          emissive="white"
          color={"white"}
          toneMapped={false}
        />
      </mesh>
      {/* Bloom documentation : https://docs.pmnd.rs/react-postprocessing/effects/bloom */}
      {/* <EffectComposer>
        <Bloom luminanceThreshold={0} luminanceSmoothing={0.1} height={300} />
      </EffectComposer> */}
    </>
  );
}


export function HomePage(viewport) {
  return (
    <>
      <fog attach="fog" color="#758ac1" near={1} far={10} />
      <Model />
    </>
  )
}

export default function App() {
  
  return (
    <>
      <CameraControls />
      <ambientLight intensity={ 0.5 } />
      <Model viewport={viewport} />
    </>
  )
}
