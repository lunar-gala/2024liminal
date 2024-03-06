import { useState, useRef } from 'react'
import { 
  Canvas,
  useThree,
  useFrame,
} from "@react-three/fiber"
import { 
  Stats, 
  Text, 
  Loader, 
  useTexture, 
  useGLTF, 
  Shadow,
  Edges
} from '@react-three/drei'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { fonts, map, constrain, Cover, Pane, max, min } from '../../src/index.jsx'

const numPeople = 168;

// the starting and ending index of each text block
const textPositions = [
  [2, 7], // producers
  [],
  [4, 11], // production
  [8, 15], // cinematogaphy
  [],
  [],
  [5, 11], // creative
  [8, 11], // pr
  [],
  [3, 8], // design
  [],
  [0, 4], // model
  [11, 15],// dance
  [3, 9]  // beuty
]

const paneThickness = 0.01;

const gridRectWidthScalar = 0.01;
const gridRectHeightScalar = 0.05;

const Rect = ({ row, col, moveFunction, id }) => {

  const state = useThree()
  const ref = useRef()
  const { viewport } = useThree()

  const rWidth = gridRectWidthScalar * viewport.width
  const rHeight = gridRectHeightScalar * viewport.height // rWidth * 3 // maybe make adaptive to height?

  const size = [ rWidth, rHeight, paneThickness ]
  const position = [ 2.5 * rWidth * row, -1.3 * rHeight * col, 0 ]



  useFrame(({ delta, pointer }) => {
      if (moveFunction != null) moveFunction(position, id, state, ref);
  })

  return (
      <mesh 
        position = {position} 
        ref = {ref} 
        // onPointerOver = { (e) => redirect(id) } 
      >
        <boxGeometry args={size}/>
        <meshStandardMaterial color={"white"} />
        <Edges
          scale={1}
          threshold={15}
          color="black"
        />
      </mesh>
  )
}

function makeGrid() {
  const gridRects = []

  let i = 0;
  for (let col = 0; col < 14; col++) {
    for (let row = 0; row < 16; row++) {

      if (textPositions[col].length == 0 || 
          row < textPositions[col][0] || 
          row > textPositions[col][1] ) {
        
        gridRects.push( <Rect row={row} col={col} 
                              moveFunction={null} 
                              key={i} id={i}/>
                      )
        i++;
      }
    }
  }

  console.log(i)

  return gridRects;
}

const Card = ({ key, id }) => {

  const state = useThree()
  const ref = useRef()
  const { viewport } = useThree()

  const cardWidth = 0.33 * viewport.width
  const cardHeight = min(0.69 * viewport.height, 1.4*cardWidth)

  const size = [ cardWidth, cardHeight, paneThickness ]
  
  const dx = gridRectWidthScalar * viewport.width // maybe make this not width dependent
  const dy = dx
  const dz = -paneThickness * 2

  const position = [ id * -dx, id * dy, id * dz ]
  
  
  return (
    <mesh
      position = {position}
      ref = {ref}
    >
      <boxGeometry args={size}/>
      <meshStandardMaterial color={"white"} />
        <Edges
          scale={1}
          threshold={15}
          color="black"
        />
    </mesh>
  )
}

function makeCards() {
  const cards = []
  for (let i = 0; i < numPeople; i++) {
    cards.push(<Card key={i} id={i} />)
  }

  return cards;
}

// IMPLEMENT MEEEE
function updateCards(id) {

}


export function PeoplePage() {

  const gridRects = makeGrid()
  const cards = makeCards()

  const { viewport } = useThree()

  // magic numbers go burr
  const rectWidth = gridRectWidthScalar * viewport.width * 2.5
  const rectHeight = gridRectHeightScalar * viewport.height * 1.3
  const gridHeight = rectHeight * 13

  const cardWidth = 0.33 * viewport.width
  const cardHeight = 0.69 * viewport.height

  const zOffset = 0
  
  
  return (
    <>
      {/* <directionalLight position={[0, 0, 5]} intensity={1} /> */}
      <group position={[-2.6 * rectWidth - cardWidth/2, 0, zOffset]}>
        {cards}
      </group>
      <group position={[2.8 * rectWidth, gridHeight/2, 0]}>
        {gridRects}
      </group>
    </>
  )
}

/**
 * DO NOT MODIFY APP
 */
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Canvas>
        <PeoplePage />
      </Canvas>
    </>
  )
}

export default App