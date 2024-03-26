import React from 'react'
import {StyleSheet} from 'react-native'
import {Provider} from 'react-redux'
import {PersistGate} from 'redux-persist/integration/react'
import {NavigationContainer} from '@react-navigation/native'

import {store, persistor} from './src/store/store.js'

import {ThemeProvider} from '@rneui/themed'
import {ToastProvider} from 'react-native-toast-notifications'

import * as eva from '@eva-design/eva'
import {ApplicationProvider, Layout, Text} from '@ui-kitten/components'

import {I18nextProvider} from 'react-i18next'

import i18n from './src/constants/i18n.js'

import AppScreen from './src/screens'

import {RefreshContextProvider} from './src/contexts/RefreshContext.js'
import {ModalScanContextProvider} from './src/contexts/ModalScanContext.js'

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

export default () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <I18nextProvider i18n={i18n}>
          <ApplicationProvider {...eva} theme={eva.light}>
            <ThemeProvider>
              <ToastProvider
                renderType={{
                  custom_type: (toast) => (
                    <View
                      style={{
                        padding: 15,
                        backgroundColor: 'grey',
                        zIndex: 999
                      }}>
                      <Text>{toast.message}</Text>
                    </View>
                  )
                }}>
                <RefreshContextProvider>
                  <ModalScanContextProvider>
                    <NavigationContainer>
                      <AppScreen />
                    </NavigationContainer>
                  </ModalScanContextProvider>
                </RefreshContextProvider>
              </ToastProvider>
            </ThemeProvider>
          </ApplicationProvider>
        </I18nextProvider>
      </PersistGate>
    </Provider>
  )
}
