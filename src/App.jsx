// utilities
import './App.css';
import { fonts, map, constrain, Cover, Pane, redirect, sendBack } from './index.jsx';

// react imports
import React, { Suspense, useEffect, useState, useRef } from 'react';

import { Stats, Loader } from '@react-three/drei';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';

// nav
import { useLocation, Switch, Route } from 'wouter';
import { useTransition } from '@react-spring/core';
import { a } from '@react-spring/three';

// pages
import { AboutPage } from '../about/src/App.jsx';
import { TixPage } from '../tickets/src/App.jsx';
import { PeoplePage } from '../people/src/App.jsx';
import { LinesPage } from '../lines/src/App.jsx';

const App = () => {
  const [width, setWidth] = useState(window.innerWidth);
  const [showImage, setShowImage] = useState(true); // State to control image visibility

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    const timer = setTimeout(() => {
      setShowImage(false); // Hide the image after 3 seconds
    }, 6000); // 3000 ms = 3 seconds

    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
      clearTimeout(timer); // Clean up the timer
    };
  }, []);

  console.log(width);

  const isMobile = width <= 768;
  const [location] = useLocation();
  const duration = 6000;

  const go_in = {
    from: { position: [0, 0, -10], rotation: [0, 0, 0], scale: [0, 0, 0], opacity: 0 },
    enter: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1], opacity: 1 },
    leave: { position: [0, 0, 100], rotation: [0, 0, 0], scale: [0, 0, 0], opacity: 0 },
    config: () => (n) => n === 'opacity' && { friction: 1000, duration: duration },
  };

  const go_out = {
    from: { position: [0, 0, 10], rotation: [0, 0, 0], scale: [0, 0, 0], opacity: 0 },
    enter: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1], opacity: 1 },
    leave: { position: [0, 0, -100], rotation: [0, 0, 0], scale: [0, 0, 0], opacity: 0 },
    config: () => (n) => n === 'opacity' && { friction: 1000, duration: duration },
  };

  const transition_settings = location === '/' ? go_out : go_in;
  const transition = useTransition(location, transition_settings);

  return (
    <>
      {showImage && (
        <img src="/src/assets/fade.png" className="full-screen-image" alt="Full Screen" />
      )}
      <Cover>
        <Canvas camera={{ position: [0, 0, 20], fov: 50 }} gl={{ localClippingEnabled: true }} >
          <color attach="background" args={["white"]} />

          <ambientLight intensity={1}/>
          <directionalLight position={[0, 0, 5]} intensity={0.5} />
          <Suspense fallback={null}>
            <Pages transition={transition} isMobile={isMobile} />
          </Suspense>
        </Canvas>
      </Cover>
      <Loader />
    </>
  );
};

export default App;

// Additional components like Pages, Sensor, etc. remain unchanged


/**
 * NAV
 */
const AuthPages = {
  "about": true,
  "tix": true,
  "people": true,
  "lines": true,
};

function Pages({ transition, isMobile }) {
  return transition(({ opacity, ...props }, location) => (
    <a.group {...props}>
      <Switch location={location}>
        <Route path="/">
          <HomePage />
          <Sensor />
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
          <PeoplePage isMobile={isMobile} />
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
    let position = [0, map(i, 0, 4, -6, 8), 0]
    let size = [10, 0.05, 7]
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




