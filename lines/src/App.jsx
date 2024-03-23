import { useState, useRef, useEffect } from 'react'
import { Canvas, useThree, useFrame } from "@react-three/fiber"
import { 
  Edges, 
  Image,
  useTexture
} from '@react-three/drei'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { map, LIMINAL } from '../../src/index.jsx'
import { animated, useSpring, useSpringValue, } from '@react-spring/three'
import Meliora_Aliturae_Left from './images/Meliora_Aliturae_Left.jpg'
import Meliora_Aliturae_Right from './images/Meliora_Aliturae_Right.jpg'
import Nandini_Left from './images/Nandini_Left.jpg'
import Nandini_Right from './images/Nandini_Right.jpg'
import Twilight_Left from './images/Twilight_Left.jpg'
import Twilight_Right from './images/Twilight_Right.jpg'

const image_urls = []
image_urls.push([Meliora_Aliturae_Left, Meliora_Aliturae_Right])
image_urls.push([Nandini_Left, Nandini_Right])
image_urls.push([Twilight_Left, Twilight_Right])
image_urls.push([Twilight_Left, Twilight_Right])
image_urls.push([Twilight_Left, Twilight_Right])
image_urls.push([Twilight_Left, Twilight_Right])
image_urls.push([Twilight_Left, Twilight_Right])
image_urls.push([Twilight_Left, Twilight_Right])
image_urls.push([Twilight_Left, Twilight_Right])
image_urls.push([Twilight_Left, Twilight_Right])
image_urls.push([Twilight_Left, Twilight_Right])
image_urls.push([Twilight_Left, Twilight_Right])
image_urls.push([Twilight_Left, Twilight_Right])
image_urls.push([Twilight_Left, Twilight_Right])
image_urls.push([Twilight_Left, Twilight_Right])
image_urls.push([Twilight_Left, Twilight_Right])
image_urls.push([Twilight_Left, Twilight_Right])
 
const nLines = 17 // number of lines
const distBetweenPairs = 20
const endPoint = nLines * (distBetweenPairs-1)

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

  useFrame(() => {
    if (forwardHovered) {
      console.log(refPaneRight.current.position.z)
      refMeshRight.current.position.z += 0.2
      refMeshLeft.current.position.z += 0.2
      refPaneLeft.current.position.z += 0.2
      refPaneRight.current.position.z += 0.2
      refMeshRight.current.material.opacity = 1 - (Math.abs(refMeshRight.current.position.z)/60)
      refMeshLeft.current.material.opacity = 1 - (Math.abs(refMeshLeft.current.position.z)/60)
      refPaneLeft.current.material.opacity = 1 - (Math.abs(refPaneLeft.current.position.z)/60)
      refPaneRight.current.material.opacity = 1 - (Math.abs(refPaneRight.current.position.z)/60)
      
    }
    else if (backwardHovered) {
      refMeshRight.current.position.z -= 0.2
      refMeshLeft.current.position.z -= 0.2
      refPaneLeft.current.position.z -= 0.2
      refPaneRight.current.position.z -= 0.2
      refMeshRight.current.material.opacity = 1 - (Math.abs(refMeshRight.current.position.z)/60)
      refMeshLeft.current.material.opacity = 1 - (Math.abs(refMeshLeft.current.position.z)/60)
      refPaneLeft.current.material.opacity = 1 - (Math.abs(refPaneLeft.current.position.z)/60)
      refPaneRight.current.material.opacity = 1 - (Math.abs(refPaneRight.current.position.z)/60)
    }
    if (refMeshRight.current.position.z > 20) {
      refMeshRight.current.material.opacity = 0
      refMeshLeft.current.material.opacity = 0
      refPaneLeft.current.material.opacity = 0
      refPaneRight.current.material.opacity = 0
      refMeshRight.current.position.z = -320
      refMeshLeft.current.position.z = -320
      refPaneLeft.current.position.z = -320
      refPaneRight.current.position.z= -320
    }
    if (refMeshRight.current.position.z < -320) {
      refMeshRight.current.position.z = 20
      refMeshLeft.current.position.z = 20
      refPaneLeft.current.position.z = 20
      refPaneRight.current.position.z= 20
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
        position={ [ -paneWidth * 1.75/2 + x, y, z ] }
        ref = {refPaneLeft}>
          <boxGeometry args = { [paneWidth, paneHeight, paneThickness] }/>
          <meshStandardMaterial
            map = {left}
            opacity = {opacity}
            transparent = {true}/>
      </mesh>
      <mesh position={ [ -paneWidth * 1.75/2 + x, y, z + 0.01 ] } ref = {refMeshLeft}>
        <boxGeometry args = {[paneWidth, paneHeight, paneThickness]}/>
        <meshStandardMaterial 
          map={left}
          opacity={opacity}
          transparent={true} 
        />
      </mesh>
      <mesh
        position={ [ x + paneWidth * 1.75/2, y, z ] }
        ref = {refPaneRight}>
          <boxGeometry args = { [paneWidth, paneHeight, paneThickness] }/>
          <meshStandardMaterial
            map = {right}
            opacity = {opacity}
            transparent = {true}/>
      </mesh>
      <mesh position={ [paneWidth * 1.75/2 + x, y, z + 0.01] } ref = {refMeshRight}>
        <boxGeometry args = {[paneWidth, paneHeight, paneThickness]}/>
        <meshStandardMaterial 
          map={right}
          opacity={opacity}
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
