import React, {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  Platform,
  Modal,
  TouchableWithoutFeedback,
  KeyboardAvoidingView
} from 'react-native'

import Ionicons from 'react-native-vector-icons/Ionicons'

const ModalPartialContainer = ({
  open,
  handleOpen,
  setValue,
  value,
  isConfirm
}) => {
  const [inputValue, setInputValue] = useState(null)

  const {t} = useTranslation()

  // ----------------------------------------------------------
  // == EFFECT
  // ----------------------------------------------------------

  // ----------------------------------------------------------
  // == HANDLE
  // ----------------------------------------------------------
  const handleInputChange = (text) => {
    setValue(text)
  }

  const handleConfirm = () => {
    if (!value) {
      alertReUse('container_required', 'container_required_detail')
    } else {
      isConfirm(true)
      handleOpen(!open)
    }
  }

  const handleClosed = () => {
    handleOpen(!open)
    setValue(null)
  }

  const alertReUse = (msg, detail) => {
    Platform.OS === 'android'
      ? Alert.alert(t(msg), t(detail))
      : alert(t(msg), t(detail))
  }

  // ----------------------------------------------------------
  // == MAIN
  // ----------------------------------------------------------
  return (
    <Modal
      visible={open}
      transparent={true}
      statusBarTranslucent={true}
      // // animationType="fade"
      onRequestClose={handleClosed}>
      {/* <TouchableWithoutFeedback onPress={handleClosed}> */}
      <View style={styles.ModalPartialContainer}>
        <KeyboardAvoidingView style={{flex: 1}} behavior="padding">
          <View style={styles.container}>
            <View style={styles.nav}>
              <Text style={[styles.textNav, {fontSize: 20}]}>
                {t('item_container')}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleClosed}>
                <Ionicons name="close" size={25} color="#fff" />
              </TouchableOpacity>
            </View>

            <View
              style={{
                marginVertical: 5,
                paddingHorizontal: 10,
                paddingVertical: 5,
                backgroundColor: '#fff',
                borderRadius: 5
              }}>
              <TextInput
                onChangeText={handleInputChange}
                style={styles.textInput}
                // defaultValue={container_no}
                value={value}
                placeholder={t('enter_container')}
                placeholderTextColor="#000"
                selectTextOnFocus={true}
                keyboardType="numeric"
              />
            </View>

            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end',

                alignItems: 'center',
                // width: '95%',
                gap: 10
              }}>
              <TouchableOpacity
                style={[
                  styles.row,
                  styles.button,
                  {justifyContent: 'center', backgroundColor: '#FFE7E7'}
                ]}
                onPress={handleClosed}>
                <Ionicons
                  style={{alignSelf: 'center'}}
                  name={'close-outline'}
                  size={20}
                  color={'#E20000'}
                />
                <Text style={styles.textButton}>{t('cancel')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.row,
                  styles.button,
                  {justifyContent: 'center', backgroundColor: '#E7FFDF'}
                ]}
                onPress={handleConfirm}>
                <Ionicons
                  style={{alignSelf: 'center'}}
                  name={'checkmark-outline'}
                  size={20}
                  color={'#24A000'}
                />
                <Text style={styles.textButton}>{t('confirm')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
      {/* </TouchableWithoutFeedback> */}
    </Modal>
  )
}

// ----------------------------------------------------------
// == STYLE
// ----------------------------------------------------------
const styles = {
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  ModalPartialContainer: {
    flex: 1,
    paddingTop: 25,
    paddingBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  nav: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#AE100F',
    borderRadius: 5
  },
  textNav: {
    flex: 1,
    fontSize: 18,
    color: 'white',
    paddingVertical: 15,
    paddingHorizontal: 10
  },
  closeButton: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 15
  },
  textInput: {
    padding: 10,
    textAlign: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    fontSize: 25
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 3,
    paddingHorizontal: 5,
    paddingVertical: 10,
    alignItems: 'center'
  },
  textButton: {
    color: '#000',
    fontSize: 20
  }
}

export default React.memo(ModalPartialContainer)
