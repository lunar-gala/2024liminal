import { useThree } from '@react-three/fiber'
import { Html, Text } from '@react-three/drei'
import './style.css'

export default function TicketButtonHTML({changeStore}) {
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
        <Html position={[width - 1, -height + 0.05, -5]} >
            <a 
              href="https://www.eventbrite.com/e/tech-together-new-york-2021-tickets-161462119315" 
              target="_blank" 
              rel="noreferrer"
              className="ticket-button"
              onMouseOver={() => {
                changeStore()
                }
              }
              onMouseOut={() => {
                changeStore()
                }
              }>
              buy a ticket→
            </a>

        </Html>
      </>
    )
  }