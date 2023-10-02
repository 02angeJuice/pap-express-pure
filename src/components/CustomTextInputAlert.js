import React, {useState} from 'react'
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  Platform
} from 'react-native'
import Modal from 'react-native-modal'

const CustomTextInputAlert = ({visible, onClose, forceConfirm}) => {
  const [inputValue, setInputValue] = useState('')

  const handleInputChange = text => {
    setInputValue(text)
  }

  const handleConfirm = () => {
    if (inputValue.length > 0) {
      onClose()
      forceConfirm(inputValue, 1)
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
    setInputValue('')
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
          maxLength={150}
          style={styles.textInput}
          onChangeText={handleInputChange}
          value={inputValue}
          placeholder="Write a message..."
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
    // alignItems: 'center',
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  textInput: {
    alignSelf: 'center',
    width: '90%',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    marginBottom: 10
  },
  button: {
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 3,
    width: 55,
    alignItems: 'center'
  },
  textButton: {
    color: '#1B73B4'
  }
}

export default CustomTextInputAlert
