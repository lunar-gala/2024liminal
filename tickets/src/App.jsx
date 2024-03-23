import { Preload } from '@react-three/drei'
import { RobotoMono, LIMINAL, text2components, max } from '../../src/index.jsx'
import { animated, useSpringValue, } from '@react-spring/three'

// Typography
import { useThree } from '@react-three/fiber'
import { Text } from '@react-three/drei'

// Lense
import { useRef, useState, useEffect } from 'react'
import { useFrame, createPortal } from '@react-three/fiber'
import { useGLTF, useFBO, MeshTransmissionMaterial } from '@react-three/drei'
import * as THREE from 'three'

import { useStore } from './store'

// ticketButtonHTML
import { Html } from '@react-three/drei'
// import './style.css'

export function TixPage() {

  // tix globals
  const { viewport } = useThree()
  let move = false;

  const lensDefault = 1;
  const lensMax = max(viewport.height, viewport.width)
  const lensSize = useSpringValue(lensDefault, 
    {onRest: (e) => {
      if (e.finished === true && move) {
        console.log(e);
        window.open("https://en.wikipedia.org/wiki/K67_kiosk", '_blank').focus();
      }
    }})

  // lens
  function Lens({ size, damping = 0.15, ...props }) {
    const ref = useRef()
    const { nodes } = useGLTF("./LG-tickets-cursor.glb")
    
    useFrame(({ pointer }) => {
      const x = (pointer.x * viewport.width) / 2
      const y = (pointer.y * viewport.height) / 2
      ref.current.position.set(x, y, -0.1)
    })
  
    const config = {
        meshPhysicalMaterial: false,
        transmissionSampler: false,
        backside: false,
        samples: { value: 16, min: 1, max: 32, step: 1 },
        resolution: { value: 2048, min: 256, max: 2048, step: 256 },
        transmission: { value: 1, min: 0, max: 1 },
        roughness: { value: 0.3, min: 0, max: 1, step: 0.01 },
        thickness: { value: 2.24, min: 0, max: 10, step: 0.01 },
        ior: { value: 1.08, min: 1, max: 5, step: 0.01 },
        chromaticAberration: { value: 0.02, min: 0, max: 1 },
        anisotropy: { value: 0.1, min: 0, max: 1, step: 0.01 },
        anisotropicBlur: { value: 0.1, min: 0, max: 1, step: 0.01 },
        distortion: { value: 0.0, min: 0, max: 1, step: 0.01 },
        distortionScale: { value: 0.1, min: 0.01, max: 1, step: 0.01 },
        temporalDistortion: { value: 0.5, min: 0, max: 1, step: 0.01 },
        clearcoat: { value: 1, min: 0, max: 1 },
        attenuationDistance: { value: 0.5, min: 0, max: 10, step: 0.01 },
        attenuationColor: '#ffffff',
        color: '#b5e2ff',
        bg: '#b5e2ff'
    }
  
    return (
      <>
        <animated.group>
          {/* {createPortal(children, scene)} */}
          {/* <mesh scale={[viewport.width, viewport.height, 1]}>
            <planeGeometry />
            <meshBasicMaterial map={buffer.texture} /> 
          </mesh> */}
          <mesh scale={size} ref={ref} rotation-x={Math.PI/2} geometry={nodes.Cube.geometry} {...props}>
            {/* {config.meshPhysicalMaterial ? <meshPhysicalMaterial {...config} /> : <MeshTransmissionMaterial background={new THREE.Color(config.bg)} {...config} />} */}
            {/* <MeshTransmissionMaterial background={new THREE.Color(config.bg)} {...config} /> */}
            <MeshTransmissionMaterial samples={16} resolution={100} anisotropicBlur={.1} thickness={0.1} roughness={0.4} toneMapped={true} background={new THREE.Color(config.bg)} />
          </mesh>
        </animated.group>
      </>
    )
  }

  // text
  
  // to maintain consistant margins with AboutPage
  const panesSpan = viewport.width * (1 - 2*0.07)
  const paneHeight = 0.29 * viewport.height
  const paneWidth = paneHeight / 5

  const RobotoMonoSize = 0.5

  const tix_text_1 = "this page does nothing other than"
  const tix_text_2 = "take you to where you can"
  // const tix_text_3 = "buy a ticket"

  const text1 = text2components(RobotoMono, tix_text_1, RobotoMonoSize, -panesSpan/2 - paneWidth/2, panesSpan/2 + paneWidth/2, true)
  const text2 = text2components(RobotoMono, tix_text_2, RobotoMonoSize, -panesSpan/2 - paneWidth/2, panesSpan/2 + paneWidth/2, true)


  // button
  function handleOver() {
    // spring.start(max(viewport.width, viewport.height))
    move = true
    lensSize.start(lensMax)
    console.log('over')
    // changeStore()
  }

  function handleOut() {
    // lensSize.reverse()
    move = false
    lensSize.start(lensDefault)
    console.log('out')
    // changeStore()
  }

  const RobotoMonoButton = ({ position, text, ...props }) => {

    // const [hovered, setHovered] = useState(false)
    // const over = (e) => (e.stopPropagation(), setHovered(true))
    // const out = () => setHovered(false)
    
    // // Change the mouse cursor on hover¨
    // useEffect(() => {
    //   if (hovered) handleOver()
    //   else handleOut()
    // }, [hovered])

    return (
      <RobotoMono 
        position={position}
        fontSize={3.33 * RobotoMonoSize} text={text} 
        onPointerOver={ () => handleOver() } 
        onPointerOut={ () => handleOut() } 
        anchorX = {props.anchorX}
        textAlign = { props.textAlign }
      />
    )
  }

  const AniatedLens = animated(Lens)
  
  return (
    <>
      <LIMINAL viewport={viewport} />
      <AniatedLens size={lensSize.to((value) => [value, 1, value])} />
      <group position={[0, 0.2 * viewport.height, 0]}>
        {text1}
      </group>
      <group position={[0, 0, 0]}>
        {text2}
      </group>
      <group position={[0, -0.33*viewport.height, 1]}>
        <RobotoMonoButton textAlign={"left"} anchorX={"left"} position={[-panesSpan/2 - paneWidth/2, 0, 0]} text={"BUY"}/>
        <RobotoMonoButton textAlign={"left"} anchorX={"center"} position={[0, 0, 0]} text={"A"}/>
        <RobotoMonoButton textAlign={"right"} anchorX={"right"} position={[panesSpan/2 + paneWidth/2, 0, 0]} text={"TICKET"}/>
        {/* {text3} */}
      </group>
      <Preload />
    </>
  )
}