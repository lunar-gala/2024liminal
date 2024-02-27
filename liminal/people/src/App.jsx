import { useState } from 'react'
import { Canvas } from "@react-three/fiber"
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { fonts, map, constrain, Cover, Pane } from '../../src/index.jsx'


export function PeoplePage() {
  return (
    <>
      <Text>people page</Text>
      <mesh position = {[0, 0, 0]} onPointerEnter = { (e) => console.log('enter') }>
      
        <boxGeometry args={[10, 10, 0.1]}/>
        <meshPhongMaterial color={"pink"} opacity={1} transparent />
    </mesh>
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
        <PeoplePage />
      </Canvas>
    </>
  )
}

export default App