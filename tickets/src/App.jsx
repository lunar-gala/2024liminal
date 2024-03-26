import { Preload } from '@react-three/drei'
import { RobotoMono, LIMINAL, text2components, max, sendBack } from '../../src/index.jsx'
import { animated, useSpringValue, } from '@react-spring/three'

// Typography
import { useThree } from '@react-three/fiber'

// Lense
import React, { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, MeshTransmissionMaterial } from '@react-three/drei'
import * as THREE from 'three'

export function TixPage() {

  // tix globals
  const { viewport } = useThree()
  let move = false;

  const lensDefault = 1;
  const lensMax = max(viewport.height, viewport.width)
  const lensSize = useSpringValue(lensDefault, 
    {onRest: (e) => {
      if (e.finished === true && move) {
        // console.log(e);
        window.open("https://carnegiemellontickets.universitytickets.com/w/event.aspx?id=2462&p=1", '_blank').focus();
        sendBack();
      }
    }})

  useEffect(() => {
    window.addEventListener('pointerup', (e) => sendBack(e));
    return () => {
      window.removeEventListener('pointerup', (e) => sendBack(e));
    };
  }, []);

  // lens
  function Lens({ size, damping = 0.15, ...props }) {
    const ref = useRef()
    const { nodes } = useGLTF("./LG-tickets-cursor.glb")
    
    useFrame(({ pointer }) => {
      const x = (pointer.x * viewport.width) / 2
      const y = (pointer.y * viewport.height) / 2
      ref.current.position.set(x, y, -0.1)
    })
  
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
            <MeshTransmissionMaterial samples={16} resolution={10} anisotropicBlur={.1} thickness={0.1} roughness={0.4} toneMapped={true} background={new THREE.Color('#b5e2ff')} />
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