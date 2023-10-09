import React, {useState} from 'react'
import {useTranslation} from 'react-i18next'
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  Platform
} from 'react-native'

import Ionicons from 'react-native-vector-icons/Ionicons'

import Modal from 'react-native-modal'

const CustomTextInputAlert = ({
  visible,
  onClose,
  forceConfirm,
  remark = ''
}) => {
  const [inputValue, setInputValue] = useState(remark ? remark : '')

  const {t} = useTranslation()

  // console.log(remark?.length)
  // console.log(inputValue?.length)

  const handleInputChange = (text) => {
    setInputValue(text)
  }

  const handleConfirm = () => {
    if (
      inputValue.length > remark?.length &&
      remark?.length !== inputValue?.length
    ) {
      onClose()
      forceConfirm(`${inputValue}\n`, 1)
    } else {
      alertReUse('text_required', 'text_required_detail')
    }
  }

  const handleClose = () => {
    setInputValue(remark ? remark : '')
    onClose()
  }

  const alertReUse = (msg, detail) => {
    Platform.OS === 'android'
      ? Alert.alert(t(msg), t(detail))
      : alert(t(msg), t(detail))
  }

  return (
    <Modal
      isVisible={visible}
      animationIn={'pulse'}
      onBackButtonPress={handleClose}>
      <View style={styles.container}>
        <TextInput
          multiline
          numberOfLines={5}
          maxLength={500}
          style={styles.textInput}
          onChangeText={handleInputChange}
          value={inputValue}
          placeholder="Write a message..."
          placeholderTextColor="#000"
        />
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',

            alignItems: 'center',
            width: '95%',
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
    </Modal>
  )
}

const styles = {
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
    // alignItems: 'center'
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  textInput: {
    alignSelf: 'center',
    width: '90%',
    height: '35%',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 10,
    color: '#000',
    justifyContent: 'flex-start',
    fontSize: 18
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 3,
    // width: 70,
    paddingHorizontal: 5,
    paddingVertical: 10,
    alignItems: 'center'
  },
  textButton: {
    color: '#000',
    fontSize: 16
  }
}

export default CustomTextInputAlert
