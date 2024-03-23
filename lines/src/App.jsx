import { useState, useRef, useEffect } from 'react'
import { Canvas, useThree, useFrame } from "@react-three/fiber"
import { 
  Edges, 
  Image,
  useTexture,
  MeshTransmissionMaterial,
  useVideoTexture,
  useAspect
} from '@react-three/drei'
import * as THREE from 'three'
import './App.css'
import { map, LIMINAL } from '../../src/index.jsx'
import { animated, useSpring, useSpringValue, } from '@react-spring/three'
import Meliora_Aliturae_Left from '../../src/images/Meliora_Aliturae_Left.png'
import Meliora_Aliturae_Right from '../../src/images/Meliora_Aliturae_Right.png'
import Nandini_Left from '../../src/images/Nandini_Left.png'
import Nandini_Right from '../../src/images/Nandini_Right.png'
import Twilight_Left from '../../src/images/Twilight_Left.png'
import Twilight_Right from '../../src/images/Twilight_Right.png'
import Entomate_Left from '../../src/images/Entomate_Left.png'
import Entomate_Right from '../../src/images/Entomate_Right.png'
import Crimson_Left from '../../src/images/Crimson_Left.png'
import Crimson_Right from '../../src/images/Crimson_Right.png'
import Coalesce_Left from '../../src/images/Coalesce_Left.png'
import Coalesce_Right from '../../src/images/Coalesce_Right.png'
import Please_Left from '../../src/images/Please_Left.png'
import Please_Right from '../../src/images/Please_Right.png'
import Opulence_Left from '../../src/images/Opulence_Left.png'
import Opulence_Right from '../../src/images/Opulence_Right.png'
import Nurra_Left from '../../src/images/Nurra_Left.png'
import Nurra_Right from '../../src/images/Nurra_Right.png'
import Bloom_Left from '../../src/images/Bloom_Left.png'
import Bloom_Right from '../../src/images/Bloom_Right.png'
import Pro_Left from '../../src/images/Pro_Left.png'
import Pro_Right from '../../src/images/Pro_Right.png'
import Angae_Left from '../../src/images/Angae_Left.png'
import Angae_Right from '../../src/images/Angae_Right.png'
import Avidhya_Left from '../../src/images/Avidhya_Left.png'
import Avidhya_Right from '../../src/images/Avidhya_Right.png'
import Flux_Left from '../../src/images/Flux_Left.png'
import Flux_Right from '../../src/images/Flux_Right.png'
import Shrouded_Left from '../../src/images/Shrouded_Left.png'
import Shrouded_Right from '../../src/images/Shrouded_Right.png'

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

function VideoMaterial({ url }) {
  const texture = useVideoTexture(url)
  return <meshBasicMaterial map={texture} toneMapped={false} />
}

const Video = ({position, opacity, url}) => {
  const size = useAspect(180, 100)
  return (
    <mesh scale={1} position={position} opacity={opacity}>
      <planeGeometry />
      {/* <Suspense fallback={<FallbackMaterial url="10.jpg" />}> */}
        <VideoMaterial url={url} />
      {/* </Suspense> */}
    </mesh>
  )
  
}

