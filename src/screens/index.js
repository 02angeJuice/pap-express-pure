import React, {useEffect, useState} from 'react'
import {Platform, Alert, Linking} from 'react-native'
import {NavigationContainer, useNavigation} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'

import Ionicons from 'react-native-vector-icons/Ionicons'
import VersionCheck from 'react-native-version-check'

import LoadToTruck from './loadtotruck/LoadToTruck'
import UnloadFromTruck from './unloadfromtruck/UnloadFromTruck'
import Distribution from './distribution/Distribution'
import ScanReceive from './scanreceive/ScanReceive'

import UserProfile from './UserProfile'
import DistributeDetail from './distribution/DistributeDetail'
import ScanReceiveDetail from './scanreceive/ScanReceiveDetail'

import CustomHeader from './header/CustomHeader'
import LanguageFlags from './header/LanguageFlags'
import Home from './bottomTab/Home'
import Info from './bottomTab/Info'
import Login from './Login'

import {screenMap} from '../constants/screenMap'
import {useTranslation} from 'react-i18next'
import {useAuthToken, useSettings} from '../hooks'
import {checkVersion} from '../apis'
import {path} from '../constants/url'
import {useDispatch} from 'react-redux'
import {resetToken} from '../store/slices/tokenSlice'
import {CheckOnlineWeb} from '../apis/loginApi'

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

const Screen = ({navigation}) => {
  const {t, i18n} = useTranslation()
  const {language} = useSettings()
  const {refresh} = useAuthToken()
  const [auth, setAuth] = useState(false)

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
  }

  const checkVersion_API = async () => {
    try {
      const res = await checkVersion()
      const {version} = res?.data[0]

      console.log(
        path.APK_DOWNLOAD + `app-release.apk?time=${new Date().getTime()}`
      )

      if (VersionCheck.getCurrentVersion() !== version) {
        Platform.OS === 'android'
          ? Alert.alert(t('version'), t('version_detail'), [
              {
                text: t('cancel'),
                style: 'cancel'
              },
              {
                text: t('confirm'),
                onPress: () =>
                  Linking.openURL(
                    path.APK_DOWNLOAD +
                      `app-release.apk?time=${new Date().getTime()}`
                  )
              }
            ])
          : console.log(
              path.APK_DOWNLOAD + `app-release.apk?time=${new Date().getTime()}`
            )

        // Linking.openURL(path.APK_DOWNLOAD + '/app-release.apk')
      }
    } catch (error) {
      console.log(error)
    }
  }

  // ----------------------------------------------------------
  // == EFFECT
  // ----------------------------------------------------------
  useEffect(() => {
    language && i18n.changeLanguage(language)
    checkVersion_API()
    // checkRefreshToken()
    // navigation.navigate('Login')
  }, [])

  // ----------------------------------------------------------
  // == MAIN
  // ----------------------------------------------------------

  if (!refresh) {
    return <Login />
  } else {
    return (
      <Stack.Navigator
        screenOptions={{
          animationEnabled: false,
          headerTintColor: '#fff',
          headerStyle: {backgroundColor: '#AE100F'}
        }}>
        <Stack.Screen
          options={{
            headerTitle: (props) => <CustomHeader {...props} />,
            headerRight: (props) => <LanguageFlags {...props} />
          }}
          name={screenMap.HomePage}>
          {() => (
            <Tab.Navigator
              screenOptions={({route}) => ({
                tabBarIcon: ({focused, color, size}) => {
                  let iconName

                  if (route.name === 'Home') {
                    iconName = focused ? 'home' : 'home-outline'
                  } else if (route.name === 'Information') {
                    iconName = focused ? 'person' : 'person-outline'
                  } else if (route.name === 'Settings') {
                    iconName = focused ? 'list' : 'list-outline'
                  }

                  return <Ionicons name={iconName} size={size} color={color} />
                },

                tabBarActiveTintColor: '#ED2B2A',
                tabBarInactiveTintColor: 'gray'
              })}>
              <Tab.Screen
                name="Home"
                component={Home}
                options={{
                  title: t('home'),
                  headerShown: false
                }}
              />

              <Tab.Screen
                name="Information"
                component={Info}
                options={{
                  title: t('info'),
                  headerShown: false
                }}
              />
            </Tab.Navigator>
          )}
        </Stack.Screen>

        <Stack.Screen
          options={{headerShown: false}}
          name={screenMap.Login}
          component={Login}
        />

        <Stack.Screen
          options={{title: t('load_to_truck')}}
          name={screenMap.LoadToTruck}
          component={LoadToTruck}
        />

        <Stack.Screen
          options={{
            title: t('unload_from_truck')
          }}
          name={screenMap.UnloadFromTruck}
          component={UnloadFromTruck}
        />

        <Stack.Screen
          options={{title: t('distribution')}}
          name={screenMap.Distribution}
          component={Distribution}
        />

        <Stack.Screen
          options={{
            title: t('scan_receive')
          }}
          name={screenMap.ScanReceive}
          component={ScanReceive}
        />

        <Stack.Screen
          options={{title: t('personal_info')}}
          name={screenMap.UserProfile}
          component={UserProfile}
        />

        <Stack.Screen
          options={{
            title: t('distribution')
          }}
          name={screenMap.DistributeDetail}
          component={DistributeDetail}
        />

        <Stack.Screen
          options={{
            title: t('scan_receive')
          }}
          name={screenMap.ScanReceiveDetail}
          component={ScanReceiveDetail}
        />
      </Stack.Navigator>
    )
  }
}

export default Screen
