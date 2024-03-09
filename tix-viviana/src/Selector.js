import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, MeshTransmissionMaterial } from '@react-three/drei'
import { easing } from 'maath'
import { useControls } from 'leva'



// EXPANDING ANIMATION
// CODE REF:: 

export default function Selector({changeStore, children, ...props }) {
  const geoRefMini = useRef()
  const [store, setStore] = useState(false)

  // MINI LENS
      // Mini lens is a small overlaying cube that expands when you hover over 'buy a ticket.'
      // This allows us to blur the 'buy a ticket' text when you hover over it a little bit.
  useFrame(({ viewport, camera, pointer }, delta) => {
    
  })

  

  return (
    <>
    
    {/* ref=ref is original code */}
      {/* <mesh ref={ref}>
        <circleGeometry args={[1, 64, 64]} />
        <MeshTransmissionMaterial samples={16} resolution={512} anisotropicBlur={0.1} thickness={0.1} roughness={0.4} toneMapped={true} />
      </mesh> */}
      

      <group
      onPointerOver={() => {
        changeStore()
        console.log('setStore = ', store)}}
      onPointerOut={() => {
        changeStore()
        console.log('setStore = ', store)}}
      >
        
        {children}
      </group>

    </>
  )
}