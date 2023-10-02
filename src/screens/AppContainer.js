import React, {useEffect} from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'

import Ionicons from 'react-native-vector-icons/Ionicons'

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

import {screenMap} from '../constants/screenMap'
import {useTranslation} from 'react-i18next'
import {useSettings} from '../hooks'

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

const AppContainer = () => {
  const {t, i18n} = useTranslation()
  const {language} = useSettings()

  // == EFFECT
  // =================================================================
  useEffect(() => {
    language && i18n.changeLanguage(language)
  }, [])

  // == COMPONENT AppContainer
  // =================================================================
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          animationEnabled: false,
          // gestureEnabled: true,
          // gestureDirection: 'horizontal',
          // ...TransitionPresets.SlideFromRightIOS,
          // headerMode: 'float',
          // headerMode: 'screen',
          headerTintColor: '#fff',
          headerStyle: {backgroundColor: '#AE100F'}
        }}>
        <Stack.Screen
          options={{
            // title: <CustomHeader />,
            // headerTitleAlign: 'center',
            headerTitle: (props) => <CustomHeader {...props} />,
            headerRight: (props) => <LanguageFlags {...props} />
            // header: (props) => <CustomHeader {...props} />,
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
    </NavigationContainer>
  )
}

export default AppContainer
