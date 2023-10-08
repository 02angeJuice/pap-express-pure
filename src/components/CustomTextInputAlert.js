import React, {useEffect, useState} from 'react'
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  Platform
} from 'react-native'
import Modal from 'react-native-modal'

const CustomTextInputAlert = ({
  visible,
  onClose,
  forceConfirm,
  remark = ''
}) => {
  const [inputValue, setInputValue] = useState(remark ? remark : '')

  console.log(remark?.length)
  console.log(inputValue?.length)

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
      Platform.OS === 'android'
        ? Alert.alert(
            'Text must be required...!',
            'Please specify a message for force confirm.'
          )
        : alert(
            'Text must be required...!',
            'Please specify a message for force confirm.'
          )
    }
  }

  const handleClose = () => {
    setInputValue(remark ? remark : '')
    onClose()
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
          <TouchableOpacity style={styles.button} onPress={handleConfirm}>
            <Text style={styles.textButton}>OK</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleClose}>
            <Text style={styles.textButton}>CLOSE</Text>
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
    width: 70,
    paddingVertical: 10,
    alignItems: 'center'
  },
  textButton: {
    color: '#1B73B4',
    fontSize: 16
  }
}

export default CustomTextInputAlert
