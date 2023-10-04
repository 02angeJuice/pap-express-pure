import React, {useEffect, useRef, useState} from 'react'
import {
  StyleSheet,
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  Alert,
  Platform,
  PermissionsAndroid
} from 'react-native'

import Ionicons from 'react-native-vector-icons/Ionicons'

import Modal from 'react-native-modal'
import {useTranslation} from 'react-i18next'

import {launchCamera, launchImageLibrary} from 'react-native-image-picker'
// import {
//   Camera,
//   CameraPermissionStatus,
//   useCameraDevices
// } from 'react-native-vision-camera'
// "react-native-vision-camera": "^2.15.3",
import {CameraRoll} from '@react-native-camera-roll/camera-roll'

const ModalCamera = ({set, visible, setVisible}) => {
  const {t} = useTranslation()

  useEffect(() => {
    requestPermission()
  }, [])

  const requestPermission = async () => {
    try {
      console.log('asking for permission')
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      ])
      if (
        granted['android.permission.CAMERA'] &&
        granted['android.permission.WRITE_EXTERNAL_STORAGE']
      ) {
        console.log('You can use the camera')
      } else {
        console.log('Camera permission denied')
      }
    } catch (error) {
      console.log('permission error', error)
    }
  }
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

  return (
    <Modal
      isVisible={visible}
      animationInTiming={1}
      animationOutTiming={1}
      onBackButtonPress={() => setVisible(!visible)}>
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 15
        }}>
        <TouchableOpacity
          onPress={__imagePicker}
          style={{
            width: 130,
            borderRadius: 4,
            backgroundColor: '#183B00',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 5,
            height: 40
          }}>
          <Ionicons name="image-outline" size={20} color="#fff" />
          <Text
            style={{
              color: '#fff',
              fontWeight: 'bold',
              textAlign: 'center'
            }}>
            {t('photo')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={__imageCamera}
          style={{
            marginTop: 100,
            width: 130,
            borderRadius: 4,
            backgroundColor: '#14274e',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 5,
            height: 40
          }}>
          <Ionicons name="camera-outline" size={20} color="#fff" />
          <Text
            style={{
              color: '#fff',
              fontWeight: 'bold',
              textAlign: 'center'
            }}>
            {t('camera')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            marginTop: 100,
            width: 130,
            borderRadius: 4,
            backgroundColor: '#AE100F',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            height: 40
          }}
          onPress={() => setVisible(!visible)}>
          <Text
            style={{
              color: '#fff',
              fontWeight: 'bold',
              textAlign: 'center'
            }}>
            {t('close')}
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 15,

    overflow: 'hidden'
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
