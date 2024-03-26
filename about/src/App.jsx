import React, { useState, useEffect } from 'react'
import { Canvas, useThree } from "@react-three/fiber"
import { 
  Stats, 
  Image, 
} from '@react-three/drei'
import './App.css'
import { createNoise2D } from 'simplex-noise'
import { map, Pane, RobotoMono, LIMINAL, text2components, sendBack } from '../../src/index.jsx'
import tons from './assets/tons.png'
import s from './assets/s.png'

const noise = createNoise2D();
function chimesMoveFunction(position, size, id, state, ref) {

    let d = 10;
    let theta_z = (noise(state.clock.elapsedTime / 2 - position[0] / 10, id/10) + 0.5) / 20
    let theta_x = noise(state.clock.elapsedTime / 2 - position[0] / 10 + 1000, id/10) / 40
    // console.log(theta)
    ref.current.rotation.z = theta_z
    ref.current.rotation.x = theta_x
    ref.current.position.x = position[0] + 2*d*Math.sin(theta_z/2)*Math.cos(theta_z/2)
    ref.current.position.y = 2*d*Math.sin(theta_z/2)*Math.sin(theta_z/2) + 2*d*Math.sin(theta_x/2)*Math.sin(theta_x/2)
    ref.current.position.z = 2*d*Math.sin(-theta_x/2)*Math.cos(-theta_x/2)

}

export function AboutPage() {
  const { viewport } = useThree()

  const panesSpan = viewport.width * (1 - 2*0.07) // 7% margins
  const panesSection = panesSpan / 8
  const paneHeight = 0.29 * viewport.height // paneWidth * 5
  const paneWidth = paneHeight / 5

  const RobotoMonoSize = 0.5 // viewport.width * 0.017
  
  const panes = []
  for (let i = 0; i < 8; i++){
    let position = [map(i, 0, 7, -panesSpan/2, panesSpan/2), 0, 0]
    let size = [paneWidth, paneHeight, 0.05]
    let force = null // noise(state.clock.elapsedTime + position[0], 1)
    
    panes.push(<Pane position={position} size={size} moveFunction={chimesMoveFunction} key={i} id={i}/>)
  }

  useEffect(() => {
    window.addEventListener('pointerup', (e) => sendBack(e));
    return () => {
      window.removeEventListener('pointerup', (e) => sendBack(e));
    };
  }, []);

  /* text blocks */
  const about_text_11 = "it is not what is on each side of the doorway, but rather the space in between."
  const about_text_12 = "what exists in the undefined area where one is not this nor that."
  const about_text_2 = "you are in the space between spaces."
  const about_text_3 = "only here, can this exist."
  const about_text_4 = "welcome to liminal"
  const about_text_5 = "in collaboration with"

  const text11Components = text2components(RobotoMono, about_text_11, RobotoMonoSize, -panesSpan/2 - paneWidth/2, panesSpan/2 + paneWidth/2, true)
  const text12Components = text2components(RobotoMono, about_text_12, RobotoMonoSize, -panesSpan/2 - paneWidth/2, panesSpan/2 + paneWidth/2, true)
  const text2Components = text2components(RobotoMono, about_text_2, RobotoMonoSize, -panesSpan/2 + panesSection/2, panesSpan/2 - panesSection/2, false)
  const text3Components = text2components(RobotoMono, about_text_3, RobotoMonoSize, -panesSpan/2 - paneWidth/2, panesSpan/2 + paneWidth/2, true)
  const text4Components = text2components(RobotoMono, about_text_4, RobotoMonoSize, -panesSpan/2 - paneWidth/2, panesSpan/2 + paneWidth/2, true)

  return (
    <>
      <ambientLight intensity={1}/>
      <directionalLight position={[0, 0, 5]} intensity={0.5} />
      <LIMINAL viewport={viewport} />
      <group position={[0, viewport.height * 0.04, -0.15]}>
        {panes}
      </group>
      <group position={[0, 0.33 * viewport.height, 0]}>
        {text11Components}
      </group>
      <group position={[0, 0.29 * viewport.height, 0]}>
        {text12Components}
      </group>
      <group position={[0, viewport.height * 0.04, 0]}>
        {text2Components}
      </group>
      <group position={[0, viewport.height * -0.2, 0]}>
        {text3Components}
      </group>
      <group position={[0, viewport.height * -0.25, 0]}>
        {text4Components}
      </group>
      <group position={[-panesSpan/2 - paneWidth/2, viewport.height * -0.44, 0]}>
        <RobotoMono fontSize={RobotoMonoSize} text={about_text_5.toUpperCase()} anchorX={"left"} />
        <Image url = {tons} position = {[9.5, 0, 0]} scale = {[4, 1, 1]} toneMapped={false}/>
        <Image url = {s} position = {[13.5, 0, 0]} scale = {[2, 2, 2]} toneMapped={false}/>
      </group>
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