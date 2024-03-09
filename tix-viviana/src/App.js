import { Canvas} from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import Typography from './Typography.js'
import Lens from './Lens.js'
import TicketButtonHTML from './TicketButtonHTML.js'


export default function App() {
  return (
    <Canvas camera={{ position: [0, 0, 20], fov: 15 }}>
        <Lens>
        <Typography />
          {/** Preload is a helper that pre-emptively makes threejs aware of all geometries, textures etc
               By default threejs will only process objects if they are "seen" by the camera leading 
               to jank as you scroll down. With <Preload> that's solved. They get loaded immediately.  */}
          <Preload />
        </Lens>
    </Canvas>
  )
}