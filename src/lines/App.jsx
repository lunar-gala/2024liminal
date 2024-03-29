import React, { useState, useRef, useEffect } from 'react'
import { Canvas, useThree, useFrame } from "@react-three/fiber"
import { 
  Edges, 
  useTexture,
  MeshTransmissionMaterial,
  Text3D,
  Center
} from '@react-three/drei'
import * as THREE from 'three'
import { map, LIMINAL, sendBack } from '../../src/index.jsx'
import { animated } from '@react-spring/three'


import Meliora_Aliturae_Left from '../../src/images/Meliora_Left.webp'
import Meliora_Aliturae_Right from '../../src/images/Meliora_Right.webp'
import Nandini_Left from '../../src/images/Nandini_Left.webp'
import Nandini_Right from '../../src/images/Nandini_Right.webp'
import Twilight_Left from '../../src/images/Twilight_Left.webp'
import Twilight_Right from '../../src/images/Twilight_Right.webp'
import Entomate_Left from '../../src/images/Entomate_Left.webp'
import Entomate_Right from '../../src/images/Entomate_Right.webp'
import Crimson_Left from '../../src/images/Crimson_Left.webp'
import Crimson_Right from '../../src/images/Crimson_Right.webp'
import Coalesce_Left from '../../src/images/Coalesce_Left.webp'
import Coalesce_Right from '../../src/images/Coalesce_Right.webp'
import Please_Left from '../../src/images/Please_Left.webp'
import Please_Right from '../../src/images/Please_Right.webp'
import Opulence_Left from '../../src/images/Opulence_Left.webp'
import Opulence_Right from '../../src/images/Opulence_Right.webp'
import Nurra_Left from '../../src/images/Nurra_Left.webp'
import Nurra_Right from '../../src/images/Nurra_Right.webp'
import Bloom_Left from '../../src/images/Bloom_Left.webp'
import Bloom_Right from '../../src/images/Bloom_Right.webp'
import Pro_Left from '../../src/images/Pro_Left.webp'
import Pro_Right from '../../src/images/Pro_Right.webp'
import Angae_Left from '../../src/images/Angae_Left.webp'
import Angae_Right from '../../src/images/Angae_Right.webp'
import Avidhya_Left from '../../src/images/Avidhya_Left.webp'
import Avidhya_Right from '../../src/images/Avidhya_Right.webp'
import Flux_Left from '../../src/images/Flux_Left.webp'
import Flux_Right from '../../src/images/Flux_Right.webp'
import Shrouded_Left from '../../src/images/Shrouded_Left.webp'
import Shrouded_Right from '../../src/images/Shrouded_Right.webp'

// import angae from '../../src/videos/angae.mp4'
// import avidhya from '../../src/videos/avidhya.mp4'
// import bloom from '../../src/videos/bloom.mp4'
// import coalesce from '../../src/videos/Coalesce.mp4'
// import crimson from '../../src/videos/crimson.mp4'
// import entomate from '../../src/videos/enomate.mp4'
// import flux from '../../src/videos/flux.mp4'
// import meliora from '../../src/videos/meliora.mp4'
// import nandini from '../../src/videos/nandini.mp4'
// import nurra from '../../src/videos/nurra.mp4'
// import opulence from '../../src/videos/opulence.mp4'
// import proForma from '../../src/videos/proForma.mp4'
// import shroudedSanity from '../../src/videos/shroudedSanity.mp4'
// import twilight from '../../src/videos/twilight.mp4'
// import pleaseStandin from '../../src/videos/sample.mp4'

const lines = [
  "Meliora Aliturae",
  "Twilight",
  "Nandini",
  "Entomate",
  "Crimson",
  "Coalesce 2000s",
  "Please Remember Me",
  "Opulence",
  "Nurra",
  "Bloom",
  "Pro Forma",
  "Angae",
  "Avidhya",
  "Flux",
  "Shrouded Sanity"
]

const videoPositions = [
  [-1.05, 0.35, 0.18, 0.21],
  [0.43, 0.13, 0.18, 0.21],
  [0.45, -0.38, 0.18, 0.21],
  [0.65, -0.35, 0.18, 0.21],
  [-1.05, 0.38, 0.18, 0.21],
  [0.65, 0.12, 0.18, 0.21],
  [0.95, 0.36, 0.38, 0.21], 
  [-0.43, -0.25, 0.17, 0.45], 
  [0.44, -0.36, 0.18, 0.21],
  [-0.43, -0.36, 0.18, 0.21],
  [0.64, -0.36, 0.18, 0.21],
  [0.42, 0.35, 0.18, 0.21],
  [0.91, 0.36, 0.38, 0.21], 
  [0.43, -0.35, 0.18, 0.21],
  [-0.43, -0.36, 0.18, 0.21]
]

