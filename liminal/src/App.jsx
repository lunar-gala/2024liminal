// utilities
import './App.css'
import { fonts, map, constrain, Cover } from './index.js'
import { createNoise2D } from 'simplex-noise'

// react imports
import React, 
{ Suspense, 
  Children, 
  useLayoutEffect, 
  useMemo, 
  useState, 
  useRef 
} from "react"
import { 
  Stats, 
  Text, 
  Loader, 
  useTexture, 
  useGLTF, 
  Shadow 
} from '@react-three/drei'
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber"

// nav
/**import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom" */
import { useLocation, Switch, Route } from "wouter"
import { createBrowserHistory } from 'history';
import { useTransition } from "@react-spring/core"
import { a } from "@react-spring/three"

const noise = createNoise2D();
const d = 5;
const history = createBrowserHistory()

function chimesMoveFunction(state, ref) {

    let theta_z = ((noise(state.clock.elapsedTime / 2 - position[0] / 10, id/10) + 0.5) / 10)
    let theta_x = noise(state.clock.elapsedTime / 2 - position[0] / 10 + 1000, id/10) / 20
    // console.log(theta)
    ref.current.rotation.z = theta_z
    ref.current.rotation.x = theta_x
    ref.current.position.x = position[0] + 2*d*Math.sin(theta_z/2)*Math.cos(theta_z/2)
    ref.current.position.y = 2*d*Math.sin(theta_z/2)*Math.sin(theta_z/2) + 2*d*Math.sin(theta_x/2)*Math.sin(theta_x/2)
    ref.current.position.z = 2*d*Math.sin(-theta_x/2)*Math.cos(-theta_x/2)

}

const Pane = ({ position, size, moveFunction, id }) => {

  const state = useThree()
  const ref = useRef()

  useFrame(({ delta, pointer }) => {
    if (moveFunction != null) moveFunction(state, ref);
  })

  return (
    <mesh position = {position} ref = {ref} onPointerDown = { (e) => redirect(id) }>
      
      <boxGeometry args={size}/>
      <meshStandardMaterial color={"#E4F2F4"} />
    </mesh>
  )
}

const App = () => {

  // Current route
  const [location] = useLocation()

  const go_in = {
    from: { position: [0, 0, -50], rotation: [0, 0, 0], scale: [0, 0, 0], opacity: 0 },
    enter: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1], opacity: 1 },
    leave: { position: [0, 0, 100], rotation: [0, 0, 0], scale: [0, 0, 0], opacity: 0 },
    config: /*() => (n) => n === "opacity" &&*/ { friction: 1000, duration: 1000 },
  }

  const go_out = {
    from: { position: [0, 0, 50], rotation: [0, 0, 0], scale: [0, 0, 0], opacity: 0 },
    enter: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1], opacity: 1 },
    leave: { position: [0, 0, -100], rotation: [0, 0, 0], scale: [0, 0, 0], opacity: 0 },
    config: /*() => (n) => n === "opacity" &&*/ { friction: 1000, duration: 1000 },
  }

  const transition_settings = location == '/' ? go_out : go_in;
  
  // Animated shape props
  const transition = useTransition(location, transition_settings)
  return (
    <>
      <Cover>
        <Canvas camera={{ position: [0, 0, 20], fov: 50 }}>
          <ambientLight intensity={1}/>
          <directionalLight position={[0, 0, 5]} intensity={0.5} />
          <Suspense fallback={null}>
            <Pages transition={transition} />
          </Suspense>
        </Canvas>
      </Cover>
      {/* <Nav /> */}
      <Loader />
    </>
  )

}
export default App


/**
 * NAV
 */

const AuthPages = {
  "about": true,
  "tix": true,
  "people": true,
  "lines": true,
};


function Pages({ transition }) {

  return transition(({ opacity, ...props }, location) => (
    <a.group {...props}>
      <Switch location={location}>
        <Route path="/">
          <HomePage />
        </Route>
        <Route path="/about">
          <AboutPage />
          <Sensor />
        </Route>
        <Route path="/tickets">
          <TixPage />
          <Sensor />
        </Route>
        <Route path="/people">
          <PeoplePage />
          <Sensor />
        </Route>
        <Route path="/lines">
          <LinesPage />
          <Sensor />
        </Route>
      </Switch>
    </a.group>
  ))
}

