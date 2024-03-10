import { useState } from 'react'
import { Canvas, useThree } from "@react-three/fiber"
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

const Pair = ({position}) => {
  
  const { viewport } = useThree()
  
  return (
    <>
      <Pane position={[position.x - viewport.width * 0.33, position.y, position.z]}/>
      <Pane position={[position.x + viewport.width * 0.33, position.y, position.z]}/>
    </>
  )
}

export function LinesPage() {

  

  return (
    <>
      <Pair position={[0,0,0]}/>
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
