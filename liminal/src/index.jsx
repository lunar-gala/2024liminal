import './index.css'
import styled from "styled-components"
import { a } from "@react-spring/web"
import React, { useRef } from "react"
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber"

const fonts = {
    Kumuna: "/fonts/Kommuna/Kommuna Demo 400 Narrow.otf",
    RobotoMono: "/fonts/RobotoMono/RobotoMono-VariableFont_wght.ttf",
    Wordmark: "/fonts/Wordmark/NewEdge666-Regular.otf",
    Wordmark_Rounded: "/fonts/Wordmark/NewEdge666-RegularRounded.otf",
}

const map = (val, ilo, ihi, olo, ohi) => { 
    return olo + ((val - ilo) / (ihi - ilo)) * (ohi - olo)
}
  
const constrain = (val, lo, hi) => { 
    if (lo < val && val < hi) return val
    if (val <= lo) return lo
    if (val >= hi) return hi
}

const Cover = styled(a.div)`
  position: absolute;
  will-change: background, transform;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`

const Pane = ({ position, size, moveFunction, id }) => {

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
        <meshStandardMaterial color={"#E4F2F4"} />
        </mesh>
    )
}

export { fonts, map, constrain, Cover, Pane}