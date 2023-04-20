import { styled, Heading, Text } from '@ig-ui/react'

export const Container = styled('div', {
  maxWidth: 'calc(100vw - (100vw - 1160px) / 2)',
  marginLeft: 'auto',
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  gap: '$20',
})

export const BackgroundGrid = styled('div', {
  position: 'absolute',
  zIndex: -1,
  left: 'calc((100vw - 1340px) / 2)',
  maxWidth: 'calc(100vw - (100vw - 1160px) / 2)',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  overflow: 'hidden',

  img: {
    objectFit: 'cover',
  },

  '@media(max-width: 600px)': {
    left: 0,
    maxWidth: '100vw',
  },
})

export const Hero = styled('div', {
  maxWidth: 480,
  padding: '0 $10',

  [`> ${Heading}`]: {
    '@media(max-width: 600px)': {
      fontSize: '$6xl',
    },
  },

  [`> ${Text}`]: {
    marginTop: '$2',
    color: '$gray200',
  },
})

export const Preview = styled('div', {
  paddingRight: '$8',
  overflow: 'hidden',

  '@media(max-width: 600px)': {
    display: 'none',
  },
})
