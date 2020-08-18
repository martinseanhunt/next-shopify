const theme = {
  breakpoints: {
    xs: '352px',
    s: '580px',
    m: '829px',
    l: '1025px',
    xl: '1201px'
  },
  layout: {
    maxWidth: 1200,
    gutters: 15,
    verticalRythm: 30
  },
  colors: {
    white: '#fff',
    transparentWhite: 'rgba(255,255,255,0.3)',
    lessTransparentWhite: 'rgba(255,255,255,0.7)',
    gooderyBeige: '#f5f0ea',
    beigeHighlight: '#ede4d8',
    lightBeige: '#F7F5F0',
    lightGrey: '#e6e6e6',
    medGrey: '#d4d4d4',
    medDarkGrey: '#9c9c9c',
    darkGrey: '#1F1F1F',
    transparentBlack: 'rgba(0,0,0,0.2)',
    darkTransparentBlack: 'rgba(0,0,0,0.6)',
  },
  fonts: {
    base: {
      fontSize: '10px',
      fontFamily: '"Roboto", sans-serif',
    },
    s: {
      fontSize: '1.1rem',
      lineHeight: 1.6
    },
    m: {
      fontSize: '1.4rem',
      lineHeight: 1.8
    },
    ml: {
      fontSize: '1.6rem',
    },
    l: {
      fontSize: '2rem',
      lineHeight: 1.5
    },
    xl: { 
      fontSize: '4rem',
    },
    xxl: { 
      fontSize: '6rem',
    },
    weights: {
      heavyBold: 900,
      bold: 700,
      medium: 400,
      regular: 300
    },
  }
}

export default theme
