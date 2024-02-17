import './index.css'

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