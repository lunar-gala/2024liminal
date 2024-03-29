import React, { useState, useRef, useEffect, Suspense } from 'react'
import { 
  Canvas,
  useThree,
  useFrame,
} from "@react-three/fiber"
import { 
  Loader, 
  Edges,
  Image,
  useTexture
} from '@react-three/drei'
import { animated, useSpringValue } from "@react-spring/three"
import { sendBack, RobotoMono, Kommuna } from '../../src/index.jsx'
// import * as THREE from 'three'

import { urls, names, team, title, images } from './newConstants.js'

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


const Card = ({ myid, id, imageUrl, name, team, subteam, viewport }) => {

  const cardWidth = 0.25 * viewport.width;
  //use viewport height
  const cardHeight = 0.7*viewport.height;

  const namePosition = [-cardWidth * 0.425, -cardHeight * 0.18, paneThickness * 0.5 + 0.01];

  const imageHeight = cardHeight * 0.5;

  const size = [cardWidth, cardHeight, paneThickness];
  
  const dx = -gridRectWidthScalar * viewport.width;
  const dy = -dx;
  const dz = stack.dz;
 
  // init stack
  stack.dx = dx;
  stack.dy = dy;

  const position = [myid * dx, myid * dy, myid * dz];

  const text = name.toUpperCase() + "\n" + "├─  "+subteam.toUpperCase() + "\n" + "│      ├─  " + team.toUpperCase()

  return (
    <group position={position}>
      {id-5 < myid && myid < id + 30 &&
      <mesh
        // position={position}
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
        <Suspense fallback={null}>
          {myid > id && myid < id + 2 && <Image 
            position={[0, 2, paneThickness * 0.5 + 0.01]} 
            url={imageUrl} 
            scale={[cardWidth*0.85, cardHeight*0.6, 1]}
            anchorX="left"
            // visible={myid > id && myid < id + 2 ? true : false }
          />}
          {myid > id && myid < id + 2 && <RobotoMono
            position={namePosition}
            fontSize={cardWidth*0.045}
            lineHeight={2}
            color="black"
            anchorX="left"
            anchorY="Top"
            text={text}
          />}
        </Suspense>
      </mesh>}
    </group>
  )
}

const AnimatedCard = animated(Card)

function makeCards(id, viewport) {
  const cards = [];
  // console.log(urls.length, names.length, team.length, title.length)
  for (let i = 0; i < numPeople; i++) {
    // const imageUrl = urls[(i+161) % urls.length];
    const imageUrl = images[(i+161) % urls.length];
    const name = names[(i+161) % names.length];
    const theteam = team[(i+161) % team.length];
    const subteam = title[(i+161) % title.length];
    // console.log(i, imageUrl, name, theteam, subteam)
    cards.push(<AnimatedCard id={id} myid={i} key={i} imageUrl={imageUrl} name={name} team={theteam} subteam={subteam} viewport={viewport}/>);
  }

  return cards;
}

let global_id = 0;


const Cards = ({location}) => {

  const { viewport } = useThree()
  
  const id = useSpringValue(0, {
    // config: {
    //   mass: 2,
    //   friction: 10,
    //   tension: 80,
    //   clamp: true
    // },
  })

  const rWidth = gridRectWidthScalar * viewport.width
  const rHeight = gridRectHeightScalar * viewport.height // rWidth * 3 // maybe make adaptive to height?

  const cards = React.useMemo(() => makeCards(id, viewport), []);

  const handleEnter = (id, newid, setHover) => {
    id.animation.config.duration = Math.log(Math.abs(newid - global_id) + 1) * 100
    id.start(newid)
    setHover(true)

    global_id = newid;
  }

  const handleLeave = (setHover) => {
    setHover(false)
  }

  const Rect = ({row, col, myid, id}) => {

    const ref = useRef()

    const [hover, setHover] = useState(false);

    useFrame(() => {
      if (location != 'people') return
      
      if (hover) {
        // ref.current.position.y = -1.3 * rHeight * col + 0.05;
        ref.current.material.color.r = 0
        ref.current.material.color.g = 0
        ref.current.material.color.b = 0
      } else {
        // ref.current.position.y = -1.3 * rHeight * col;
        ref.current.material.color.r = 1
        ref.current.material.color.g = 1
        ref.current.material.color.b = 1
      }
    });
  
    const position = [ 2.5 * rWidth * row, -1.3 * rHeight * col, 0 ]

    const size = [rWidth, rHeight, paneThickness]
  
    return (
        <mesh 
          position = {position} 
          ref = {ref} 
          onPointerOver={() => handleEnter(id, myid, setHover)}
          onPointerLeave={() => handleLeave(setHover)}
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
          gridRects.push(<Rect row={row} col={col} moveFunction={null} key={i} myid={i} id={id} />)
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

  const gridRects = React.useMemo(() => makeGrid(), [viewport]);

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

export function PeoplePage({location}) {

  // console.log(isMobile)

  useEffect(() => {
    window.addEventListener('pointerup', (e) => sendBack(e));
    return () => {
      window.removeEventListener('pointerup', (e) => sendBack(e));
    };
  }, []);
  
  return (
    <>
      <group>
        <Cards location={location}/>
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