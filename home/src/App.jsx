import { CameraControls } from '@react-three/drei'
import './App.css'
import blenderModel from './OLD-blenderModel.jsx'
import Model from './Model.jsx'

export function HomePage() {
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
      <Model />
    </>
  )
}
