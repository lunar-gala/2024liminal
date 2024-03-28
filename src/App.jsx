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
  Text3D,
  useVideoTexture,
  useGLTF
} from '@react-three/drei'
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber"
import * as THREE from "three";

// nav
import { useLocation, Route, Switch } from "wouter"
import { useTransition, useSpringValue } from "@react-spring/core"
import { a, animated } from "@react-spring/three"

// pages
import { AboutPage } from "./about/App"
import { TixPage } from "./tickets/App"
import { PeoplePage } from "./people/App"
import { LinesPage } from "./lines/App"

// assets
import promoVid from "/src/assets/fuckit.mp4"
import {preloadFont} from "troika-three-text"

preloadFont(
  {
      font: fonts.Kommuna, 
      characters: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ[]"
  }, () => {
    console.log("preloaded Kommuna")
  }
)

preloadFont(
  {
      font: fonts.RobotoMono, 
      characters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ│├─-,"
  }, () => {
    console.log("preloaded Roboto Mono")
  }
)

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
    config: () => (n) => n === "opacity" && { friction: 1000, duration: 10000 },
  }

  const go_out = {
    from: { position: [0, 0, 10], rotation: [0, 0, 0], scale: [0, 0, 0], opacity: 0 },
    enter: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1], opacity: 1 },
    leave: { position: [0, 0, -100], rotation: [0, 0, 0], scale: [0, 0, 0], opacity: 0 },
    config: () => (n) => n === "opacity" && { friction: 100000, duration: 100000 },
  }

  const landing_settings = {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  }

  let transition_settings = (location == '/home') ? go_out : go_in;

  if (location == '/') {
    transition_settings = landing_settings
  } 
  
  // Animated shape props
  const transition = useTransition(location, transition_settings)

  return (
    <>
      <Cover>
        <Canvas camera={{ position: [0, 0, 20], fov: 50 }} performance={{ min: 0.1 }} >
          <color attach="background" args={['white']} />
          {/* <AnimatedColor args={opacitySpring.to((value) => [value, value, value])}/> */}
          <ambientLight intensity={1}/>
          {/* <directionalLight position={[0, 0, 5]} intensity={0.5} /> */}
          <Suspense fallback={null}>
            <Pages transition={transition} isMobile={isMobile} spring={opacitySpring} />
            <Lens location={location} size={1} />
          </Suspense>
        </Canvas>
      </Cover>
      <Loader />
    </>
  )

}
export default App


/**
 * NAV
 */