const Pair = ({position, opacity, forwardHovered, backwardHovered, stayHovered, image}) => {
  const {viewport} = useThree()
  const paneHeight = viewport.height * 0.58
  const paneWidth = paneHeight * 0.85
  const paneThickness = 0.01;
  const pathWidth = paneWidth * 0.75
  const refPaneLeft = useRef()
  const refPaneRight = useRef()
  const refMeshLeft = useRef()
  const refMeshRight = useRef()
  const refNewLeft = useRef()
  const refNewRight = useRef()

  useFrame(() => {
    if (forwardHovered) {
      refNewRight.current.position.z += 0.2
      refMeshRight.current.position.z += 0.2
      refPaneRight.current.position.z += 0.2
      refNewRight.current.material.opacity = 1 - (Math.abs(refNewRight.current.position.z)/40)
      refMeshRight.current.material.opacity = 1 - (Math.abs(refMeshRight.current.position.z)/40)
      refPaneRight.current.material.opacity = 1 - (Math.abs(refPaneRight.current.position.z)/40)
      refNewLeft.current.position.z += 0.2
      refMeshLeft.current.position.z += 0.2
      refPaneLeft.current.position.z += 0.2
      refNewLeft.current.material.opacity = 1 - (Math.abs(refNewRight.current.position.z)/40)
      refMeshLeft.current.material.opacity = 1 - (Math.abs(refMeshRight.current.position.z)/40)
      refPaneLeft.current.material.opacity = 1 - (Math.abs(refPaneRight.current.position.z)/40)
    }
    else if (backwardHovered) {
      refNewRight.current.position.z -= 0.2
      refMeshRight.current.position.z -= 0.2
      refPaneRight.current.position.z -= 0.2
      refNewRight.current.material.opacity = 1 - (Math.abs(refNewRight.current.position.z)/40)
      refMeshRight.current.material.opacity = 1 - (Math.abs(refMeshRight.current.position.z)/40)
      refPaneRight.current.material.opacity = 1 - (Math.abs(refPaneRight.current.position.z)/40)
      refNewLeft.current.position.z -= 0.2
      refMeshLeft.current.position.z -= 0.2
      refPaneLeft.current.position.z -= 0.2
      refNewLeft.current.material.opacity = 1 - (Math.abs(refNewRight.current.position.z)/40)
      refMeshLeft.current.material.opacity = 1 - (Math.abs(refMeshRight.current.position.z)/40)
      refPaneLeft.current.material.opacity = 1 - (Math.abs(refPaneRight.current.position.z)/40)
    }
    if (refMeshLeft.current.position.z > 20) {
      refNewRight.current.material.opacity = 0
      refNewRight.current.position.z = -280
      refMeshRight.current.material.opacity = 0
      refMeshRight.current.position.z = -280
      refPaneRight.current.material.opacity = 0
      refPaneRight.current.position.z = -280
      refNewLeft.current.material.opacity = 0
      refNewLeft.current.position.z = -280
      refMeshLeft.current.material.opacity = 0
      refMeshLeft.current.position.z = -280
      refPaneLeft.current.material.opacity = 0
      refPaneLeft.current.position.z = -280
    }
    if (refMeshLeft.current.position.z < -280) {
      refNewRight.current.position.z = 20
      refMeshRight.current.position.z = 20
      refPaneRight.current.position.z= 20
      refNewLeft.current.position.z = 20
      refMeshLeft.current.position.z = 20
      refPaneLeft.current.position.z = 20
    }
    if (refMeshLeft.current.position.z < -40){
      refPaneRight.current.visible = false
      refNewRight.current.visible = false
      refMeshRight.current.visbile = false
      refMeshLeft.current.visible = false
      refPaneLeft.current.visible = false
      refNewLeft.current.visible = false
    } else {
      refPaneRight.current.visible = true
      refNewRight.current.visible = true
      refMeshRight.current.visbile = true
      refMeshLeft.current.visible = true
      refPaneLeft.current.visible = true
      refNewLeft.current.visible = true
    }
    
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
          <MeshTransmissionMaterial 
            samples={16} 
            resolution={100} 
            anisotropicBlur={5}
            thickness={0.1} 
            roughness={10} 
            toneMapped={true} 
            transparent={true}
            opacity={1 - (Math.abs(z)/40)}
            background={new THREE.Color('#b5e2ff')} 
          />
      </mesh>
      <mesh
        position={ [ -paneWidth * 1.75/2 + x, y, z + 0.01 ] }
        ref = {refPaneLeft}>
          <boxGeometry args = { [paneWidth, paneHeight, paneThickness] }/>
          <meshStandardMaterial
            map = {left}
            opacity = {1 - (Math.abs(z)/40)}
            transparent = {true}
            />
      </mesh>
      <mesh position={ [ -paneWidth * 1.75/2 + x, y, z + 0.01 ] } ref = {refMeshLeft}>
        <boxGeometry args = {[paneWidth, paneHeight, paneThickness]}/>
        <meshStandardMaterial 
          map={left}
          opacity={1 - (Math.abs(z)/40)}
          transparent={true} 
        />
      </mesh>
      <mesh
        position={ [ paneWidth * 1.75/2 + x, y, z ] }
        ref = {refNewRight}>
          <boxGeometry args = { [paneWidth, paneHeight, paneThickness] }/>
          <MeshTransmissionMaterial 
            samples={16} 
            resolution={100} 
            anisotropicBlur={5}
            thickness={0.1} 
            roughness={10} 
            toneMapped={true} 
            transparent={true}
            opacity={1 - (Math.abs(z)/40)}
            background={new THREE.Color('#b5e2ff')} 
          />
      </mesh>
      <mesh
        position={ [ x + paneWidth * 1.75/2, y, z ] }
        ref = {refPaneRight}>
          <boxGeometry args = { [paneWidth, paneHeight, paneThickness] }/>
          <meshStandardMaterial
            map = {right}
            opacity = {1 - (Math.abs(z)/40)}
            transparent = {true}/>
      </mesh>
      <mesh position={ [paneWidth * 1.75/2 + x, y, z + 0.01] } ref = {refMeshRight}>
        <boxGeometry args = {[paneWidth, paneHeight, paneThickness]}/>
        <meshStandardMaterial 
          map={right}
          opacity={1 - (Math.abs(z)/40)}
          transparent={true} 
        />
      </mesh>
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

  useFrame(() => {
    pathRef.current.rotation.x = Math.PI / 2;
  });

  return (
    <>
      <group >
        <mesh ref={pathRef} position={[0, -paneHeight/2 + 0.1, -10]} >
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

  useFrame(() => {
    pathRef.current.rotation.x = Math.PI / 2;
  });

  return (
    <mesh 
      ref={pathRef} 
      position={[0, -paneHeight/2, -27]}
      onPointerOver = {forwardHover}
      onPointerOut = {forwardUnhover}
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

  useFrame(() => {
    pathRef.current.rotation.x = Math.PI / 2;
  });

  return (
    <mesh 
      ref={pathRef} 
      position={[0, -paneHeight/2, -10]}
      onPointerOver = {stayHover}
      onPointerOut = {stayUnhover}
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

  useFrame(() => {
    pathRef.current.rotation.x = Math.PI / 2;
  });

  return (
    <mesh 
      ref={pathRef} 
      position={[0, -paneHeight/2, 3]}
      onPointerOver = {backwardHover}
      onPointerOut = {backwardUnhover}
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
 
export function LinesPage() {

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
      pairs.push(
        <AnimatedPair 
          opacity={1}
          position={[0, 0, - 1 - (i * distBetweenPairs)]} 
          forwardHovered = {isForwardHovered}
          backwardHovered = {isBackwardHovered}
          stayHovered = {isStayHovered}
          key={i}
          image = {image_urls[i]}
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
        <boxGeometry args = {[140, 40, 0]}/>
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
