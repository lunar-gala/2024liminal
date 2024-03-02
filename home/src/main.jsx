import React from 'react'
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import App from './App.jsx'
import './index.css'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Canvas
      shadows
      camera={ {
          fov: 90,
          near: 0.001,
          far: 200,
          position: [0, 0, 2],
          
      } }>
      <App />
    </Canvas>
  </React.StrictMode>,
)
