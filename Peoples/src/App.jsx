import React, { useRef, useState } from 'react';
import { Canvas, extend } from '@react-three/fiber';
import { Html, OrbitControls, Text } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';

extend({ OrbitControls });

function Box({ position, id, args, onHover }) {
  const meshRef = useRef();
  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={() => onHover(id)}
      onPointerOut={() => onHover(null)}
    >
      <boxGeometry args={args} />
      <meshStandardMaterial color="white" />
	  {/* <Html>
		<div className="card"> {id} </div>
	  </Html> */}
    </mesh>
  );
}
function Box2({ position, id, args, outline = false, hoveredCard }) {
	const isHovered = hoveredCard === id; // Check if this card is the one being hovered
	const showTextAndImage = (id === 'card-0' && (isHovered || hoveredCard === null)) || isHovered;
  
	const { pos } = useSpring({
	  pos: isHovered ? [position[0], position[1] + 0.3, position[2]] : position, // Adjust position if hovered
	  config: { mass: 1, tension: 0, friction: 26 },
	});
  
	// Calculate 40% of the card's height for the image
	const imageHeight = args[1] * 0.4; // args[1] is the height of the card
  
	return (
		
	  <animated.mesh position={pos}>
		<boxGeometry args={args} />
		<meshStandardMaterial color={outline ? 'black' : 'white'} />
		{showTextAndImage && (
        <Html position={[0,args[1] / 2 - imageHeight / 2 - 0.4,0]} center>
			<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
			  <img 
				src="https://media.istockphoto.com/id/1332100919/vector/man-icon-black-icon-person-symbol.jpg?s=612x612&w=0&k=20&c=AVVJkvxQQCuBhawHrUhDRTCeNQ3Jgt0K1tXjJsFy1eg=" 
				alt="Card Image" 
				style={{ 
				  height: `${imageHeight*18}vh`,
				  width: `auto`,
				  borderRadius: '5%',
				}} 
			  />
			</div>
		  </Html>
		)}
		{showTextAndImage && (
		  <Text
			position={[0, -args[1] * 0.5 + imageHeight / 2 + 0.3, args[2] / 2 + 0.1]} // Adjust position based on image height
			fontSize={0.2}
			maxWidth={2}
			color="black"
			anchorX="center"
			anchorY="middle"
		  >
			{id}
		  </Text>
		)}
	  </animated.mesh>
	);
  }
  

export default function App() {
  const [hoveredCard, setHoveredCard] = useState(null); // State to track the hovered card
  

  const gridSize = 6; // Define the grid size for boxes
  const stackSize = 10; // Define the stack size for cards
  const boxSpacingX = 0.4;
  const boxSpacingY = -0.6;
  const cardOffsetX = 0.1; // Offset for each card in the stack to the left
  const cardOffsetY = -0.1; // Offset for each card in the stack to the top
  const offsetY = 1.5; // Offset for shifting the grid down
  const cardSize = [2.5, 3, 0.01]; // Size of the square cards
  const outlineSize = cardSize.map((size, index) => size + (index < 2 ? 0.03 : 0)); // Slightly larger for outline effect

  // Generate the grid of boxes
  const boxes = [];
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const x = j * boxSpacingX + 2; // Adjusted to increment x position across the row
      const y = i * boxSpacingY + offsetY; // Adjusted to move down the rows
      const id = `card-${i * gridSize + j}`; // Generate a unique ID for each box, incrementing across rows first

      boxes.push(<Box key={id} id={id} position={[x, y, 0]} args={[0.25, 0.5, 0.01]} onHover={setHoveredCard} />);
    }
  }

  // Generate the stack of cards with outlines
  const cards = [];
  for (let k = 0; k < stackSize; k++) {
    const x = -3 + k * cardOffsetX;
    const y = 0.7 + k * cardOffsetY;
    const zCard = 0.01 * k;
    const zOutline = zCard - 0.002;
    const id = `card-${stackSize-k-1}`; // Use the same ID pattern as used for boxes

    // Card outline
    cards.push(<Box2 key={`outline-${k}`} id={id} position={[x, y, zOutline]} args={outlineSize} outline={true} hoveredCard={hoveredCard} />);
    
    // Card itself
    cards.push(<Box2 key={id} id={id} position={[x, y, zCard]} args={cardSize} hoveredCard={hoveredCard} />);
  }

  return (
    <div className="container">
      <Canvas
        shadows
        frameloop="demand"
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ width: '100vw', height: '100vh' }}
      >
        <ambientLight intensity={1} />
        <OrbitControls />
        {boxes}
        {cards}
      </Canvas>
    </div>
  );
}
