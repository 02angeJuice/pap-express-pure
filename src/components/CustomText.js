import React from 'react'
import {StyleSheet, Text} from 'react-native'

const CustomText = ({size, color, text, style}) => {
  const textStyle = () => {
    if (size === 'xl') {
      return styles.xl
    }
    if (size === 'lg') {
      return styles.lg
    }
    if (size === 'md') {
      return styles.md
    }
    if (size === 'sm') {
      return styles.sm
    }

    if (size === 'xs') {
      return styles.xs
    }
  }

  return (
    <Text style={[textStyle(), {color: color || '#000'}, {...style}]}>
      {text}
    </Text>
  )
}

const styles = StyleSheet.create({
  xl: {
    fontSize: 32
  },
  lg: {
    fontSize: 24
  },
  md: {
    fontSize: 20
  },
  sm: {
    fontSize: 16
  },
  xs: {
    fontSize: 12
  }
})

export default CustomText
