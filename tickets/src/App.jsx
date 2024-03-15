import { Preload } from '@react-three/drei'
import { RobotoMono, LIMINAL, text2components, max } from '../../src/index.jsx'
import { animated, useSpring, useSpringValue, } from '@react-spring/three'

// Typography
import { useThree } from '@react-three/fiber'
import { Text } from '@react-three/drei'

// Lense
import { useRef, useState, useEffect } from 'react'
import { useFrame, createPortal } from '@react-three/fiber'
import { useGLTF, useFBO, MeshTransmissionMaterial } from '@react-three/drei'
import { easing } from 'maath'
import { useControls } from 'leva'
import * as THREE from 'three'

// ticketButtonHTML
import { Html } from '@react-three/drei'
import './style.css'


function Typography() {
  const state = useThree()
  const { width, height } = state.viewport.getCurrentViewport(state.camera, [0, 0, 12])
  const shared = { 
    font: '/fonts/RobotoMono/RobotoMono-VariableFont_wght.ttf',
    fontSize: 0.3,
    // fontWeight: 400, i cant get this to work.
    letterSpacing: 0, 
    color: 'black'
  }
  const liminalProps = { 
    font: '/fonts/Wordmark/NewEdge666-Regular.otf',
    fontWeight: 100,
    fontSize: 0.2,
    letterSpacing: -0.1, 
    color: 'black' 
  }
  
  return (
    <>
    {/* Text properies from trokia:
    https://github.com/protectwise/troika/tree/main/packages/troika-three-text */}

    {/* SHOE CODEBOX WITH EXPANDING ANIMATION;
    https://codesandbox.io/p/sandbox/frosted-glass-imn42?file=%2Fsrc%2FApp.js */}

    {/* IMPORTANT: the axis is like a grid in algebra. Center = (0,0), top of screen is positive, bottom of screen is negative.
    Left is negative, right is positive. */}

    {/* LANE 0 - LIMINAL HEADER */}
      <Text 
        children="LIMINAL"
        position={[0, height + 0.25, 0]}
        {...liminalProps} />


      {/* LANE 1 */}
      <Text 
        children="this page" 
        anchorX={'left'}
        position={[-width - 0.5, height * 0.85, 0]} 
        {...shared} />
      <Text 
        children="does" 
        anchorX={'right'}
        position={[width + 0.5, height * 0.85, 0]} 
        {...shared} />

     {/* LANE 2 */}
      <Text 
        children="nothing." 
        anchorX={'left'}
        position={[-width - 0.5, height * .25, 0]} 
        {...shared} />
      <Text 
        children="other" 
        anchorX={'left'}
        position={[0.25, height * .25, 0]} 
        {...shared} />
      <Text 
        children="then" 
        anchorX={'right'}
        position={[width + 0.5, height * .25, 0]} 
        {...shared} />

      {/* LANE 3 */}
      <Text 
        children="take" 
        anchorX={'left'}
        position={[-width - 0.5, -height * 0.25, 0]} 
        {...shared} />
      <Text 
        children="to" 
        anchorX={'right'}
        position={[width + 0.5, -height * 0.25, 0]} 
        {...shared} />

      {/* LANE 4 */}
      <Text 
        children="where you can" 
        anchorX={'left'}
        position={[-width - 0.5, -height * .85, 0]} 
        {...shared} />

      {/* LANE 5 - BUY A TICKET - 
      WE PLACED THIS BUTTON IN THE TicketButton func. */}
      {/* <Text children="buy a ticket→"  
        position={[width, -height, -5]} 
        {...shared} /> */}
      
    </>
  )
}

function TicketButtonHTML({changeStore}) {
  const state = useThree()
  const { width, height } = state.viewport.getCurrentViewport(state.camera, [0, 0, 12])
  const buyATicketProps = { 
    font: '/Inter-Regular.woff',
    fontSize: 0.15,
    letterSpacing: -0.1, color: 'black' 
  }
  return (
    <>
      {/* LANE 5 - BUY A TICKET */}
      <Html position={[width - 1, -height + 0.05, -5]} >
          <a 
            href="https://www.eventbrite.com/e/tech-together-new-york-2021-tickets-161462119315" 
            target="_blank" 
            rel="noreferrer"
            className="ticket-button"
            onMouseOver={() => {
              changeStore()
              }
            }
            onMouseOut={() => {
              changeStore()
              }
            }>
            buy a ticket→
          </a>

      </Html>
    </>
  )
}

