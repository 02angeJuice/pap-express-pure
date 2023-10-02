import React from 'react'
import {StyleSheet, View} from 'react-native'
import {Provider} from 'react-redux'
import {PersistGate} from 'redux-persist/integration/react'

import {store, persistor} from './src/store/store.js'

import {PaperProvider} from 'react-native-paper'
import {ToastProvider} from 'react-native-toast-notifications'

import {I18nextProvider} from 'react-i18next'

import i18n from './src/constants/i18n.js'

import AppContainer from './src/screens/AppContainer.js'
import Login from './src/screens/Login.js'

import {RefreshContextProvider} from './src/contexts/RefreshContext.js'
import {ModalScanContextProvider} from './src/contexts/ModalScanContext.js'
import {useAuthToken} from './src/hooks/index.js'

const App = () => {
  const {refresh} = useAuthToken()

  // return <AppContainer />

  if (refresh) {
    return (
      <View style={styles.container}>
        <AppContainer />
      </View>
    )
  } else {
    return (
      <View style={styles.container}>
        <Login />
      </View>
    )
  }
}

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
          <PaperProvider>
            <ToastProvider>
              <RefreshContextProvider>
                <ModalScanContextProvider>
                  <App />
                </ModalScanContextProvider>
              </RefreshContextProvider>
            </ToastProvider>
          </PaperProvider>
        </I18nextProvider>
      </PersistGate>
    </Provider>
  )
}
