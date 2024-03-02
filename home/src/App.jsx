import { CameraControls } from '@react-three/drei'
import './App.css'
import blenderModel from './blenderModel.jsx'
import Model from './Model.jsx'

export default function App() {
  
  return (
    <>
    <CameraControls />
      <ambientLight intensity={ 0.5 } />
      <Model />
    </>
  )
}
