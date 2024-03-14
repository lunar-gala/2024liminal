import { useState } from 'react'
import { Canvas, useThree } from "@react-three/fiber"
import { 
  Stats, 
  Image, 
} from '@react-three/drei'
import './App.css'
import { createNoise2D } from 'simplex-noise'
import { map, Pane, RobotoMono, Kommuna, WordMarkRounded } from '../../src/index.jsx'

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

function text2components(text, size, startPosition, endPosition, justify) {
  justify = justify != null ? justify : false

  let textArr = text.split(" ").map((word) => word.toUpperCase()) // split and capitalize strings
  // map each word to a one-word component, with evenly distributed x positions
  let componentArr = []

  if (justify) {
    // lmao
    let charWidth = 0.625 * size
    let textLength = 0;
    for (let i = 0; i < textArr.length; i++) {
      textLength += textArr[i].length * charWidth
    }

    let targetLength = endPosition - startPosition
    let paddingNeeded = targetLength - textLength
    let spaceLength = paddingNeeded / (textArr.length-1) // for n words there are n-1 spaces

    let currX = 0;
    for (let i = 0; i < textArr.length; i++) {
      let word = textArr[i]
      let component = <RobotoMono 
                        fontSize={size} 
                        position={[currX - targetLength/2, 0, 0]} 
                        text={word} 
                        key={i}
                        anchorX="left"
                      />
      componentArr.push(component)

      currX += spaceLength + textArr[i].length * charWidth
    }

  } else {
    for (let i = 0; i < textArr.length; i++) {
      let word = textArr[i]
      let component = <RobotoMono 
                        fontSize={size} 
                        position={[map(i, 0, textArr.length-1, startPosition, endPosition), 0, 0]} 
                        text={word} 
                        key={i}
                        anchorX="center"
                      />
      componentArr.push(component)
    }
  }
  
  return componentArr
}

export function AboutPage() {
  const [count, setCount] = useState(0)
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

  /* text blocks */
  const about_text_11 = "it is not what is on each side of the doorway, but rather the space in between."
  const about_text_12 = "what exists in the undefined area where one is not this nor that."
  const about_text_2 = "you are in the space between spaces."
  const about_text_3 = "only here, can this exist."
  const about_text_4 = "welcome to liminal"
  const about_text_5 = "in collaboration with"

  const text11Components = text2components(about_text_11, RobotoMonoSize, -panesSpan/2 - paneWidth/2, panesSpan/2 + paneWidth/2, true)
  const text12Components = text2components(about_text_12, RobotoMonoSize, -panesSpan/2 - paneWidth/2, panesSpan/2 + paneWidth/2, true)
  const text2Components = text2components(about_text_2, RobotoMonoSize, -panesSpan/2 + panesSection/2, panesSpan/2 - panesSection/2, false)
  const text3Components = text2components(about_text_3, RobotoMonoSize, -panesSpan/2 - paneWidth/2, panesSpan/2 + paneWidth/2, true)
  const text4Components = text2components(about_text_4, RobotoMonoSize, -panesSpan/2 - paneWidth/2, panesSpan/2 + paneWidth/2, true)

  return (
    <>
      <ambientLight intensity={1}/>
      <directionalLight position={[0, 0, 5]} intensity={0.5} />
      <group position={[0, viewport.height * 0.04, -0.15]}>
        {panes}
      </group>
      {/* <TextItem url="/../text1.png" scale={viewport.width / 1512} position={[[0, 0.25 * viewport.height, 0]]} />
      <TextItem url="/../text2.png" scale={viewport.width / 1512} position={[[0, 0, 0]]} />
      <TextItem url="/../text3.png" scale={viewport.width / 1512} position={[[0, -0.25 * viewport.height, 0]]} />
      <TextItem url="/../text4.png" scale={viewport.width / 1512} position={[[0, -0.4 * viewport.height, 0]]}/> */}
      {/* <RobotoMono fontSize={RobotoMonoSize} position={[0, 0.3 * viewport.height, 0]} width={panesSpan} text={about_text_1.toUpperCase()}/> */}
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
      <Kommuna position={[-panesSpan/2 - paneWidth/2, viewport.height * -0.44, 0]} fontSize={RobotoMonoSize} text={about_text_5.toUpperCase()} anchorX={"left"} />

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