const image_urls = []
image_urls.push([Meliora_Aliturae_Left, Meliora_Aliturae_Right])
image_urls.push([Twilight_Left, Twilight_Right])
image_urls.push([Nandini_Left, Nandini_Right])
image_urls.push([Entomate_Left, Entomate_Right])
image_urls.push([Crimson_Left, Crimson_Right])
image_urls.push([Coalesce_Left, Coalesce_Right])
image_urls.push([Please_Left, Please_Right])
image_urls.push([Opulence_Left, Opulence_Right])
image_urls.push([Nurra_Left, Nurra_Right])
image_urls.push([Bloom_Left, Bloom_Right])
image_urls.push([Pro_Left, Pro_Right])
image_urls.push([Angae_Left, Angae_Right])
image_urls.push([Avidhya_Left, Avidhya_Right])
image_urls.push([Flux_Left, Flux_Right])
image_urls.push([Shrouded_Left, Shrouded_Right])
 
const nLines = 15 // number of lines
const distBetweenPairs = 20
const endPoint = nLines * (distBetweenPairs-1)

const Pair = ({id, position, opacity, forwardHovered, backwardHovered, stayHovered, image, location}) => {
  const {viewport} = useThree()
  const paneHeight = viewport.height * 0.58
  const paneWidth = paneHeight * 0.85
  const paneThickness = 0.01;
  const pathWidth = paneWidth * 0.75
  const refPaneLeft = useRef()
  const refPaneRight = useRef()
  const refNewLeft = useRef()
  const refNewRight = useRef()
  const labelRef = useRef()

  const [isVisible, setItVisible] = useState(true);

  const speed = 0.5

  useFrame(() => {
    if (location != 'lines') return
    
    if (forwardHovered) {
      refNewRight.current.position.z += speed
      refPaneRight.current.position.z += speed
      refNewLeft.current.position.z += speed
      refPaneLeft.current.position.z += speed
      labelRef.current.position.z += speed
      refNewRight.current.material.opacity = 1 - (Math.abs(refNewRight.current.position.z)/40)
      refPaneRight.current.material.opacity = 1 - (Math.abs(refPaneRight.current.position.z)/40)
      refPaneLeft.current.material.opacity = 1 - (Math.abs(refPaneRight.current.position.z)/40)
      refNewLeft.current.material.opacity = 1 - (Math.abs(refNewRight.current.position.z)/40)
      labelRef.current.material.opacity = 1 - (Math.abs(refPaneRight.current.position.z)/40)
    }
    else if (backwardHovered) {
      refNewRight.current.position.z -= speed
      refPaneRight.current.position.z -= speed
      refNewLeft.current.position.z -= speed
      refPaneLeft.current.position.z -= speed
      labelRef.current.position.z -= speed
      refNewRight.current.material.opacity = 1 - (Math.abs(refNewRight.current.position.z)/40)
      refPaneRight.current.material.opacity = 1 - (Math.abs(refPaneRight.current.position.z)/40)
      refNewLeft.current.material.opacity = 1 - (Math.abs(refNewRight.current.position.z)/40)
      refPaneLeft.current.material.opacity = 1 - (Math.abs(refPaneRight.current.position.z)/40)
    }
    if (refPaneLeft.current.position.z > 20) {
      refNewRight.current.material.opacity = 0
      refNewRight.current.position.z = -280
      refPaneRight.current.material.opacity = 0
      refPaneRight.current.position.z = -280
      refNewLeft.current.material.opacity = 0
      refNewLeft.current.position.z = -280
      refPaneLeft.current.material.opacity = 0
      refPaneLeft.current.position.z = -280
      labelRef.current.material.opacity = 0
      labelRef.current.position.z -= 300
    }
    else if (refPaneLeft.current.position.z < -280) {
      refNewRight.current.position.z = 20
      refNewRight.current.material.opacity = 1
      refPaneRight.current.position.z= 20
      refPaneRight.current.material.opacity = 1
      refNewLeft.current.position.z = 20
      refNewLeft.current.material.opacity = 1
      refPaneLeft.current.position.z = 20
      refPaneLeft.current.material.opacity = 1
      labelRef.current.position.z += 300
      labelRef.current.material.opacity = 1
    }
    if (refPaneLeft.current.position.z < -40 || refPaneLeft.current.position.z > distBetweenPairs * 3){
      refPaneRight.current.visible = false
      refNewRight.current.visible = false
      refPaneLeft.current.visible = false
      refNewLeft.current.visible = false
      labelRef.current.visible = false

      setItVisible(false);
    } else {
      refPaneRight.current.visible = true
      refNewRight.current.visible = true
      refPaneLeft.current.visible = true
      refNewLeft.current.visible = true
      labelRef.current.visible = true

      setItVisible(true);
    }

    labelRef.current.rotation.x = Math.PI / 2;
    labelRef.current.rotation.z = Math.PI;
    labelRef.current.rotation.y = Math.PI;
    
  })

  let x = position[0]
  let y = position[1]
  let z = position[2]

  const left = useTexture(image[0])
  const right = useTexture(image[1])

  return (
    <>
      <mesh
        position={ [ -paneWidth * 1.75/2 + x, y, z-0.1 ] }
        ref = {refNewLeft}>
          <boxGeometry args = { [paneWidth, paneHeight, paneThickness] }/>
          {isVisible && <MeshTransmissionMaterial 
            samples={16} 
            resolution={10} 
            anisotropicBlur={5}
            thickness={0.1} 
            roughness={10} 
            toneMapped={true} 
            transparent={true}
            opacity={1 - (Math.abs(z)/40)}
            background={new THREE.Color('#b5e2ff')} 
          /> }
      </mesh>
      <mesh
        position={ [ -paneWidth * 1.75/2 + x, y, z + 0.01 ] }
        ref = {refPaneLeft}>
          <boxGeometry args = { [paneWidth, paneHeight, paneThickness] }/>
          {isVisible && <meshStandardMaterial
            map = {left}
            opacity = {1 - (Math.abs(z)/40)}
            transparent = {true}
            toneMapped={false}
            /> }
      </mesh>
      <mesh
        position={ [ paneWidth * 1.75/2 + x, y, z ] }
        ref = {refNewRight}>
          <boxGeometry args = { [paneWidth, paneHeight, paneThickness] }/>
          {isVisible && <MeshTransmissionMaterial 
            samples={16} 
            resolution={100} 
            anisotropicBlur={5}
            thickness={0.1} 
            roughness={10} 
            toneMapped={true} 
            transparent={true}
            opacity={1 - (Math.abs(z)/40)}
            background={new THREE.Color('#b5e2ff')} 
          /> }
      </mesh>
      <mesh
        position={ [ x + paneWidth * 1.75/2, y, z ] }
        ref = {refPaneRight}>
          <boxGeometry args = { [paneWidth, paneHeight, paneThickness] }/>
          {isVisible && <meshStandardMaterial
            map = {right}
            opacity = {1 - (Math.abs(z)/40)}
            transparent = {true}
            toneMapped={false}
          /> }
      </mesh>
      <Center middle center position={[0, -viewport.height/4, z]}>
        <Text3D height={0.01} size={id != 6 ? 0.7 : 0.5} font="./fonts/Kommuna/Kommuna_Cond_Regular.json" ref={labelRef} >
          {lines[id]}
          <meshStandardMaterial color="black" transparent opacity={1 - (Math.abs(z)/40)} toneMapped={false} />
        </Text3D>
      </Center>
      {/* <Video ref={vidRef} position={[position[0], position[1], position[2]]} url={vid} opacity={1 - (Math.abs(z)/40)} /> */}
    </>
  )
}


