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

export function TixPage() {
  return (
    <>
      <Text>tix page</Text>
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
        <TixPage />
      </Canvas>
    </>
  )
}

export default App