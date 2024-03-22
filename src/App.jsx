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
import { useTransition } from "@react-spring/core"
import { a } from "@react-spring/three"

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
        <Canvas camera={{ position: [0, 0, 1.5], fov: 90 }} gl={{ localClippingEnabled: true }} >
          <color attach="background" args={(location == '/') ? [0, 0, 0] : [255, 255, 255]} /> 
          <ambientLight intensity={0.5}/>
          {/* <directionalLight position={[0, 0, 5]} intensity={0.5} /> */}
          <Suspense fallback={null}>
            <Pages transition={transition} isMobile={isMobile} />
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
const AuthPages = {
  "about": true,
  "tix": true,
  "people": true,
  "lines": true,
};

function Pages({ transition, isMobile }) {

  return transition(({ opacity, ...props }, location) => (
    <a.group {...props}>
      <Switch location={location}>
        <Route path="/">
          <HomePage />
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
      <Sensor />
    </a.group>
  ))
}

// mesh element that covers the screen and calls sendBack() 
// when the mouse is lifted
function Sensor() {
  return (
    <mesh 
      position = {[0, 0, 0]} 
      onPointerUp = { (e) => sendBack() } 
      onClick = { (e) => sendBack() }
    >
      <boxGeometry args={[100, 100, 0.1]}/>
      <meshPhongMaterial color={"pink"} opacity={0} transparent />
    </mesh>
  )
}

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
// NEED TO IMLPEMENT
function PrivateRoute({ children, page, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        AuthPages.page ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

/**
 * SUB-PAGES
 * should go in seperate files
 */

function Model() {
  const groupRef = useRef();
  const { viewport } = useThree();
  
  const paneWidth = viewport.width * 0.5
  const paneHeight = 0.3 * paneWidth
  const textSize = 0.1
  const textRadScale = 1.35
  const textY = 0.47 * paneWidth

  // refs for SelectiveBloom
  const text3DRef = useRef();
  const modelRef = useRef();

  useFrame(({ delta, pointer, clock }) => {
    groupRef.current.rotation.x = clock.getElapsedTime() / 8;
  });


  function Pane({position, rotation, text, config, x, z, angle, id}) {
    
    return(
      <>
        <mesh 
          ref={modelRef}
          position={position} 
          rotation={rotation}
          onClick = { (e) => sendBack() }
          onPointerDown = { (e) => redirect(id) } 
        >
          <RoundedBox args={[0.45, 1.5, 0.01]} radius={0.005} smoothness={2}>
            {/* <meshLambertMaterial {...lambertConfig}/> */}
            <MeshTransmissionMaterial
              background={new THREE.Color("#ffffff")}
              meshPhysicalMaterial={false}
              transmissionSampler={false}
              backside={false}
              samples={ 16 }
              resolution={ 1024 }
              transmissio={ .94 }
              roughness={ 0.24 }
              thickness={ .4}
              ior={1.28}
              chromaticAberration={.16}
              anisotropy={.25}
              anisotropicBlur={.89}
              distortion={.23}
              distortionScale={.14}
              temporalDistortion={.19}
              clearcoat={1.0}
              attenuationDistance={4.53}
              attenuationColor={"#ffffff"}
              color={"#92969d"}
              bg={"#ffffff"}
            />
          </RoundedBox>
        </mesh>
        
        <Text3D
          ref={text3DRef}
          font="./fonts/Wordmark/NewEdge-666-Regular.json"
          size={textSize}
          height={0.01}
          position={[-x*textRadScale, 0.7, -z*textRadScale]}
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

  // // Lower 'samples' and 'resolution' for better performance (less lag)
  // const config = useControls({
  //   meshPhysicalMaterial: false,
  //   transmissionSampler: false,
  //   backside: false,
  //   samples: { value: 16, min: 1, max: 32, step: 1 },
  //   resolution: { value: 1024, min: 256, max: 2048, step: 256 },
  //   transmission: { value: .94, min: 0, max: 1 },
  //   roughness: { value: 0.24, min: 0, max: 1, step: 0.01 },
  //   thickness: { value: .4, min: 0, max: 10, step: 0.01 },
  //   ior: { value: 1.28, min: 1, max: 5, step: 0.01 },
  //   chromaticAberration: { value: 0.16, min: 0, max: 1 },
  //   anisotropy: { value: 0.25, min: 0, max: 1, step: 0.01 },
  //   anisotropicBlur: { value: 0.89, min: 0, max: 1, step: 0.01 },
  //   distortion: { value: 0.23, min: 0, max: 1, step: 0.01 },
  //   distortionScale: { value: 0.14, min: 0.01, max: 1, step: 0.01 },
  //   temporalDistortion: { value: 0.19, min: 0, max: 1, step: 0.01 },
  //   clearcoat: { value: 1.0, min: 0, max: 1 },
  //   attenuationDistance: { value: 4.53, min: 0, max: 10, step: 0.01 },
  //   attenuationColor: "#ffffff",
  //   color: "#92969d",
  //   bg: "#ffffff",
  // })

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
    emissive: '888888',
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
    const radius = .5; // radius of the circle
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
        <Pane key={i} id={i%4} position={[x, 0, z]} rotation={[0, -angle, 0]} text={text} /*config={config}*/ x={x} z={z} angle={angle} />
      );
    }

    return (
      <>
        {planes}
      </>
    )
  }

  const glowPosition = [0, 0, 0.2];
  
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
        <boxGeometry args={[1.52, 0.40, 0.01]} />
        <meshStandardMaterial
          emissive="white"
          color={"white"}
          toneMapped={false}
        />
      </mesh>
    </>
  );
}

function HomePage(viewport) {
  return (
    <>
      {/* <fog attach="fog" color="#758ac1" near={1} far={10} /> */}
      <Model />
      {/* Bloom documentation : https://docs.pmnd.rs/react-postprocessing/effects/bloom */}
      <EffectComposer>
        <Bloom luminanceThreshold={0} luminanceSmoothing={0.1} height={300} />
      </EffectComposer>
    </>
  )
}