const Path = () => {
  const {viewport} = useThree()
  const paneHeight = viewport.height * 0.58
  const paneWidth = paneHeight * 0.85
  const paneThickness = 0.01;
  const pathWidth = paneWidth * 0.75
  const pathRef = useRef();

  return (
    <>
      <group >
        <mesh ref={pathRef} position={[0, -paneHeight/2 + 0.1, -10]} rotation-x={Math.PI / 2}>
            <boxGeometry args={[pathWidth, 60, 0.01]} />
            <Edges
              scale={1}
              threshold={15}
              color="black"
            />
            <meshBasicMaterial attach="material" color="white" toneMapped={false} /> 
        </mesh>
      </group>
    </>
  )
}

const PathForward = ({forwardHover, forwardUnhover}) => {
  const {viewport} = useThree()
  const paneHeight = viewport.height * 0.58
  const paneWidth = paneHeight * 0.85
  const paneThickness = 0.01;
  const pathWidth = paneWidth * 0.75
  const pathRef = useRef();


  return (
    <mesh 
      ref={pathRef} 
      position={[0, -paneHeight/2, -27]}
      onPointerOver = {forwardHover}
      onPointerOut = {forwardUnhover}
      rotation-x={Math.PI / 2}
      visible={false}
    >
        <boxGeometry args={[pathWidth, 27, 0.01]} />
        <Edges
          scale={1}
          threshold={15}
          color="black"
        />
        <meshBasicMaterial attach={"material"} color={"orange"} toneMapped={false} /> 
    </mesh>

  )
}

