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
import { map, Pane, LIMINAL } from '../../src/index.jsx'
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

function goForward(spring) {
  spring.start(endPoint)
}

function goBackward(spring) {
  spring.start(0)
}

function stay(spring) {
  spring.stop()
}
 
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
  
  
  const Pair = ({position, opacity, forwardHovered, backwardHovered, stayHovered, image}) => {

    // const [style, setStyle] = useState({})
    const ref = useRef()

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
      scroll.stop()
    }

    const left = useTexture(image[0])
    const right = useTexture(image[1])

    return (
      <>
        <group position={position}>
          <Pane 
            position={ [ -paneWidth * 1.75/2, 0, 0 ] } 
            size={ [paneWidth, paneHeight, paneThickness] } 
            opacity={opacity}
            moveFunction={null} id={0}
          />
          <mesh position={ [ -paneWidth * 1.75/2, 0, 0.01 ] }>
            <boxGeometry args = {[paneWidth, paneHeight, paneThickness]}/>
            <meshStandardMaterial 
              map={left}
              opacity={opacity}
              transparent={true} 
            />
          </mesh>

          <Pane position={
            [paneWidth * 1.75/2, 0, 0]} 
            size={[ paneWidth, paneHeight, paneThickness]} 
            opacity={opacity}
            moveFunction={null} id={1}
          />
          <mesh position={ [paneWidth * 1.75/2, 0, 0.01] }>
            <boxGeometry args = {[paneWidth, paneHeight, paneThickness]}/>
            <meshStandardMaterial 
              map={right}
              opacity={opacity}
              transparent={true} 
            />
          </mesh>
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
          opacity={scroll.to((value) => map(Math.abs(value - i * distBetweenPairs), 0, 3*distBetweenPairs, 1, 0))}
          position={scroll.to((value) => [ 0, 0, i * -distBetweenPairs + value ] )} 
          forwardHovered = {isForwardHovered}
          backwardHovered = {isBackwardHovered}
          stayHovered = {isStayHovered}
          key={i}
          image = {image_urls[i]}
        />
      )
    }
  
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
