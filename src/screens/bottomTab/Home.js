import React, {useEffect} from 'react'
import {
  StyleSheet,
  StatusBar,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Platform
} from 'react-native'

import {useTranslation} from 'react-i18next'
import {useAuthToken, useSettings} from '../../hooks'
import {
  LOAD_PRODUCT,
  UNLOAD_PRODUCT,
  PAY_OUT_PRODUCT,
  SCAN
} from '../../constants/images'

import {screenMap} from '../../constants/screenMap'
import {resetToken} from '../../store/slices/tokenSlice'
import {useDispatch} from 'react-redux'

import {CheckOnlineWeb} from '../../apis/loginApi'

const Home = ({navigation}) => {
  const {t, i18n} = useTranslation()
  const {language} = useSettings()
  const {refresh} = useAuthToken()

  const dispatch = useDispatch()

  // ----------------------------------------------------------
  // == API
  // ----------------------------------------------------------
  const checkRefreshToken = async () => {
    const res = await CheckOnlineWeb(refresh)
      .then(() => {
        return true
      })
      .catch(() => {
        dispatch(resetToken())

        navigation.reset({index: 0, routes: [{name: screenMap.Login}]})
        Platform.OS === 'android'
          ? Alert.alert(t('auth_access_denied'), t('auth_access_denied_detail'))
          : alert(t('auth_access_denied'), t('auth_access_denied_detail'))

        return false
      })

    return res
  }

  // ----------------------------------------------------------
  // == EFFECT
  // ----------------------------------------------------------
  useEffect(() => {
    language !== i18n.language && i18n.changeLanguage(language)
    checkRefreshToken()
  }, [])

  const navigate = async (route) => {
    if (await checkRefreshToken()) {
      navigation.navigate(route)
    }
  }

  // ----------------------------------------------------------
  // == MAIN
  // ----------------------------------------------------------
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#AE100F" />

      <TouchableOpacity
        style={[styles.menu, styles.shadow]}
        onPress={() => navigate(screenMap.LoadToTruck)}>
        <DisplayMenu
          text={t('load_to_truck')}
          fileIcon={LOAD_PRODUCT}
          x={125}
          y={125}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.menu, styles.shadow]}
        onPress={() => navigate(screenMap.UnloadFromTruck)}>
        <DisplayMenu
          text={t('unload_from_truck')}
          fileIcon={UNLOAD_PRODUCT}
          x={125}
          y={125}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.menu, styles.shadow]}
        onPress={() => navigate(screenMap.Distribution)}>
        <DisplayMenu
          text={t('distribution')}
          fileIcon={PAY_OUT_PRODUCT}
          x={125}
          y={125}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.menu, styles.shadow]}
        onPress={() => navigate(screenMap.ScanReceive)}>
        <DisplayMenu text={t('scan_receive')} fileIcon={SCAN} x={125} y={125} />
      </TouchableOpacity>

      <View style={{width: '44%', height: 150, margin: '2%'}}></View>
    </View>
  )
}

// ----------------------------------------------------------
// == COMPONENT
// ----------------------------------------------------------
const DisplayMenu = ({text, fileIcon, x = 100, y = 100}) => {
  return (
    <View style={styles.menuItem}>
      <Image
        style={{
          width: x,
          height: y,
          resizeMode: 'contain'
        }}
        source={fileIcon}
      />
      <Text style={styles.menuText}>{text}</Text>
    </View>
  )
}

// ----------------------------------------------------------
// == STYLE
// ----------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    gap: 2,
    marginTop: 10,
    backgroundColor: '#F2F2F2'
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  menu: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '44%',
    height: 150,
    margin: '2%'
  },
  menuItem: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: -20
  },
  menuText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#000'
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  hidden: {
    display: 'none'
  }
})

export default Home