function redirect(id) {
  const pages = ["about", "tickets", "people", "lines"];
  console.log(pages[id])

  const location = {
    pathname: "/" + pages[id],
    state: { fromDashboard: true }
  }

  return history.replace(location)
}

function sendBack() {
  return history.replace("/")
}

// mesh element that covers the screen and calls sendBack() 
// when the mouse is lifted
function Sensor() {
  return (
    <mesh position = {[0, 0, 0]} onPointerUp = { (e) => sendBack() }>
      <boxGeometry args={[100, 100, 0.1]}/>
      <meshPhongMaterial color={"pink"} opacity={0} transparent />
    </mesh>
  )
}

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
// NEED TO IMLPEMENT
function PrivateRoute({ children, page, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        AuthPages.page ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

/**
 * SUB-PAGES
 * should go in seperate files
 */

function HomePage() {

  const panes = []
  for (let i=0; i<4; i++){
    let position = [map(i, 0, 4, -6, 6), 0, 0]
    let size = [1, 7, 0.05]
    let force = null // noise(state.clock.elapsedTime + position[0], 1)
    
    panes.push(<Pane position={position} size={size} moveFunction={null} key={i} id={i}/>)
  }

  return (
    <>
      <group position={[0, 0, 0]}>
        {panes}
      </group>
    </>
  )
  
}


function AboutPage() {
  const [count, setCount] = useState(0)

  const panes = []
  for (let i=0; i<8; i++){
    let position = [map(i, 0, 7, -6, 6), 0, 0]
    let size = [1, 7, 0.05]
    let force = null // noise(state.clock.elapsedTime + position[0], 1)
    
    panes.push(<Pane position={position} size={size} moveFunction={chimesMoveFunction} key={i} id = {i}/>)
  }

  /* text blocks */
  const about_text_1 = "it is not what is on each side of the doorway, but rather the space in between. what exists in the undefined area where one is not this nor that. "
  const about_text_2 = "you are in the space between spaces. only here, can this exist."
  const about_text_3 = "welcome to liminal"

  return (
    <>
      <ambientLight intensity={1}/>
      <directionalLight position={[0, 0, 5]} intensity={0.5} />

      <group position={[0, 0, -0.15]}>
        {panes}
      </group>

      <Text
        scale={[0.4, 0.4, 0.4]}
        position={[0, 2, 0]}
        font={fonts.RobotoMono}
        characters="abcdefghijklmnopqrstuvwxyz0123456789!"
        color="black" // default
        anchorX="center" // default
        anchorY="middle" // default
        maxWidth={32}
        textAlign="justify"
      >
        {about_text_1}
      </Text>

      <Text
        scale={[0.4, 0.4, 0.4]}
        position={[0, -1, 0]}
        font={fonts.RobotoMono}
        characters="abcdefghijklmnopqrstuvwxyz0123456789!"
        color="black" // default
        anchorX="center" // default
        anchorY="middle" // default
        maxWidth={32}
        textAlign="center"
      >
        {about_text_2}
        {'\n'}{'\n'}{'\n'}
        <Text
          position={[-2.3, -2.8, 0]}
          textAlign="center"
          color="black"
        >
        welcome   to
        </Text>
        <Text 
          font={fonts.Wordmark}
          position={[3.5, -2.8, 0]}
          color="black"
          
        >
            LIMINAL
        </Text>
      </Text>

      {/* <Stats /> */}
    </>
  )
}

function TixPage() {
  return (
    <>
      <Text>tix page</Text>
    </>
  )
}

function PeoplePage() {
  return (
    <>
      <Text>people page</Text>
      <mesh position = {[0, 0, 0]} onPointerEnter = { (e) => console.log('enter') }>
      
        <boxGeometry args={[10, 10, 0.1]}/>
        <meshPhongMaterial color={"pink"} opacity={1} transparent />
    </mesh>
    </>
  )
}

function LinesPage() {
  return (
    <>
      <Text>lines page</Text>
    </>
  )
}