export function TixPage() {

  const { viewport } = useThree()

    const lensDefault = 0.35;
    const lensMax = 15;
    const lensSize = useSpringValue(lensDefault)

  function Lens({ children, damping = 0.15, ...props }) {
    const geoRef = useRef()
    const [store, setStore] = useState(false)
    
    // We use { nodes } to extract the nodes property from the gltf file returned by useGLTF.
    // If we just did const nodes, then it would contain all properties returned by useGLTF, not just nodes.
    // Each node represents an object in the 3D scene. A node can represent a camera, a piece of geometry \
    // (like a mesh), a light, or a sub-scene (a group of other nodes).
    const { nodes } = useGLTF("./LG-tickets-cursor.glb")
  
  
    // The FBO will have a texture property that you can use as a texture in your materials, allowing you to use \
    // the result of the offscreen rendering in your scene.
    const buffer = useFBO()
    const [scene] = useState(() => new THREE.Scene())
    
    
    useFrame((state, delta) => {
      // Tie lens to the pointer
      // getCurrentViewport gives us the width & height that would fill the screen in threejs units
      // By giving it a target coordinate we can offset these bounds, for instance width/height for a plane that
      // sits 15 units from 0/0/0 towards the camera (which is where the lens is)
      
      // PRIMARY LENS
      easing.damp3(
        // Animates the lens position from its current position to the cursor's position [x,y,z]
        geoRef.current.position,
        [(state.pointer.x * viewport.width) / 2, (state.pointer.y * viewport.height) / 2, 15],
        damping,
        delta
      )
      // easing.damp3(
      //   geoRef.current.scale, 
      //   store ? 15 : .25, // altering this param changes the scale of the txt background as a result of the geoRef scale increasing.
      //   store ? 0.5 : 0.2, // damping speed of expansion vs contraction on hover
      //   delta)
  
  
      // This is entirely optional but spares us one extra render of the scene
      // The createPortal below will mount the children of <Lens> into the new THREE.Scene above
      // The following code will render that scene into a buffer, whose texture will then be fed into
      // a plane spanning the full screen and the lens transmission material
      state.gl.setRenderTarget(buffer)
      state.gl.setClearColor('#d8d7d7')
      state.gl.render(scene, state.camera)
      state.gl.setRenderTarget(null)
    })
  
    const config = useControls({
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
      })
  
    const changeStore = () => {
      setStore(!store)
    }
  
    return (
      <>
        <animated.group>
          {/* {createPortal(children, scene)} */}
          <mesh scale={[viewport.width, viewport.height, 1]}>
            <planeGeometry />
            <meshBasicMaterial map={buffer.texture} />
          </mesh>
          <mesh scale={lensSize.to((value) => (value))} ref={geoRef} rotation-x={Math.PI / 2} geometry={nodes.Cube.geometry} {...props}>
            {config.meshPhysicalMaterial ? <meshPhysicalMaterial {...config} /> : <MeshTransmissionMaterial background={new THREE.Color(config.bg)} {...config} />}
          </mesh>
        </animated.group>
        
        {/* <TicketButtonHTML changeStore={changeStore} /> */}
      </>
    )
  }
  

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

  function handleOver(spring) {
    // spring.start(max(viewport.width, viewport.height))
    spring.start(lensMax)
    console.log('over')
    // changeStore()
  }

  function handleOut(spring) {
    spring.start(lensDefault)
    console.log('out')
    // changeStore()
  }

  const RobotoMonoButton = ({ position, width, fontSize, text, ...props }) => {

    // const [hovered, setHovered] = useState(false)
    // const over = (e) => (e.stopPropagation(), setHovered(true))
    // const out = () => setHovered(false)
    
    // // Change the mouse cursor on hover¨
    // useEffect(() => {
    //   if (hovered) handleOver()
    //   else handleOut()
    // }, [hovered])

    return (
      <RobotoMono position={position} width={width} fontSize={fontSize} text={text} onPointerOver={() => handleOver(lensSize)} onPointerOut={() => handleOut(lensSize)} props={{...props}} />
    )
  }

  const tix_text_3 = "buy a ticket"
  const text3 = text2components(RobotoMonoButton, tix_text_3, 3.33 * RobotoMonoSize, -panesSpan/2 - paneWidth/2, panesSpan/2 + paneWidth/2, true)  

  const AniatedLens = animated(Lens)
  
  return (
    <>
      <LIMINAL viewport={viewport} />
      <AniatedLens />
        {/* <Typography /> */}

          {/** Preload is a helper that pre-emptively makes threejs aware of all geometries, textures etc
               By default threejs will only process objects if they are "seen" by the camera leading 
                to jank as you scroll down. With <Preload> that's solved. They get loaded immediately.  */}
      <group position={[0, 0.2 * viewport.height, 0]}>
        {text1}
      </group>
      <group position={[0, 0, 0]}>
        {text2}
      </group>
      <group position={[0, -0.33*viewport.height, 0]}>
        {text3}
      </group>
      <Preload />
    </>
  )
}