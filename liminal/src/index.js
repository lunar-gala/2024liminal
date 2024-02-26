import './index.css'
import styled from "styled-components"
import { a } from "@react-spring/web"

export const fonts = {
    Kumuna: "/fonts/Kommuna/Kommuna Demo 400 Narrow.otf",
    RobotoMono: "/fonts/RobotoMono/RobotoMono-VariableFont_wght.ttf",
    Wordmark: "/fonts/Wordmark/NewEdge666-Regular.otf",
    Wordmark_Rounded: "/fonts/Wordmark/NewEdge666-RegularRounded.otf",
}

export const map = (val, ilo, ihi, olo, ohi) => { 
    return olo + ((val - ilo) / (ihi - ilo)) * (ohi - olo)
}
  
export const constrain = (val, lo, hi) => { 
    if (lo < val && val < hi) return val
    if (val <= lo) return lo
    if (val >= hi) return hi
}

export const Cover = styled(a.div)`
  position: absolute;
  will-change: background, transform;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`