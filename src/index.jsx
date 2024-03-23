import './index.css'
import styled from "styled-components"
import { a } from "@react-spring/web"
import React, { useRef } from "react"
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber"
import { createBrowserHistory } from 'history';
import { Text } from '@react-three/drei'

// general utils

export const max = (a, b) => {
    return a > b ? a : b
}

export const min = (a, b) => {
    return a < b ? a : b
}

export function map(val, ilo, ihi, olo, ohi) { 
    return olo + ((val - ilo) / (ihi - ilo)) * (ohi - olo)
}
  
export function constrain(val, lo, hi) { 
    if (lo < val && val < hi) return val
    if (val <= lo) return lo
    if (val >= hi) return hi
}

// nav utils
export const history = createBrowserHistory()

export const Cover = styled(a.div)`
  position: absolute;
  will-change: background, transform;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`

export function redirect(e, id, spring) {
    e.stopPropagation();

    const pages = ["about", "tickets", "people", "lines"];
    console.log(id)

    const location = {
        pathname: "/" + pages[id],
        state: { fromDashboard: true }
    }

    return history.replace(location)
}
  
export function sendBack(e, spring) {
    e.stopPropagation();
    return history.replace("/")
}

// reference constants
export const fonts = {
    Kommuna: "/fonts/Kommuna/KommunaNarrow1.10.otf",
    RobotoMono: "/fonts/RobotoMono/RobotoMono-VariableFont_wght.ttf",
    Wordmark: "/fonts/Wordmark/NewEdge666-Regular.otf",
    Wordmark_Rounded: "/fonts/Wordmark/NewEdge666-RegularRounded.otf",
}

// components

export const Pane = ({ position, size, moveFunction, id, opacity }) => {

    const state = useThree()
    const ref = useRef()

    useFrame(({ delta, pointer }) => {
        if (moveFunction != null) moveFunction(position, size, id, state, ref);
    })

    return (
        <mesh 
            position = {position} 
            ref = {ref} 
            onClick = { (e) => sendBack() }
            onPointerDown = { (e) => redirect(id) } 
        >
        
        <boxGeometry args={size}/>
        <meshStandardMaterial 
            color={"#E4F2F4"} 
            opacity={opacity}
            transparent={true} 
        />
        </mesh>
    )
}

export function text2components(Component, text, size, startPosition, endPosition, justify) {
    justify = justify != null ? justify : false
  
    let textArr = text.split(" ").map((word) => word.toUpperCase()) // split and capitalize strings
    // map each word to a one-word component, with evenly distributed x positions
    let componentArr = []
  
    if (justify) {
      // lmao
      let charWidth = 0.625 * size
      let textLength = 0;
      for (let i = 0; i < textArr.length; i++) {
        textLength += textArr[i].length * charWidth
      }
  
      let targetLength = endPosition - startPosition
      let paddingNeeded = targetLength - textLength
      let spaceLength = paddingNeeded / (textArr.length-1) // for n words there are n-1 spaces
  
      let currX = 0;
      for (let i = 0; i < textArr.length; i++) {
        let word = textArr[i]
        let component = <Component 
                          fontSize={size} 
                          position={[currX - targetLength/2, 0, 0]} 
                          text={word} 
                          key={i}
                          anchorX="left"
                        />
        componentArr.push(component)
  
        currX += spaceLength + textArr[i].length * charWidth
      }
  
    } else {
      for (let i = 0; i < textArr.length; i++) {
        let word = textArr[i]
        let component = <Component 
                          fontSize={size} 
                          position={[map(i, 0, textArr.length-1, startPosition, endPosition), 0, 0]} 
                          text={word} 
                          key={i}
                          anchorX="center"
                        />
        componentArr.push(component)
      }
    }
    
    return componentArr
  }

export const RobotoMono = ({ position, width, fontSize, text, ...props }) => {
    return (
        <Text 
            fontSize={fontSize != null ? fontSize : 0.1}
            position={position != null ? position : [0,0,0]}
            font={fonts.RobotoMono}
            characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!"
            color={props.color == null ? "black" : props.color}
            anchorX={props.anchorX == null ? "center" : props.anchorX}
            anchorY={props.anchorY == null ? "middle" : props.anchorY}
            maxWidth={width != null ? width : Infinity}
            textAlign={props.textAlign == null ? "justify" : props.textAlign}
            text={text}
            onPointerOver={props.onPointerOver}
            onPointerOut={props.onPointerOut}
        />
    )
}

export const Kommuna = ({ position, width, fontSize, text, ...props }) => {
    return (
        <Text 
            fontSize={fontSize != null ? fontSize : 0.1}
            position={position != null ? position : [0,0,0]}
            font={fonts.Kommuna}
            characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789![]"
            color={props.color == null ? "black" : props.color}
            anchorX={props.anchorX == null ? "center" : props.anchorX}
            anchorY={props.anchorY == null ? "middle" : props.anchorY}
            maxWidth={width != null ? width : Infinity}
            textAlign={props.textAlign == null ? "justify" : props.textAlign}
            text={text}
        />
    )
}

export const WordMark = ({ position, width, fontSize, text, ...props }) => {
    return (
        <Text 
            fontSize={fontSize != null ? fontSize : 0.1}
            position={position != null ? position : [0,0,0]}
            font={fonts.Wordmark}
            characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!"
            color={props.color == null ? "black" : props.color}
            anchorX={props.anchorX == null ? "center" : props.anchorX}
            anchorY={props.anchorY == null ? "middle" : props.anchorY}
            maxWidth={width != null ? width : Infinity}
            textAlign={props.textAlign == null ? "justify" : props.textAlign}
            text={text}
        />
    )
}

export const WordMarkRounded = ({ position, width, fontSize, text, ...props }) => {
    return (
        <Text 
            fontSize={fontSize != null ? fontSize : 0.1}
            position={position != null ? position : [0,0,0]}
            font={fonts.Wordmark_Rounded}
            characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!"
            color={props.color == null ? "black" : props.color}
            anchorX={props.anchorX == null ? "center" : props.anchorX}
            anchorY={props.anchorY == null ? "middle" : props.anchorY}
            maxWidth={width != null ? width : Infinity}
            textAlign={props.textAlign == null ? "justify" : props.textAlign}
            text={text}
        />
    )
}

export const LIMINAL = ({viewport}) => {
    return (
        <WordMark 
            text={"LIMINAL"}
            position={[0, viewport.height * 0.45, 0]}
            fontSize={0.9}
        />
    )
}
