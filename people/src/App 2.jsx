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
  Edges,
  Image
} from '@react-three/drei'
import { animated, useSpring, useSpringValue, useSpringRef, a } from "@react-spring/three"
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { LIMINAL, Kommuna } from '../../src/index.jsx'
import * as THREE from 'three'


const imageUrls = [
  "people/src/assets/headshots/Creative1.png",
  "people/src/assets/headshots/Creative2.png",
  "people/src/assets/headshots/Creative3.png",
  "people/src/assets/headshots/Creative4.png",
  "people/src/assets/headshots/Creative5.png",
];

const names = [
  "Creative person 1",
  "Creative person 2",
  "Creative person 3",
  "Creative person 4",
  "Creative person 5",
];

const teams = [
  "Creative",
  "Creative",
  "Creative",
  "Creative",
  "Creative",
]

const subteams = [
  "Design",
  "Design",
  "Web",
  "Web",
  "Web",
]

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
  dx: 0,
  dy: 0,
  dz: -paneThickness * 2,
  currId: 0
}

const Card = ({ myid, id, imageUrl, name, team, subteam }) => {
  const state = useThree();
  const ref = useRef();
  const { viewport } = useThree();

  const cardWidth = 0.25 * viewport.width;
  const cardHeight = 1.4 * cardWidth;

  const imageHeight = cardHeight * 0.5; // 50% of the card's height
  const imageWidth = imageHeight * (cardWidth / cardHeight); 

  const size = [cardWidth, cardHeight, paneThickness];
  
  const dx = -gridRectWidthScalar * viewport.width;
  const dy = -dx;
  const dz = stack.dz;
 
  // init stack
  stack.dx = dx;
  stack.dy = dy;

  const position = [myid * dx, myid * dy, myid * dz];
  const textOffsetY = -cardHeight * 0.5;

  return (
    <mesh
      position={position}
      ref={ref}
      visible={myid > id ? true : false}
    >
      <boxGeometry args={size}/>
      <meshBasicMaterial 
        color={"white"} 
        toneMapped={false}
      />
      <Edges
        scale={1}
        threshold={15}
        color="black"
      />
      <Image 
        position={[0, 2, paneThickness * 0.5 + 0.01]} // Slightly in front of the card to prevent z-fighting
        url={imageUrl} // The URL of the image to display
        scale={[cardWidth * 0.8, cardHeight*0.6, 1]} // Scale image to fit the card, adjust as needed
      />

      <Text
        position={[-3.1, -2.75, paneThickness * 0.5 + 0.03]}
        fontSize={0.45}
        color="black"
        anchorX="left"
      >
        {name}
      </Text>

      <Text
        position={[-2.1, -3.75, paneThickness * 0.5 + 0.03]}
        fontSize={0.45}
        color="black"
        anchorX="left"
      >
        {team}
      </Text>

      <Text
        position={[-1.1, -4.75, paneThickness * 0.5 + 0.03]}
        fontSize={0.45}
        color="black"
        anchorX="left"
      >
        {subteam}
      </Text>
    </mesh>
  );
};

const AnimatedCard = animated(Card)

function makeCards(id) {
  const cards = [];
  for (let i = 0; i < numPeople; i++) {
    const imageUrl = imageUrls[i % imageUrls.length];
    const name = names[i % names.length];
    const team = teams[i % teams.length];
    const subteam = subteams[i % subteams.length];
    cards.push(<AnimatedCard id={id} myid={i} key={i} imageUrl={imageUrl} name={name} team={team} subteam={subteam} />);
  }

  return cards;
}


const Cards = ( ) => {

  const { viewport } = useThree()

  const id = useSpringValue(0, {
    config: {
      mass: 1,
      friction: 1,
      tension: 5,
      clamp: true,
    },
  })

  const cards = makeCards(id)

  const handleEnter = (newid) => {
    id.start(newid)
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
          onPointerOver={() => handleEnter(id)}
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

  const gridRects = makeGrid()

  // magic numbers go burr
  const rectWidth = gridRectWidthScalar * viewport.width * 2.5
  const rectHeight = gridRectHeightScalar * viewport.height * 1.3
  const gridHeight = rectHeight * 13

  const cardWidth = 0.33 * viewport.width
  const cardHeight = 0.69 * viewport.height

  const Grid = () => {
    return (
      <group position={[0.07 * viewport.height, rectHeight * 6.5, 0]}>
        {gridRects}
      </group>
    )
  }

  const CardsInner = ({cards, id}) => {
    
    return (
      <>
        <group>
          { cards }
        </group>
      </>
    )
  }

  const AnimatedCards = animated(CardsInner)

  return (
    <>
      <Grid />
      <group position={[-2.6 * rectWidth - cardWidth/4, -cardWidth/8, 0 ]}>    
        <animated.group 
          position-x={id.to(value => (value) * -stack.dx)} 
          position-y={id.to(value => (value) * -stack.dy)} 
          position-z={id.to(value => (value) * -stack.dz)}
        >
          <AnimatedCards cards={cards} id={id}/>
          {/* <AnimatedCards cards={ cards.slice(id.to(value => value)) } /> */}
          {/* { cards.slice(id.to(value => `${Math.floor(value)}`)) } */}
        </animated.group>
      </group>
    </>
  )
}

export function PeoplePage({isMobile}) {

  const { viewport } = useThree();

  console.log(isMobile)
  
  if (!isMobile) return (
    <>
      <LIMINAL viewport={viewport} />
      <group>
        <Cards />
      </group>
    </>
  )
  return (
    <>
      {/* <MobilePeople /> */}
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