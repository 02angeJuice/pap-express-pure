import React from 'react'
import {StyleSheet, View, Text} from 'react-native'
import {path} from '../../constants/url'

import FastImage from 'react-native-fast-image'

const CustomHeader = () => {
  return (
    <View style={[styles.row, {justifyContent: 'center', gap: 0}]}>
      <FastImage
        resizeMode={FastImage.resizeMode.contain}
        source={{
          uri: `${path.IMG_LOGO}`,
          priority: FastImage.priority.normal
        }}
        style={{
          height: 48,
          width: 48,
          borderRadius: 10,
          resizeMode: 'contain'
        }}
      />

      <View>
        <Text style={[styles.super, styles.header, styles.shadowText]}>
          SUPER
        </Text>
        <Text style={[styles.sunway, styles.header, styles.shadowText]}>
          SUNWAY
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },

  header: {
    color: '#fff',
    textAlign: 'center'
  },
  super: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  sunway: {
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 0
  },
  shadowText: {
    textShadowOffset: {width: 0, height: 3},
    textShadowColor: '#000',
    textShadowRadius: 5
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2
  }
})

export default CustomHeader
