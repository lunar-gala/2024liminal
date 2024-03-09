import { useThree } from '@react-three/fiber'
import { Text } from '@react-three/drei'


export default function Typography() {
  const state = useThree()
  const { width, height } = state.viewport.getCurrentViewport(state.camera, [0, 0, 12])
  const shared = { 
    font: '../public/RobotoMono-VariableFont_wght.ttf',
    fontSize: 0.3,
    // fontWeight: 400, i cant get this to work.
    letterSpacing: 0, 
    color: 'black'
  }
  const liminalProps = { 
    font: '../public/NewEdge666-Regular.otf',
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