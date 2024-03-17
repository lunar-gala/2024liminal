import { useRef } from 'react'
import { Clone, useGLTF, MeshTransmissionMaterial } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useControls } from 'leva'
import * as THREE from 'three'

export default function Model(props) { 
  const groupRef = useRef()
  const { nodes, materials } = useGLTF('./LG-Home-01.glb')
  const model = useGLTF('./LG-Home-01.glb')
  
  useFrame(({ delta, pointer, clock }) => {
    console.log(delta) // the value will be 0 at scene initialization and grow each frame
    groupRef.current.rotation.x = clock.getElapsedTime()
  })
  

    

    // Old Material from tickets page. Simple frosted class.
    // const config = useControls({
    //     meshPhysicalMaterial: false,
    //     transmissionSampler: false,
    //     backside: false,
    //     samples: { value: 16, min: 1, max: 32, step: 1 },
    //     resolution: { value: 2048, min: 256, max: 2048, step: 256 },
    //     transmission: { value: 1, min: 0, max: 1 },
    //     roughness: { value: 0.3, min: 0, max: 1, step: 0.01 },
    //     thickness: { value: 2.24, min: 0, max: 10, step: 0.01 },
    //     ior: { value: 1.08, min: 1, max: 5, step: 0.01 },
    //     chromaticAberration: { value: 0.02, min: 0, max: 1 },
    //     anisotropy: { value: 0.1, min: 0, max: 1, step: 0.01 },
    //     anisotropicBlur: { value: 0.1, min: 0, max: 1, step: 0.01 },
    //     distortion: { value: 0.0, min: 0, max: 1, step: 0.01 },
    //     distortionScale: { value: 0.1, min: 0.01, max: 1, step: 0.01 },
    //     temporalDistortion: { value: 0.5, min: 0, max: 1, step: 0.01 },
    //     clearcoat: { value: 1, min: 0, max: 1 },
    //     attenuationDistance: { value: 0.5, min: 0, max: 10, step: 0.01 },
    //     attenuationColor: '#ffffff',
    //     color: '#b5e2ff',
    //     bg: '#b5e2ff'
    //   })

      // New Material with Distortion and chrom. abberation
      // const config = useControls({
      //   meshPhysicalMaterial: false,
      //   transmissionSampler: false,
      //   backside: false,
      //   samples: { value: 16, min: 1, max: 32, step: 1 },
      //   resolution: { value: 2048, min: 256, max: 2048, step: 256 },
      //   transmission: { value: .76, min: 0, max: 1 },
      //   roughness: { value: 0.06, min: 0, max: 1, step: 0.01 },
      //   thickness: { value: 0.9, min: 0, max: 10, step: 0.01 },
      //   ior: { value: 1.36, min: 1, max: 5, step: 0.01 },
      //   chromaticAberration: { value: 0.4, min: 0, max: 1 },
      //   anisotropy: { value: 0.23, min: 0, max: 1, step: 0.01 },
      //   anisotropicBlur: { value: 0.24, min: 0, max: 1, step: 0.01 },
      //   distortion: { value: 0.5, min: 0, max: 1, step: 0.01 },
      //   distortionScale: { value: 0.23, min: 0.01, max: 1, step: 0.01 },
      //   temporalDistortion: { value: 0.13, min: 0, max: 1, step: 0.01 },
      //   clearcoat: { value: 0.92, min: 0, max: 1 },
      //   attenuationDistance: { value: 3.42, min: 0, max: 10, step: 0.01 },
      //   attenuationColor: '#ffffff',
      //   color: '#b3cfff',
      //   bg: '#ffffff'
      // })

      // post gbm feb 02
      const config = useControls({
        meshPhysicalMaterial: false,
        transmissionSampler: false,
        backside: false,
        samples: { value: 16, min: 1, max: 32, step: 1 },
        resolution: { value: 2048, min: 256, max: 2048, step: 256 },
        transmission: { value: 1.0, min: 0, max: 1 },
        roughness: { value: 0.28, min: 0, max: 1, step: 0.01 },
        thickness: { value: 0.53, min: 0, max: 10, step: 0.01 },
        ior: { value: 1.74, min: 1, max: 5, step: 0.01 },
        chromaticAberration: { value: 0.0, min: 0, max: 1 },
        anisotropy: { value: 0.03, min: 0, max: 1, step: 0.01 },
        anisotropicBlur: { value: 0.88, min: 0, max: 1, step: 0.01 },
        distortion: { value: 0.42, min: 0, max: 1, step: 0.01 },
        distortionScale: { value: 0.30, min: 0.01, max: 1, step: 0.01 },
        temporalDistortion: { value: 0.06, min: 0, max: 1, step: 0.01 },
        clearcoat: { value: 0.48, min: 0, max: 1 },
        attenuationDistance: { value: 3.24, min: 0, max: 10, step: 0.01 },
        attenuationColor: '#ffffff',
        color: '#b3cfff',
        bg: '#ffffff'
      })

      // Checkout 'Clone' props from R3F Drei docs: https://github.com/pmndrs/drei?tab=readme-ov-file#clone
    return (
        <mesh ref={groupRef} /**{...props}*/ > 
            <Clone object={model.scene} scale={1} position-y={-2.5} inject={<MeshTransmissionMaterial background={new THREE.Color(config.bg)} {...config} />} />
                
            {/* TESTING DIFFERENT METHODS OF IMPORTING GLTF... Below code imports each object (plane) one by one. The problem: They're all overlapping. Needs position setting. */}
            {/* <mesh castShadow receiveShadow geometry={nodes.Plane001.geometry}>
            <MeshTransmissionMaterial background={new THREE.Color(config.bg)} {...config} />
            </mesh> */}
            {/* <mesh castShadow receiveShadow geometry={nodes.Plane002.geometry} material={materials['Material.002']} /> 
            <mesh castShadow receiveShadow geometry={nodes.Plane003.geometry} material={materials['Material.002']} />
            <mesh castShadow receiveShadow geometry={nodes.Plane004.geometry} material={materials['Material.002']} />
            <mesh castShadow receiveShadow geometry={nodes.Plane005.geometry} material={materials['Material.002']} />
            <mesh castShadow receiveShadow geometry={nodes.Plane006.geometry} material={materials['Material.002']} />
            <mesh castShadow receiveShadow geometry={nodes.light_panel_plane.geometry} material={materials['Material.003']} />  */}
        </mesh>
        )
}