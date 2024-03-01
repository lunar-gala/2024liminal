import { CameraControls } from '@react-three/drei'
import './App.css'
import Model from './Model.jsx'
import Model02 from './Model02.jsx'

export default function App() {
  
  return (
    <>
    <CameraControls />
      <ambientLight intensity={ 0.5 } />
      <Model02 />
    </>
  )
}
