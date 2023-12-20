import React, {useEffect} from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  PermissionsAndroid,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native'

import Ionicons from 'react-native-vector-icons/Ionicons'

import {useTranslation} from 'react-i18next'

import {launchCamera, launchImageLibrary} from 'react-native-image-picker'

import {CameraRoll} from '@react-native-camera-roll/camera-roll'

const ModalCamera = ({set, visible, setVisible}) => {
  const {t} = useTranslation()

  // ----------------------------------------------------------
  // == EFFECT
  // ----------------------------------------------------------

  // ----------------------------------------------------------
  // == HANDLE
  // ----------------------------------------------------------
  // const requestPermission = async () => {
  //   try {
  //     console.log('asking for permission')
  //     const granted = await PermissionsAndroid.requestMultiple([
  //       PermissionsAndroid.PERMISSIONS.CAMERA,
  //       PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
  //     ])
  //     if (
  //       granted['android.permission.CAMERA'] &&
  //       granted['android.permission.WRITE_EXTERNAL_STORAGE']
  //     ) {
  //       console.log('You can use the camera')
  //     } else {
  //       console.log('Camera permission denied')
  //     }
  //   } catch (error) {
  //     console.log('permission error', error)
  //   }
  // }

  const options = {
    mediaType: 'photo',
    includeBase64: false,
    maxHeight: 2000,
    maxWidth: 2000,
    quality: 0.3
  }

  const __imagePicker = async () => {
    const result = await launchImageLibrary(options)
    if (!result?.didCancel) {
      console.log(result?.assets[0]?.uri)

      set(result?.assets[0]?.uri)
      setVisible(!visible)
    }
  }

  const __imageCamera = async () => {
    const result = await launchCamera(options)
    console.log(result)

    if (!result?.didCancel) {
      console.log(result?.assets[0]?.uri)

      await CameraRoll.save(result?.assets[0]?.uri, {
        type: 'photo'
      })

      set(result?.assets[0]?.uri)
      setVisible(!visible)
    }
  }

  // ----------------------------------------------------------
  // == MAIN
  // ----------------------------------------------------------
  return (
    <Modal
      // animationType="fade"
      visible={visible}
      transparent={true}
      statusBarTranslucent={true}
      onRequestClose={() => setVisible(!visible)}>
      {/* <TouchableWithoutFeedback onPress={() => setVisible(!visible)} > */}
      <View style={styles.modalContainer}>
        <View style={{flex: 1}}></View>
        <View
          style={{
            flex: 0.8,
            backgroundColor: '#fff',
            paddingTop: 20,
            gap: 7,
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            borderRadius: 15
          }}>
          <TouchableOpacity
            onPress={__imagePicker}
            style={{
              width: '90%',
              borderRadius: 4,
              backgroundColor: '#183B00',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 5,
              height: 50
            }}>
            <Ionicons name="image-outline" size={20} color="#fff" />
            <Text
              style={{
                color: '#fff',
                fontWeight: 'bold',
                textAlign: 'center',
                fontSize: 20
              }}>
              {t('photo')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={__imageCamera}
            style={{
              width: '90%',
              borderRadius: 4,
              backgroundColor: '#14274e',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 5,
              height: 50
            }}>
            <Ionicons name="camera-outline" size={20} color="#fff" />
            <Text
              style={{
                color: '#fff',
                fontWeight: 'bold',
                textAlign: 'center',
                fontSize: 20
              }}>
              {t('camera')}
            </Text>
          </TouchableOpacity>

          <View
            style={{
              flex: 1,
              width: '90%',
              justifyContent: 'flex-end',
              marginBottom: 10
            }}>
            <TouchableOpacity
              style={{
                // marginTop: 20,

                borderRadius: 4,
                backgroundColor: '#fff',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',

                height: 40,
                borderWidth: 1,
                borderColor: '#999'
              }}
              onPress={() => setVisible(!visible)}>
              <Text
                style={{
                  color: '#000',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  fontSize: 20
                }}>
                {t('close')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {/* </TouchableWithoutFeedback> */}
    </Modal>
  )
}

// ----------------------------------------------------------
// == STYLE
// ----------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 15,
    overflow: 'hidden'
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
    flexDirection: 'row'
  },
  column: {
    display: 'flex',
    flexDirection: 'column'
  },

  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777'
  },
  textBold: {
    fontWeight: '500',
    color: '#000'
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)'
  },
  buttonTouchable: {
    padding: 16
  },

  buttonPreview: {
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#FFF',
    padding: 5,

    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4
  }
})

export default ModalCamera
