import { useThree } from '@react-three/fiber'
import { Html, Text } from '@react-three/drei'

export default function TicketButton() {
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
        <Text children="buy a ticket→"  
          position={[width/2, -height/2, 10]} 
          {...buyATicketProps} />
      </>
    )
  }