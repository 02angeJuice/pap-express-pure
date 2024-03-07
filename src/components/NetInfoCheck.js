import React, {useEffect, useState} from 'react'
import {StyleSheet, View, Text} from 'react-native'
import NetInfo from '@react-native-community/netinfo' // Import NetInfo

import {useTranslation} from 'react-i18next'

const NetInfoCheck = ({navigation}) => {
  const {t} = useTranslation()
  const [networkAvailable, setNetworkAvailable] = useState(true) // State to track network availability

  // Check network connectivity on component mount
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setNetworkAvailable(state.isConnected)
    })

    return () => unsubscribe()
  }, [])

  return (
    <>
      {!networkAvailable && (
        <View style={styles.networkOffline}>
          <Text style={styles.networkOfflineText}>
            {t('network_offline_message')}
          </Text>
        </View>
      )}
    </>
  )
}

// ----------------------------------------------------------
// == STYLE
// ----------------------------------------------------------
const styles = StyleSheet.create({
  networkOffline: {
    backgroundColor: '#FF000090',
    padding: 10,
    alignItems: 'center'
  },
  networkOfflineText: {
    color: '#fff'
  }
})

export default NetInfoCheck
