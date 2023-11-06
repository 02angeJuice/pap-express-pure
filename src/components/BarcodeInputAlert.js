import React, {useEffect, useState, useRef} from 'react'
import {useTranslation} from 'react-i18next'
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Modal,
  KeyboardAvoidingView
} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

const BarcodeInputAlert = ({visible, onClose, item_no, setBarcode}) => {
  const [inputValue, setInputValue] = useState('')
  const {t} = useTranslation()

  // ----------------------------------------------------------
  // == EFFECT
  // ----------------------------------------------------------

  // ----------------------------------------------------------
  // == HANDLE
  // ----------------------------------------------------------
  const handleInputChange = (text) => {
    setInputValue(text)
  }

  const handleConfirm = () => {
    setBarcode(`${item_no}/${inputValue}`)
    setInputValue('')
    onClose()
  }

  const handleClose = () => {
    setInputValue('')
    onClose()
  }

  // ----------------------------------------------------------
  // == MAIN
  // ----------------------------------------------------------
  return (
    <Modal
      visible={visible}
      transparent={true}
      statusBarTranslucent={true}
      onRequestClose={handleClose}>
      {/* <TouchableWithoutFeedback onPress={handleClose}> */}
      <View style={styles.modalContainer}>
        <KeyboardAvoidingView style={{flex: 1}} behavior="padding">
          <View style={styles.container}>
            <View style={styles.nav}>
              <Text style={styles.textNav}>{t('enter_barcode_title')}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleClose}>
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
                value={inputValue}
                placeholder={t('enter_barcode_box')}
                placeholderTextColor="#999"
                selectTextOnFocus={true}
                // autoFocus={true}
                // showSoftInputOnFocus={true}
                keyboardType="numeric"
              />
            </View>

            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: 10
              }}>
              <TouchableOpacity
                style={[
                  styles.row,
                  styles.button,
                  {justifyContent: 'center', backgroundColor: '#FFE7E7'}
                ]}
                onPress={handleClose}>
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
  modalContainer: {
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
    fontSize: 16
  }
}

export default React.memo(BarcodeInputAlert)
