import { Box, Text, styled } from '@ig-ui/react'
import Skeleton from 'react-loading-skeleton'

export const Container = styled(Box, {
  margin: '$6 auto 0',
  padding: 0,
  display: 'grid',
  maxWidth: '100%',
  position: 'relative',

  variants: {
    isTimePickerOpen: {
      true: {
        gridTemplateColumns: '1fr 280px',

        '@media(max-width: 900px)': {
          width: 540,
          gridTemplateColumns: '1fr',
        },
      },
      false: {
        width: 540,
        gridTemplateColumns: '1fr',
      },
    },
  },
})

export const TimePicker = styled('div', {
  padding: '$6 $6 0',

  '@media(min-width: 901px)': {
    borderLeft: '1px solid $gray600',
    overflowY: 'auto',

    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: 280,
  },

  '&::-webkit-scrollbar': {
    width: '$1',
  },

  '&::-webkit-scrollbar-thumb': {
    background: '$gray500',
    borderRadius: '$md',
  },

  '&::-webkit-scrollbar-track': {
    background: '$gray600',
    borderRadius: '$md',
  },
})

export const TimePickerHeader = styled(Text, {
  fontWeight: '$medium',

  span: {
    color: '$gray200',
  },
})

export const TimePickerList = styled('div', {
  marginTop: '$3',
  display: 'grid',
  alignItems: 'flex-start',
  gridTemplateColumns: '1fr',
  gap: '$2',
  paddingBottom: '$6',

  '@media(max-width: 900px)': {
    gridTemplateColumns: '1fr 1fr',
  },
})

export const TimePickerItem = styled('button', {
  border: 0,
  outline: 0,
  background: '$gray600',
  padding: '$2 0',
  cursor: 'pointer',
  color: '$gray100',
  borderRadius: '$sm',
  fontSize: '$sm',
  lineHeight: '$base',

  '&:disabled': {
    background: 'none',
    cursor: 'default',
    opacity: 0.4,
  },

  '&:not(:disabled):hover': {
    background: '$gray500',
  },

  '&:focus': {
    boxShadow: '0 0 0 2px $colors$gray100',
  },
})

export const TimePickerItemSkeleton = styled(Skeleton, {
  borderRadius: '$sm',
  height: '$10',
})