let currPage = 'landing'
function Pages({ transition, isMobile, spring }) {

  return transition(({ opacity, ...props }, location) => (
    <a.group {...props}>
      <Switch location={location}>
        <Route path="/">
          <LandingPage location={location} />
        </Route>
        <Route path="/home">
          {<HomePage location={location} />}
        </Route>
        <Route path="/about">
          <AboutPage location={location} />
        </Route>
        <Route path="/tickets">
          <TixPage location={location} />
        </Route>
        <Route path="/people">
          <PeoplePage location={location} />
        </Route>
        <Route path="/lines">
          <LinesPage location={location} />
        </Route>
      </Switch>
      {/* <Sensor /> */}
    </a.group>
  ))
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

  function Pane({position, rotation, text, config, x, z, angle, id}) {
    const ref = useRef()

    // useFrame((_, delta) => {
    //   ref.current.rotation.y += 0.5 * delta // (angle + clock.getElapsedTime() / 8) % (2*Math.PI);
    // });

    useFrame(({ clock }) => {
      groupRef.current.rotation.x = -clock.getElapsedTime() / 8;
    });

    const radius = paneWidth / 3; // radius of the circle
    
    return(
      <group ref={ref}>
        <mesh 
          position={[radius * Math.sin(angle), 0, radius * Math.cos(angle)]} 
          rotation={rotation}
          onClick = { (e) => sendBack(e, spring) }
          onPointerDown = { (e) => redirect(e, id, spring) }
          // visible = { rotation[1] > 180 ? true : false}
        >
          <RoundedBox args={[paneHeight, paneWidth, 0.1]} radius={0.05} smoothness={2}>
            {/* <meshLambertMaterial {...lambertConfig}/> */}
            <MeshTransmissionMaterial
              visible={true}
              background={new THREE.Color("#ffffff")}
              meshPhysicalMaterial={false}
              transmissionSampler={false}
              backside={false}
              samples={4}
              resolution={5}
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
    color: '#5f5f5f',
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
    const pages = ["about", "tickets", "people", "lines"];
    for (let i = 0; i < numPlanes; i++) {
      angle = (2 * Math.PI / numPlanes) * i; // angle for each plane
      var x = radius * Math.cos(angle);
      var z = radius * Math.sin(angle);

      let text = pages[i%4]
      // console.log(angle)

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

// cursor
function Lens({ size, location, damping = 0.15, ...props }) {

  const { viewport } = useThree();

  const ref = useRef()
  const { nodes } = useGLTF("./LG-tickets-cursor.glb")
  
  useFrame(({ pointer }) => {
    const x = (pointer.x * viewport.width) / 2
    const y = (pointer.y * viewport.height) / 2
    ref.current.position.set(x, y, 0)
  })

  const homeConfig = {
    visible:true,
    background:new THREE.Color("#ffffff"),
    meshPhysicalMaterial:false,
    transmissionSampler:false,
    backside:false,
    samples:4,
    resolution:5,
    transmission:0.94,
    roughness:0.24,
    thickness:1.62,
    ior:1.65,
    chromaticAberration:0.25,
    anisotropy:0.2,
    anisotropicBlur:1.0,
    distortion:0.06,
    distortionScale:0.2,
    temporalDistortion:0.1,
    clearcoat:1.0,
    attenuationDistance:2.61,
    attenuationColor:"#ffffff",
    color: '#b9bfc9', // "#92969d",
    bg:"#ffffff",
    depthTest:false
  }

  const subConfig = {
    samples:8,
    resolution:10,
    anisotropicBlur:.1,
    thickness:0.1,
    roughness:0.4,
    toneMapped:true,
    // background: new THREE.Color('#b5e2ff'),
    color: '#b5e2ff',
    depthTest:false,
    transparent: true,
    opacity: 0.8
  }

  const config = location == '/home' ? homeConfig : subConfig
  size = location == '/people'? 0.5 * size : size

  return (
    <>
      <mesh scale={size} ref={ref} rotation-x={Math.PI/2} geometry={nodes.Cube.geometry} visible={location == '/tickets' || location == '/' ? false : true} {...props}>
        {/* {config.meshPhysicalMaterial ? <meshPhysicalMaterial {...config} /> : <MeshTransmissionMaterial background={new THREE.Color(config.bg)} {...config} />} */}
        {/* <MeshTransmissionMaterial background={new THREE.Color(config.bg)} {...config} /> */}
        <MeshTransmissionMaterial {...config} depthTest={false} />
      </mesh>
    </>
  )
}


function HomePage({spring}) {
  const { viewport } = useThree();

  function Mask() {
    return (
      <group>
        <mesh position={[0, viewport.height/2 + viewport.width/16, 0.2]}>
          <boxGeometry args={[4 * viewport.width, viewport.height, 0.1]} />
          <meshBasicMaterial color={"black"} toneMapped={false}/>
        </mesh>
        <mesh position={[0, -viewport.height/2 - viewport.width/16, 0.2]}>
          <boxGeometry args={[4 * viewport.width, viewport.height, 0.1]} />
          <meshBasicMaterial color={"black"} toneMapped={false}/>
        </mesh>
        <mesh position={[-viewport.width, 0, 0.2]}>
          <boxGeometry args={[1.5 * viewport.width, viewport.height, 0.1]} />
          <meshBasicMaterial color={"black"} toneMapped={false}/>
        </mesh>
        <mesh position={[viewport.width, 0, 0.2]}>
          <boxGeometry args={[1.5 * viewport.width, viewport.height, 0.1]} />
          <meshBasicMaterial color={"black"} toneMapped={false}/>
        </mesh>
      </group>
    )
  }

  return (
    <>
      <Mask />
      <Model spring={spring} viewport={viewport} />
    </>
  )
}

let send = true

function LandingPage() {

  const ref = useRef()
  const { viewport } = useThree();

  function sendFromLanding() {
    if (send) {
      sendBack(0)
      send = false;
    }
  }

  setTimeout(sendFromLanding, 23000);

  return (
    <>
      <mesh scale={1} position={[0, 0, 1]} transparent opacity={1}>
        <planeGeometry args={[viewport.width, viewport.height]}/>
          {/* <Suspense fallback={<FallbackMaterial url="10.jpg" />}> */}
            <meshBasicMaterial map={useVideoTexture(promoVid, {loop: false})} toneMapped={false} />
          {/* </Suspense> */}
      </mesh>
    </>
  )
}