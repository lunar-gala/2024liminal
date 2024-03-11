import { useState, useRef } from 'react'
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
  const { viewport } = useThree()

  const scroll = useSpringValue(0, {
    config: {
      mass: 1,
      friction: 1000,
      tension: 20,
      duration: 10000,
      clam: true,
      
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

  const Path = () => {

    const pathRef = useRef();
  
    const pathWidth = paneWidth * 0.75

    useFrame(() => {
      pathRef.current.rotation.x = Math.PI / 2;
    });
  
    return (
      <>
        <group 
          onPointerOver={ (e) => handleMove(e.y) }
          onPointerLeave={ (e) => handleLeave() }
        >
          <mesh ref={pathRef} position={[0, -paneHeight/2, 0]} >
              <boxGeometry args={[pathWidth, 100, 0.01]} />
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
  
  const Pair = ({position, opacity}) => {
    
    return (
      <>
        <group>
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
      pairs.push(<AnimatedPair position={[ 0, 0, i * -distBetweenPairs]} opacity={scroll.to((value) => map(Math.abs(value - (i * distBetweenPairs)), 0, 3 * distBetweenPairs, 1, 0))} key={i} />)
    }
  
    return pairs
  }
  

  const Pairs = makePairs();

  return (
    <>
      <animated.group position-z={scroll}>
        {Pairs}
      </animated.group>
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
