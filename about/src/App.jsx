import './App.css'
import { useState, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { createNoise2D } from 'simplex-noise';
import { Color, Vector3 } from 'three'
import { Stats, Text } from '@react-three/drei'

const noise = createNoise2D();

function map(val, ilo, ihi, olo, ohi) { return olo + ((val - ilo) / (ihi - ilo)) * (ohi - olo) }

function constrain(val, lo, hi) { 
  if (lo < val && val < hi) return val
  if (val <= lo) return lo
  if (val >= hi) return hi
}

const d = 5;
let maxV = 14000;

const Pane = ({ position, size, force, id }) => {

  const state = useThree()

  const ref = useRef()

  useFrame(({ delta, pointer }) => {

    const x = (pointer.x * state.viewport.width) / 2
    const y = (pointer.y * state.viewport.height) / 2

    // console.log(x)

    let dist = x - position[0]
    if (dist > 3) dist = 3
    if (dist < -3) dist = -3

    let inv_dist = (dist > 0) ? 3-dist : -(3+dist)
    if (id == 1) console.log(inv_dist)
    dist = constrain(dist, 0.01, 1) // avoid divide by zero errors
    // speed = constrain(speed, 0.01, 0.1)


    // let mouseOffset = dist * 

    let theta_z =( (noise(state.clock.elapsedTime / 2 - position[0] / 10, 1) + 0.5) / 10)
    let theta_x = noise(state.clock.elapsedTime / 2 - position[0] / 10 + 1000, 1) / 20
    // console.log(theta)
    ref.current.rotation.z = theta_z
    ref.current.rotation.x = theta_x
    ref.current.position.x = position[0] + 2*d*Math.sin(theta_z/2)*Math.cos(theta_z/2)
    ref.current.position.y = 2*d*Math.sin(theta_z/2)*Math.sin(theta_z/2) + 2*d*Math.sin(theta_x/2)*Math.sin(theta_x/2)
    ref.current.position.z = 2*d*Math.sin(-theta_x/2)*Math.cos(-theta_x/2)
  })


  return (
    < mesh position = {position} ref = {ref}
    >
      
      <boxGeometry args={size}/>
      <meshStandardMaterial color={"lightblue"} />
    </mesh>
  )
}

const App = () => {
  const [count, setCount] = useState(0)

  const panes = []
  for (let i=0; i<8; i++){
    let position = [map(i, 0, 7, -6, 6), 0, 0]
    let size = [1, 6, 0.05]
    let force = null // noise(state.clock.elapsedTime + position[0], 1)
    
    panes.push(<Pane position={position} size={size} force={force} key={i} id = {i}/>)
  }

  const about_text_1 = "it is not what is on each side of the doorway, but rather the space in between. What exists in the undefined area where one is not this nor that. "
  const about_text_2 = "you are in the space between spaces. Only here, can this exist."
  const about_text_3 = "welcome to liminal"

  return (
    <>
      <Canvas>
        <ambientLight intensity={0.5}/>
        <directionalLight position={[0, 0, 5]} intensity={0.5} />

        <group position={[0, 0, -0.15]}>
          {panes}
        </group>

        <Text
        scale={[0.5, 0.5, 0.5]}
        // position={[0, 0, 5]}
        color="black" // default
        anchorX="center" // default
        anchorY="middle" // default
        >
          {about_text_1}
          {"\n"}
          {about_text_2}
          {"\n"}
          {about_text_3}

        </Text>

        {/* <Stats /> */}
      </Canvas>
    </>
  )
}

export default App
