// utilities
import './App.css'
import { fonts, map, constrain, Cover, Pane } from './index.js'

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
import { useLocation, Switch, Route } from "wouter"
import { createBrowserHistory } from 'history';
import { useTransition } from "@react-spring/core"
import { a } from "@react-spring/three"

// pages
import { AboutPage } from "../about/src/App.jsx"
import { TixPage } from "../tickets/src/App.jsx"
import { PeoplePage } from "../people/src/App.jsx"
import { LinesPage } from "../lines/src/App.jsx"

const history = createBrowserHistory()

const App = () => {

  // Current route
  const [location] = useLocation()

  // transition duration
  const duration = 2000;

  const go_in = {
    from: { position: [0, 0, -10], rotation: [0, 0, 0], scale: [0, 0, 0], opacity: 0 },
    enter: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1], opacity: 1 },
    leave: { position: [0, 0, 100], rotation: [0, 0, 0], scale: [0, 0, 0], opacity: 0 },
    config: () => (n) => n === "opacity" && { friction: 1000, duration: duration },
  }

  const go_out = {
    from: { position: [0, 0, 10], rotation: [0, 0, 0], scale: [0, 0, 0], opacity: 0 },
    enter: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1], opacity: 1 },
    leave: { position: [0, 0, -100], rotation: [0, 0, 0], scale: [0, 0, 0], opacity: 0 },
    config: () => (n) => n === "opacity" && { friction: 1000, duration: duration },
  }

  const transition_settings = (location == '/') ? go_out : go_in;
  
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
          {/* <Sensor /> */}
        </Route>
        <Route path="/about">
          <AboutPage />
          {/* <Sensor /> */}
        </Route>
        <Route path="/tickets">
          <TixPage />
          {/* <Sensor /> */}
        </Route>
        <Route path="/people">
          <PeoplePage />
          {/* <Sensor /> */}
        </Route>
        <Route path="/lines">
          <LinesPage />
          {/* <Sensor /> */}
        </Route>
      </Switch>
      <Sensor />
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
    <mesh 
      position = {[0, 0, 0]} 
      onPointerUp = { (e) => sendBack() } 
      onClick = { (e) => sendBack() }
    >
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




