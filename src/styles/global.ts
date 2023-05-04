import { globalCss } from '@ig-ui/react'

export const globalStyles = globalCss({
  '*': {
    boxSizing: 'border-box',
    padding: 0,
    margin: 0,
  },

  body: {
    backgroundColor: '$gray900',
    color: '$gray100',
    '-webkit-font-smoothing': 'antialiased',

    '&::-webkit-scrollbar': {
      width: '$2',
    },

    '&::-webkit-scrollbar-thumb': {
      background: '$gray500',
      borderRadius: '$md',
    },

    '&::-webkit-scrollbar-track': {
      background: '$gray600',
      borderRadius: '$md',
    },
  },
})
