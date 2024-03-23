// utilities
import './App.css'
import { fonts, map, constrain, Cover, Pane, redirect, sendBack } from './index.jsx'

// react imports
import React, 
{ Suspense,
  useEffect,
  useState, 
  useRef 
} from "react"
import { 
  Stats, 
  Loader, 
  MeshTransmissionMaterial, 
  RoundedBox, 
  Text3D
} from '@react-three/drei'
import {
  EffectComposer,
  Bloom,
  SelectiveBloom,
} from "@react-three/postprocessing";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber"
import { useControls } from "leva";
import * as THREE from "three";

// nav
import { useLocation, Switch, Route } from "wouter"
import { useTransition, useSpringValue } from "@react-spring/core"
import { a, animated } from "@react-spring/three"

// pages
import { AboutPage } from "../about/src/App.jsx"
import { TixPage } from "../tickets/src/App.jsx"
import { PeoplePage } from "../people/src/App.jsx"
import { LinesPage } from "../lines/src/App.jsx"

const Color = ({args}) => {
  return <><color attach="background" args={[args]} /></>
}

const AnimatedColor = animated(Color);

const App = () => {

  // is mobile
  const [width, setWidth] = useState(window.innerWidth)

  function handleWindowSizeChange() {
      setWidth(window.innerWidth)
  }
  useEffect(() => {
      window.addEventListener('resize', handleWindowSizeChange)
      return () => {
          window.removeEventListener('resize', handleWindowSizeChange)
      }
  }, [])

  console.log(width)

  const isMobile = width <= 768

  // Current route
  const [location] = useLocation()

  // transition duration
  const duration = 5000;

  const opacitySpring = useSpringValue(0);

  const go_in = {
    from: { position: [0, 0, -10], rotation: [0, 0, 0], scale: [0, 0, 0], opacity: 0 },
    enter: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1], opacity: 1 },
    leave: { position: [0, 0, 100], rotation: [0, 0, 0], scale: [0, 0, 0], opacity: 0 },
    config: () => (n) => n === "opacity" && { friction: 1000, duration: duration },
  }

  const go_out = {
    from: { position: [0, 0, 10], rotation: [0, 0, 0], scale: [0, 0, 0], opacity: 0 },
    enter: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1], opacity: 1 },
    leave: { position: [0, 0, -100], rotation: [0, 0, 0], scale: [0, 0, 0], opacity: 0 },
    config: () => (n) => n === "opacity" && { friction: 1000, duration: duration },
  }

  const transition_settings = (location == '/') ? go_out : go_in;
  
  // Animated shape props
  const transition = useTransition(location, transition_settings)

  return (
    <>
      <Cover>
        <Canvas camera={{ position: [0, 0, 20], fov: 50 }} >
          <color attach="background" args={['black']} />
          {/* <AnimatedColor args={opacitySpring.to((value) => [value, value, value])}/> */}
          <ambientLight intensity={1}/>
          {/* <directionalLight position={[0, 0, 5]} intensity={0.5} /> */}
          <Suspense fallback={null}>
            <Pages transition={transition} isMobile={isMobile} spring={opacitySpring} />
          </Suspense>
        </Canvas>
      </Cover>
      {/* <Nav /> */}
      <Loader />
    </>
  )

}
export default App


/**
 * NAV
 */
function Pages({ transition, isMobile, spring }) {

  return transition(({ opacity, ...props }, location) => (
    <a.group {...props}>
      <Switch location={location}>
        <Route path="/">
          <HomePage spring={spring} />
        </Route>
        <Route path="/about">
          <AboutPage />
        </Route>
        <Route path="/tickets">
          <TixPage />
        </Route>
        <Route path="/people">
          <PeoplePage isMobile={isMobile} />
        </Route>
        <Route path="/lines">
          <LinesPage />
        </Route>
      </Switch>
      <Sensor spring={spring}/>
    </a.group>
  ))
}

// mesh element that covers the screen and calls sendBack() 
// when the mouse is lifted
function Sensor({spring}) {
  return (
    <mesh 
      position = {[0, 0, 0]} 
      onPointerUp = { (e) => sendBack(spring) } 
      onClick = { (e) => sendBack(spring) }
    >
      <boxGeometry args={[100, 100, 0.1]}/>
      <meshPhongMaterial color={"pink"} opacity={0} transparent />
    </mesh>
  )
}

/**
 * SUB-PAGES
 * should go in seperate files
 */

function Model({spring}) {
  const groupRef = useRef();
  const { viewport } = useThree();
  
  const paneWidth = viewport.width * 0.5
  const paneHeight = 0.3 * paneWidth
  const textSize = 0.22 * paneHeight
  const textRadScale = 0.9
  const textY = 0.47 * paneWidth

  useFrame(({ delta, pointer, clock }) => {
    groupRef.current.rotation.x = clock.getElapsedTime() / 8;
  });


  function Pane({position, rotation, text, config, x, z, angle, id}) {
    
    return(
      <>
        <mesh 
          position={position} 
          rotation={rotation}
          onClick = { (e) => sendBack(spring) }
          onPointerDown = { (e) => redirect(id, spring) } 
        >
          <RoundedBox args={[paneHeight, paneWidth, 0.1]} radius={0.07} smoothness={2}>
            {/* <meshLambertMaterial {...lambertConfig}/> */}
            <MeshTransmissionMaterial
              background={new THREE.Color("#ffffff")}
              meshPhysicalMaterial={false}
              transmissionSampler={false}
              backside={false}
              samples={16}
              resolution={100}
              transmission={0.94}
              roughness={0.24}
              thickness={1.62}
              ior={1.65}
              chromaticAberration={0.25}
              anisotropy={0.2}
              anisotropicBlur={1.0}
              distortion={0.06}
              distortionScale={0.2}
              temporalDistortion={0.1}
              clearcoat={1.0}
              attenuationDistance={2.61}
              attenuationColor={"#ffffff"}
              color={"#92969d"}
              bg={"#ffffff"}
            />
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


  const lambertConfig = {
    transparent: true,
    opacity: 0.86,
    depthTest: true,
    depthWrite: true,
    alphaTest: 0,
    alphaHash: true,
    visible: true,
    side: THREE.DoubleSide,
    color: '#5c5a5f',
    emissive: '#888888',
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
    const pages = ["about", "tickets", "people", "lines"];
    for (let i = 0; i < numPlanes; i++) {
      angle = ((2 * Math.PI) / numPlanes) * i; // angle for each plane
      var x = radius * Math.cos(angle);
      var z = radius * Math.sin(angle);

      let text = pages[i%4].toUpperCase()

      planes.push(
        <Pane key={i} id={i%4} position={[x, 0, z]} rotation={[0, -angle, 0]} text={text} x={x} z={z} angle={angle} />
      );
    }

    return (
      <>
        {planes}
      </>
    )
  }

  const glowPosition = [0, 0, 0.2]
  
  // const glowSize = useControls({
  //   glowSizing: {value: [2, 0.85, 0.01], step: 0.01}
  // })
  // const paneSize = useControls({
  //   paneSizing: {value: [0.45, 2, 0.01], step: 0.01}
  // })

  const rotation = [0, 0, 1.57]

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


function HomePage({spring}) {
  return (
    <>
      {/* <fog attach="fog" color="#758ac1" near={1} far={10} /> */}
      <Model spring={spring}/>
    </>
  )
}
