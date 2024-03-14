import { useState, useRef, useEffect } from 'react'
import { Canvas, useThree, useFrame } from "@react-three/fiber"
import { 
  Edges,
} from '@react-three/drei'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { fonts, map, constrain, Cover, Pane } from '../../src/index.jsx'
import { animated, useSpring, useSpringValue, } from '@react-spring/three'
 
const nLines = 17 // number of lines
const distBetweenPairs = 20
const endPoint = nLines * (distBetweenPairs-1)

export function LinesPage() {

  const [ height, setHeight ] = useState(window.innerHeight)

  const [isForwardHovered, setIsForwardHovered] = useState(false)
  const [isBackwardHovered, setIsBackwardHovered] = useState(false)
  const [isStayHovered, setIsStayHovered] = useState(false)

  const { viewport } = useThree()

  const scroll = useSpringValue(0, {
    config: {
      mass: 1,
      friction: 1000,
      tension: 20,
      duration: 10000,
      clamp: true,
    },
  })

  function handleMove(pointerY) {
    console.log(pointerY)
    if (pointerY <= height * (3/4)) {
      scroll.start(endPoint)
    } else {
      scroll.start(0)
    }
  }

  function handleLeave() {
    // console.log('stop')
    scroll.stop()
  }

  const paneHeight = viewport.height * 0.58
  const paneWidth = paneHeight * 0.85
  const paneThickness = 0.01;

  const pathWidth = paneWidth * 0.75

  const Path = () => {

    const pathRef = useRef();

    useFrame(() => {
      pathRef.current.rotation.x = Math.PI / 2;
    });
  
    return (
      <>
        <group 
          onPointerOver={ (e) => setIsForwardHovered(true) }
          onPointerLeave={ (e) => setIsForwardHovered(false) }
        >
          <mesh ref={pathRef} position={[0, -paneHeight/2, -10]} >
              <boxGeometry args={[pathWidth, 50, 0.01]} />
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
    
    const pathRef = useRef();

    useFrame(() => {
      pathRef.current.rotation.x = Math.PI / 2;
    });

    return (
      <mesh 
        ref={pathRef} 
        position={[0, -paneHeight/2, -10]}
        onPointerOver = {forwardHover}
        onPointerOut = {forwardUnhover}
      >
          <boxGeometry args={[pathWidth, 50, 0.01]} />
          <Edges
            scale={1}
            threshold={15}
            color="black"
          />
          <meshBasicMaterial attach={"material"} color={"orange"} toneMapped={false} /> 
      </mesh>

    )
  }
  
  const PathBackward = ({backwardHover, backwardUnhover}) => {
    return (
      <mesh 
        position = {[0, -0.5, 5]} 
        rotation-x = {-1.57}
        onPointerOver = {backwardHover}
        onPointerOut = {backwardUnhover}>
        <boxGeometry args = {[1, 2, 0.05]} />
        <meshStandardMaterial color = {"hotpink"} />
      </mesh>
    )
  }
  
  const PathStay = ({stayHover, stayUnhover}) => {
    return (
      <mesh 
        position = {[0, -0.5, 3.7]} 
        rotation-x = {-1.57}
        onPointerOver = {stayHover}
        onPointerOut = {stayUnhover}>
        <boxGeometry args = {[1, 0.4, 0.05]} />
        <meshStandardMaterial color = {"red"} />
      </mesh>
    )
  }
  
  
  const Pair = ({position, forwardHovered, backwardHovered, stayHovered}) => {

    // const [style, setStyle] = useState({})
    const ref = useRef()
    
    // useFrame(() => {

    //   if (stayHovered) {
    //     ref.current.position.z += 0
    //   }
    //   else if (forwardHovered) {
    //     ref.current.position.z += 0.1
    //   }
    //   else if (backwardHovered) {
    //     ref.current.position.z -= 0.1
    //   }
    //   else {
    //     ref.current.position.z += 0.01
    //   }

    // })

    if (stayHovered) {
      scroll.stop()
    }
    else if (forwardHovered) {
      scroll.start(endPoint)
    }
    else if (backwardHovered) {
      scroll.start(0)
    }
    else {
      scroll.start(endPoint)
    }
    
    return (
      <>
        <group ref={ref}>
          <Pane 
            position={ [ position[0] - (paneWidth * 1.75/2), position[1], position[2] ] } 
            size={ [paneWidth, paneHeight, paneThickness] } 
            opacity={opacity}
            moveFunction={null} id={0}
          />

          <Pane position={
            [position[0] + (paneWidth * 1.75/2), position[1], position[2]]} 
            size={[ paneWidth, paneHeight, paneThickness]} 
            opacity={opacity}
            moveFunction={null} id={1}
          />
        </group>
      </>
    )
  }

  const AnimatedPair = animated(Pair)
  
  function makePairs() {
  
    let pairs = []
    for (let i = 0; i < nLines; i++) {
      pairs.push(
        <AnimatedPair 
          position={[ 0, 0, i * -distBetweenPairs]} 
          forwardHovered = {isForwardHovered}
          backwardHovered = {isBackwardHovered}
          stayHovered = {isStayHovered}
          key={i} 
        />
      )
    }
  
    return pairs
  }
  

  const Pairs = makePairs();

  return (
    <>
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
      <group>
        {Pairs}
      </group>
      {/* <Path /> */}
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