const PathStay = ({stayHover, stayUnhover}) => {
  const {viewport} = useThree()
  const paneHeight = viewport.height * 0.58
  const paneWidth = paneHeight * 0.85
  const paneThickness = 0.01;
  const pathWidth = paneWidth * 0.75
  const pathRef = useRef();

  return (
    <mesh 
      ref={pathRef} 
      position={[0, -paneHeight/2, -10]}
      onPointerOver = {stayHover}
      onPointerOut = {stayUnhover}
      rotation-x={Math.PI / 2}
      visible={false}
    >
        <boxGeometry args={[pathWidth, 5, 0.01]} />
        <Edges
          scale={1}
          threshold={15}
          color="black"
        />
        <meshBasicMaterial attach={"material"} color={"hotpink"} toneMapped={false} /> 
    </mesh>
  )
}

const PathBackward = ({backwardHover, backwardUnhover}) => {
  const {viewport} = useThree()
  const paneHeight = viewport.height * 0.58
  const paneWidth = paneHeight * 0.85
  const paneThickness = 0.01;
  const pathWidth = paneWidth * 0.75
  const pathRef = useRef();

  return (
    <mesh 
      ref={pathRef} 
      position={[0, -paneHeight/2, 3]}
      onPointerOver = {backwardHover}
      onPointerOut = {backwardUnhover}
      rotation-x={Math.PI / 2}
      visible={false}
    >
        <boxGeometry args={[pathWidth, 20, 0.01]} />
        <Edges
          scale={1}
          threshold={15}
          color="black"
        />
        <meshBasicMaterial attach={"material"} color={"blue"} toneMapped={false} /> 
    </mesh>
  )
}
 
export function LinesPage({location}) {

  useEffect(() => {
    window.addEventListener('pointerup', (e) => sendBack(e));
    return () => {
      window.removeEventListener('pointerup', (e) => sendBack(e));
    };
  }, []);

  const [isForwardHovered, setIsForwardHovered] = useState(false)
  const [isBackwardHovered, setIsBackwardHovered] = useState(false)
  const [isStayHovered, setIsStayHovered] = useState(false)
  const { viewport } = useThree()
  const paneHeight = viewport.height * 0.58
  const paneWidth = paneHeight * 0.85
  const paneThickness = 0.01;
  const pathWidth = paneWidth * 0.75

  const AnimatedPair = animated(Pair)
  
  function makePairs() {
  
    let pairs = []
    for (let i = 0; i < nLines; i++) {
      // console.log(- (i * distBetweenPairs) - 0.1)
      pairs.push(
        <AnimatedPair 
          opacity={1}
          position={[0, 0, - (i * distBetweenPairs) - 0.1]} 
          forwardHovered = {isForwardHovered}
          backwardHovered = {isBackwardHovered}
          stayHovered = {isStayHovered}
          key={i}
          id={i}
          image = {image_urls[i]}
          location={location}
        />
      )
    }

    // opacity={scroll.to((value) => map(Math.abs(value - i * distBetweenPairs), 0, 3*distBetweenPairs, 1, 0))}
    // position={scroll.to((value) => [ 0, 0, i * -distBetweenPairs + value ] )}
  
    return pairs
  }
  
  const Pairs = makePairs();

  return (
    <>
      <LIMINAL viewport={viewport} />
      <mesh
        position = {[0, -27, -60]}>
        <boxGeometry args = {[viewport.width * 10, 40, 0]}/>
        <Edges
          color = {"black"}
          scale = {1}/>
        <meshStandardMaterial opacity = {0} transparent = {true}/>
      </mesh>
      <group>
        {Pairs}
      </group>
      <PathForward
        forwardHover={() => setIsForwardHovered(true)} 
        forwardUnhover={() => setIsForwardHovered(false)}
      />
      <PathBackward
        backwardHover={() => setIsBackwardHovered(true)} 
        backwardUnhover={() => setIsBackwardHovered(false)}
      />
      <PathStay
        stayHover={() => setIsStayHovered(true)}
        stayUnhover={() => setIsStayHovered(false)}
      />
      <Path />
    </>
  )
}

/**
 * DO NOT MODIFY APP
 */
function App() {

  return (
    <>
      <Canvas>
        <LinesPage />
      </Canvas>
    </>
  )
}

export default App
