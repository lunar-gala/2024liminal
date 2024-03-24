import React, { useState, useRef } from 'react'
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
import { fonts, map, constrain, Cover, Pane, max, min } from '../../src/index.jsx'
import * as THREE from 'three'

import { urls, names, team, title } from './newConstants.js'
import { RobotoMono, Kommuna, WordMark  } from '/src/index.jsx'

const numPeople = 163;

// the starting and ending index of each text block
const textPositions = [
  [[0, 6, "producers"], [9,14, "design"]], // producers and Design
  [],
  [[9,15, "creative"]],// creative
  [], 
  [],
  [[1,6, "model"]], // model
  [[11,15, "pr"]], //PR 
  [[6,11, "dance"]],
  [],// DANCE
  [], 
  [[1,9, "production"]], // PRodcuction
  [], 
  [[2,10, "cinematography"]],// cinema
  [[0,7, "beauty"]]//beauty  
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
  //use viewport height
  const cardHeight = 0.65*viewport.height;

  const namePosition = [-cardWidth * 0.425, -cardHeight * 0.23, paneThickness * 0.5 + 0.01];
  const teamPosition = [-cardWidth * 0.4375, -cardHeight * 0.33, paneThickness * 0.5 + 0.01];
  const LPosition = [-cardWidth * 0.318, -cardHeight * 0.36, paneThickness * 0.5 + 0.01];
  const subteamPosition = [-cardWidth * 0.4375, -cardHeight * 0.28, paneThickness * 0.5 + 0.01];

  const curve2Scale = [cardWidth * 0.07, cardWidth * 0.07 * (206 / 208), 1];
  const curve2Position = [-cardWidth * 0.28, -cardHeight * 0.36, paneThickness * 0.5 + 0.01];

  const curve1Scale = [cardWidth * 0.1, cardWidth * 0.1 * 2, 1];
  const curve1Position = [-cardWidth * 0.375, -cardHeight * 0.32, paneThickness * 0.5 + 0.01];

  const imageHeight = cardHeight * 0.5;

  const size = [cardWidth, cardHeight, paneThickness];
  
  const dx = -gridRectWidthScalar * viewport.width;
  const dy = -dx;
  const dz = stack.dz;
 
  // init stack
  stack.dx = dx;
  stack.dy = dy;

  const position = [myid * dx, myid * dy, myid * dz];

  return (
    <mesh
      position={position}
      ref={ref}
      visible={myid > id && myid < id + 30 ? true : false}
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
        position={[0, 1.5, paneThickness * 0.5 + 0.01]} 
        url={imageUrl} 
        scale={[cardWidth*0.85, cardHeight*0.6, 1]}
        anchorX="left"
      />
      <RobotoMono
        position={namePosition}
        fontSize={cardWidth*0.045}
        color="black"
        anchorX="left"
        text={name.toUpperCase()}
      />
      <RobotoMono
        position={subteamPosition}
        fontSize={cardWidth*0.045}
        color="black"
        anchorX="left"
        text={"├─  "+subteam.toUpperCase()}
      />
      <RobotoMono
        position={teamPosition}
        fontSize={cardWidth*0.045}
        color="black"
        anchorX="left"
        text={"│      ├─  " + team.toUpperCase()}
      />
    </mesh>
  );
}; 

const AnimatedCard = animated(Card)

function makeCards(id) {
  const cards = [];
  // console.log(urls.length, names.length, team.length, title.length)
  for (let i = 0; i < numPeople; i++) {
    const imageUrl = urls[(i+161) % urls.length];
    const name = names[(i+161) % names.length];
    const theteam = team[(i+161) % team.length];
    const subteam = title[(i+161) % title.length];
    // console.log(i, imageUrl, name, theteam, subteam)
    cards.push(<AnimatedCard id={id} myid={i} key={i} imageUrl={imageUrl} name={name} team={theteam} subteam={subteam} />);
  }

  return cards;
}


const Cards = ( ) => {

  const { viewport } = useThree()

  const id = useSpringValue(0)

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

  const TextPositionMarker = ({ group, col, lineName }) => {
    const { viewport } = useThree();
    
    const rWidth = gridRectWidthScalar * viewport.width;
    const rHeight = gridRectHeightScalar * viewport.height;
    
    const startX = 2.5 * rWidth * group[0]; // Starting X position of the left bracket
    const endX = 2.5 * rWidth * group[1]; // Ending X position of the right bracket
    const midX = (startX + endX) / 2; // Middle X position for the line name
    
    const y = -1.3 * rHeight * col; // Y position based on column
    
    return (
      <>
        <Kommuna
          position={[startX, y, 0.1]}
          fontSize={cardWidth*0.06}
          color="black"
          anchorX="right"
          text={"["}
        />
        <Kommuna
          position={[midX, y, 0.1]}
          fontSize={cardWidth*0.06}
          color="black"
          anchorX="center"
          text={lineName}
        />
        <Kommuna
          position={[endX, y, 0.1]}
          fontSize={cardWidth*0.06}
          color="black"
          anchorX="left"
          text={"]"}
        />
      </>
    );
  };
  

  function makeGrid() {
    const gridRects = []
  
    let i = 0;
    for (let col = 0; col < textPositions.length; col++) {
      for (let row = 0; row < 16; row++) {
        let includeRect = true;
  
        // Loop through each range for the current row
        for (let range of textPositions[col]) {
          // If row is within the current range, mark it to skip
          if (row >= range[0] && row <= range[1]) {
            includeRect = false;
            break;
          }
        }
  
        // If the row is not in any of the ranges, include the rect
        if (includeRect) {
          gridRects.push(<Rect row={row} col={col} moveFunction={null} key={i} id={i} />)
          i++;
        }
      }
    }

    textPositions.forEach((groupRanges, col) => {
      groupRanges.forEach(group => {
        const [start, end, lineName] = group;
        gridRects.push(
          <TextPositionMarker 
            group={group} 
            col={col} 
            lineName={lineName} 
            key={`text-${col}-${group[0]}`} />
        );
      });
    });
  
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
          position-x={id.to(value => value * -stack.dx)} 
          position-y={id.to(value => value * -stack.dy)} 
          position-z={id.to(value => value * -stack.dz)}
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

  // console.log(isMobile)
  
  return (
    <>
      <group>
        <Cards />
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