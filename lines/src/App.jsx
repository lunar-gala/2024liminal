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
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { fonts, map, constrain, Cover, Pane } from '../../src/index.jsx'


export function LinesPage() {
  return (
    <>
      <Text>lines page</Text>
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
