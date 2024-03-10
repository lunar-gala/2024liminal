import { useState, useRef } from 'react'
import { Canvas, useFrame } from "@react-three/fiber"
import './App.css'

const numLines = 17

const Panel = ({position, rotation, color, forwardHovered, backwardHovered,
                stayHovered, id, left}) => {
  const ref = useRef()

  useFrame(() => {
    if (stayHovered) {
      ref.current.position.z += 0
    }
    else if (forwardHovered) {
      ref.current.position.z += 0.1
    }
    else if (backwardHovered) {
      ref.current.position.z -= 0.1
    }
    else {
      ref.current.position.z += 0.01
    }
    if (ref.current.position.z > 5) {
      ref.current.position.z = -81
    }
    if (ref.current.position.z < -81) {
      ref.current.position.z = 5
    }
  })

  return (
    <mesh position={position} rotation-y={rotation} ref = {ref}>
      <boxGeometry args={[3, 2, 0.05]}/>
      <meshStandardMaterial color={color} transparent = {true} opacity = {0.8}/>
    </mesh>
  )
}

const PathForward = ({forwardHover, forwardUnhover}) => {
  return (
    <mesh 
      position = {[0, -0.5, -1]} 
      rotation-x = {-1.57}
      onPointerOver = {forwardHover}
      onPointerOut = {forwardUnhover}>
      <boxGeometry args = {[1, 8, 0.05]} />
      <meshStandardMaterial color = {"orange"} />
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

const LinesPage = () => {
  const [isForwardHovered, setIsForwardHovered] = useState(false)
  const [isBackwardHovered, setIsBackwardHovered] = useState(false)
  const [isStayHovered, setIsStayHovered] = useState(false)

  const panels = []
  for (let i = 0; i < numLines; i++){
    panels.push(<Panel position = {[-2.5, 0, -(1 + (i * 5))]}
                color = {"blue"}
                rotation = {0.3}
                forwardHovered = {isForwardHovered}
                backwardHovered = {isBackwardHovered}
                stayHovered = {isStayHovered}
                id = {i}
                left = {true}/>)
    panels.push(<Panel position = {[2.5, 0, -(1 + (i * 5))]}
                color = {"yellow"}
                rotation = {-0.3}
                forwardHovered = {isForwardHovered}
                backwardHovered = {isBackwardHovered}
                stayHovered = {isStayHovered}
                id = {i}
                left = {false}/>)
  }

  return (
    <>
      <ambientLight intensity={1}/>
      <directionalLight position={[0, 0, 5]} intensity={0.5}/>
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
        {panels}
      </group>
    </>
  )
}

/**
 * DO NOT MODIFY APP
 */
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Canvas>
        <LinesPage />
      </Canvas>
    </>
  )
}

export default App
