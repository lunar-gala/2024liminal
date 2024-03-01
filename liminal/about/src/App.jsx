import { useState } from 'react'
import { Canvas } from "@react-three/fiber"
import { 
  Stats, 
  Text, 
  Loader, 
  useTexture, 
  useGLTF, 
  Shadow 
} from '@react-three/drei'
import './App.css'
import { createNoise2D } from 'simplex-noise'
import { fonts, map, constrain, Cover, Pane } from '../../src/index.jsx'

const noise = createNoise2D();
function chimesMoveFunction(position, size, id, state, ref) {

    let d = 5;
    let theta_z = ((noise(state.clock.elapsedTime / 2 - position[0] / 10, id/10) + 0.5) / 10)
    let theta_x = noise(state.clock.elapsedTime / 2 - position[0] / 10 + 1000, id/10) / 20
    // console.log(theta)
    ref.current.rotation.z = theta_z
    ref.current.rotation.x = theta_x
    ref.current.position.x = position[0] + 2*d*Math.sin(theta_z/2)*Math.cos(theta_z/2)
    ref.current.position.y = 2*d*Math.sin(theta_z/2)*Math.sin(theta_z/2) + 2*d*Math.sin(theta_x/2)*Math.sin(theta_x/2)
    ref.current.position.z = 2*d*Math.sin(-theta_x/2)*Math.cos(-theta_x/2)

}

export function AboutPage() {
  const [count, setCount] = useState(0)

  const panes = []
  for (let i=0; i<8; i++){
    let position = [map(i, 0, 7, -6, 6), 0, 0]
    let size = [1, 7, 0.05]
    let force = null // noise(state.clock.elapsedTime + position[0], 1)
    
    panes.push(<Pane position={position} size={size} moveFunction={chimesMoveFunction} key={i} id = {i}/>)
  }

  /* text blocks */
  const about_text_1 = "it is not what is on each side of the doorway, but rather the space in between. what exists in the undefined area where one is not this nor that. "
  const about_text_2 = "you are in the space between spaces. only here, can this exist."
  const about_text_3 = "welcome to liminal"

  return (
    <>
      <ambientLight intensity={1}/>
      <directionalLight position={[0, 0, 5]} intensity={0.5} />

      <group position={[0, 0, -0.15]}>
        {panes}
      </group>

      <Text
        scale={[0.4, 0.4, 0.4]}
        position={[0, 2, 0]}
        font={fonts.RobotoMono}
        characters="abcdefghijklmnopqrstuvwxyz0123456789!"
        color="black" // default
        anchorX="center" // default
        anchorY="middle" // default
        maxWidth={32}
        textAlign="justify"
      >
        {about_text_1}
      </Text>

      <Text
        scale={[0.4, 0.4, 0.4]}
        position={[0, -1, 0]}
        font={fonts.RobotoMono}
        characters="abcdefghijklmnopqrstuvwxyz0123456789!"
        color="black" // default
        anchorX="center" // default
        anchorY="middle" // default
        maxWidth={32}
        textAlign="center"
      >
        {about_text_2}
        {'\n'}{'\n'}{'\n'}
        <Text
          position={[-2.3, -2.8, 0]}
          textAlign="center"
          color="black"
        >
        welcome   to
        </Text>
        <Text 
          font={fonts.Wordmark}
          position={[3.5, -2.8, 0]}
          color="black"
          
        >
            LIMINAL
        </Text>
      </Text>

      {/* <Stats /> */}
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
        <AboutPage />
      </Canvas>
    </>
  )
}

export default App