import { CameraControls } from '@react-three/drei'
import './App.css'
import Model from './Model.jsx'

export function HomePage(viewport) {
  return (
    <>
      <Model />
    </>
  )
}

export default function App() {
  
  return (
    <>
      <CameraControls />
      <ambientLight intensity={ 0.5 } />
      <Model viewport={viewport} />
    </>
  )
}
