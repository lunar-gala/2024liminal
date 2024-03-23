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
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber"
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
          <color attach="background" args={['white']} />
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
      onPointerUp = { (e) => sendBack(e, spring) } 
      onClick = { (e) => sendBack(e, spring) }
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

function Model({spring, viewport}) {
  const groupRef = useRef();
  
  const paneWidth = viewport.width * 0.5
  const paneHeight = 0.3 * paneWidth
  const textSize = 0.18 * paneHeight
  const textRadScale = 1.4
  const textY = 0.47 * paneWidth

  // useFrame(({ delta, pointer, clock }) => {
  //   groupRef.current.rotation.x = clock.getElapsedTime() / 8;
  // });
  let print = true;

  function Pane({position, rotation, text, config, x, z, angle, id}) {
    const ref = useRef()

    useFrame(({ clock }) => {
      ref.current.rotation.y = (angle + clock.getElapsedTime() / 8) % (2*Math.PI);

      if (id == 1) {
        console.log(ref.current.rotation.y)
      }

      // if (ref.current.rotation.y + angle > Math.PI/4) {
      //   ref.current.visible = false
        
      // } else {
      //   ref.current.visible = true
      // }
      
    });

    const radius = paneWidth / 3; // radius of the circle
    
    return(
      <group ref={ref}>
        <mesh 
          position={[radius * Math.sin(angle), 0, radius * Math.cos(angle)]} 
          rotation={rotation}
          onClick = { (e) => sendBack(e, spring) }
          onPointerDown = { (e) => redirect(e, id, spring) } 
        >
          <RoundedBox args={[paneHeight, paneWidth, 0.1]} radius={0.05} smoothness={2}>
            {/* <meshLambertMaterial {...lambertConfig}/> */}
            <MeshTransmissionMaterial
              visible={true}
              background={new THREE.Color("#ffffff")}
              meshPhysicalMaterial={false}
              transmissionSampler={false}
              backside={false}
              samples={16}
              resolution={50}
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
        <mesh 
          position={[radius * Math.sin(angle), 0, radius * Math.cos(angle)]} 
          rotation={rotation}
          visible={false} 
        >
          <boxGeometry args={[paneHeight, paneWidth, 0.1]} radius={0.05} smoothness={2}>
            {/* <meshLambertMaterial {...lambertConfig}/> */}
            <meshBasicMaterial/>
          </boxGeometry>
        </mesh>
        <Text3D
          font="./fonts/Wordmark/NewEdge-666-Regular.json"
          size={textSize}
          height={0.07}
          position={[radius * Math.sin(angle)*textRadScale, textY, radius * Math.cos(angle)*textRadScale]}
          rotation={[0, angle + Math.PI / 2, -Math.PI / 2]}>
          {text.toUpperCase()}
          <meshBasicMaterial color="white" />
        </Text3D>
      </group>
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
      angle = (Math.PI / numPlanes) * i; // angle for each plane
      var x = radius * Math.cos(angle);
      var z = radius * Math.sin(angle);

      let text = pages[i%4]
      console.log(angle)

      planes.push(
        <Pane key={i} id={(i)%4} position={[0, 0, 0]} rotation={[0, angle + Math.PI/2, 0]} text={text} x={x} z={z} angle={angle} />
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
      {/* glowing panel (moved to mask) */}
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
  const { viewport } = useThree();

  function Mask() {
    return (
      <group>
        <mesh position={[0, viewport.height/2 + viewport.width/16, 0.2]}>
          <boxGeometry args={[viewport.width, viewport.height, 0.1]} />
          <meshBasicMaterial color={"black"} toneMapped={false}/>
        </mesh>
        <mesh position={[0, -viewport.height/2 - viewport.width/16, 0.2]}>
          <boxGeometry args={[viewport.width, viewport.height, 0.1]} />
          <meshBasicMaterial color={"black"} toneMapped={false}/>
        </mesh>
        <mesh position={[-0.5 * viewport.width, 0, 0.2]}>
          <boxGeometry args={[0.5 * viewport.width, viewport.height, 0.1]} />
          <meshBasicMaterial color={"black"} toneMapped={false}/>
        </mesh>
        <mesh position={[0.5 * viewport.width, 0, 0.2]}>
          <boxGeometry args={[0.5 * viewport.width, viewport.height, 0.1]} />
          <meshBasicMaterial color={"black"} toneMapped={false}/>
        </mesh>
      </group>
    )
  }

  return (
    <>
      {/* <fog attach="fog" color="#758ac1" near={1} far={10} /> */}
      <Mask />
      <Model spring={spring} viewport={viewport}/>
    </>
  )
}
