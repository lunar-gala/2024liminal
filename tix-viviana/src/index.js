import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App'
import './style.css'

createRoot(document.getElementById('root')).render(
  <>
    <App />
  </>
)

// You can ignore below. Viviana's personal note.
// ATTEMPT AT HTML OVERLAY. Doesn't allow for interaction with the 3D scene.

// function Overlay() {
//   return (
//     <div className="tix" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', width: '100%', height: '100%' }}>
//       <div className="text-wrapper">LIMINAL</div>
//       <div className="div">buy a ticket→</div>
//       <div className="text-wrapper-2">this</div>
//       <div className="text-wrapper-3">page</div>
//       <div className="text-wrapper-4">does</div>
//       <div className="text-wrapper-5">nothing.</div>
//       <div className="overlap-group">
//         <div className="text-wrapper-6">other</div>
//         <div className="text-wrapper-7">you</div>
//       </div>
//       <div className="text-wrapper-8">then</div>
//       <div className="text-wrapper-9">take</div>
//       <div className="text-wrapper-10">to</div>
//       <div className="text-wrapper-11">where</div>
//       <div className="text-wrapper-12">you</div>
//       <div className="text-wrapper-13">can</div>
//     </div>
//   )
// }

// function buyTicketButton() {
//   return (
//     <div className="buy-ticket-button">
//       <div className="overlap-group1">
//         <div className="text-wrapper-14">buy</div>
//         <div className="text-wrapper-15">ticket</div>
//       </div>
//     </div>
//   )
// }


