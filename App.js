import React from 'react'
import {StyleSheet} from 'react-native'
import {Provider} from 'react-redux'
import {PersistGate} from 'redux-persist/integration/react'

import {store, persistor} from './src/store/store.js'

import {PaperProvider} from 'react-native-paper'
import {ToastProvider} from 'react-native-toast-notifications'

import {I18nextProvider} from 'react-i18next'

import i18n from './src/constants/i18n.js'

import AppContainer from './src/screens/AppContainer.js'

import {RefreshContextProvider} from './src/contexts/RefreshContext.js'
import {ModalScanContextProvider} from './src/contexts/ModalScanContext.js'

const App = () => {
  return <AppContainer />
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
