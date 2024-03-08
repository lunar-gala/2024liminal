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
import { animated, useSpring, useSpringRef, a } from "@react-spring/three"
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

const paneThickness = 0.01

const gridRectWidthScalar = 0.01
const gridRectHeightScalar = 0.05

let stack = { 
  xTarget: 0,
  xCurr: 0,
  dx: 0,

  yTarget: 0,
  yCurr: 0,
  dy: 0,

  zTarget: 0,
  zCurr: 0,
  dz: -paneThickness * 2
}

const Rect = ({ row, col, moveFunction, id}) => {

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
        // onPointerOver={ updateCards(id) }
      >
        <boxGeometry args={size}/>
        <meshBasicMaterial color={"white"} toneMapped={false} />
        <Edges
          scale={1}
          threshold={15}
          color="black"
        />
      </mesh>
  )
}

function updateCards(id) {
  // console.log(id)
  stack.xCurr = stack.xTarget
  stack.yCurr = stack.yTarget
  stack.zCurr = stack.zTarget

  stack.xTarget = id * stack.dx
  stack.yTarget = id * stack.dy
  stack.zTarget = id * stack.dz

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
                              key={i} id={i} />
                      )
        i++;
      }
    }
  }

  return gridRects;
}

const Card = ({ id }) => {

  const state = useThree()
  const ref = useRef()
  const { viewport } = useThree()

  const cardWidth = 0.25 * viewport.width
  const cardHeight = 1.4*cardWidth // min(0.69 * viewport.height, 1.4*cardWidth)

  const size = [ cardWidth, cardHeight, paneThickness ]
  
  const dx = - gridRectWidthScalar * viewport.width // maybe make this not width dependent
  const dy = - dx
  const dz = stack.dz
 
  // init stack
  stack.dx = dx
  stack.dy = dy

  const position = [ id * dx, id * dy, id * dz ]
  
  return (
    <mesh
      position = {position}
      ref = {ref}
    >
      <boxGeometry args={size}/>
      <meshBasicMaterial color={"white"} toneMapped={false} />
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
    cards.push(<Card id={i} key={i} />)
  }

  return cards;
}

export function PeoplePage() {

  const { viewport } = useThree()

  const gridRects = makeGrid()
  const cards = makeCards()

  // magic numbers go burr
  const rectWidth = gridRectWidthScalar * viewport.width * 2.5
  const rectHeight = gridRectHeightScalar * viewport.height * 1.3
  const gridHeight = rectHeight * 13

  const cardWidth = 0.33 * viewport.width
  const cardHeight = 0.69 * viewport.height
  
  // const { stackPosition } = useSpring({ 
  //   stackPosition: [stack.xTarget, stack.yTarget, stack.zTarget], 
  //   from: { stackPosition: [stack.xCurr, stack.yCurr, stack.zCurr] } })

  // const stackApi = useSpringRef()
  const [ spring, api ] = useSpring(
    () => ({
      x: 0,
      y: 0,
      z: 0,
      config: { 
        mass: 5, 
        tension: 350, 
        friction: 40 
      },
    }),
    []
  )

  const slideStack = (xT, yT, zT) => {
    api.start({
      x: xT,
      y: yT,
      z: zT,
      config: {
        friction: 10,
      },
    })
  }


  console.log(spring.z.animation.to)
  
  return (
    <>
      <animated.group position={ [ 
        -2.6 * rectWidth - cardWidth/4 + stack.xTarget, // + spring.x.animation.to, 
        -cardWidth/8 + stack.yTarget, // + spring.y.animation.to, 
        0 + stack.zTarget // spring.z.animation.to
      ] }
      >
        {cards}
      </animated.group>
      <group position={[2.8 * rectWidth, gridHeight/2, 0]} >
        {gridRects /* {
          gridRects.map((rect) => rect.onPointerOver = { 
              slideStack(rect.id * stack.dx, 
                                rect.id * stack.dy, 
                                rect.id * stack.dz)
            }
          )
        } */}
      </group>
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
        <PeoplePage />
      </Canvas>
    </>
  )
}

export default App