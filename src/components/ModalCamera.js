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
  Platform
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
import {CameraRoll} from '@react-native-camera-roll/camera-roll'
import FastImage from 'react-native-fast-image'

const ModalCamera = ({set, visible, setVisible}) => {
  // const devices = useCameraDevices()
  // const device = devices.back
  // const [cameraPermission, setCameraPermission] = useState(
  //   CameraPermissionStatus
  // )
  // const [microphonePermission, setMicrophonePermission] = useState(
  //   CameraPermissionStatus
  // )

  // const [photo, setPhoto] = useState(null)
  // const [showCamera, setShowCamera] = useState(true)

  // const camera = useRef(null)

  const {t} = useTranslation()

  // useEffect(() => {
  //   Camera.getCameraPermissionStatus().then(setCameraPermission)
  //   Camera.getMicrophonePermissionStatus().then(setMicrophonePermission)
  // }, [])

  // useEffect(() => {
  //   permit()
  // }, [])

  // const permit = async () => {
  //   console.log('Requesting camera permission...')
  //   const permission = await Camera.requestCameraPermission()
  //   console.log(`Camera permission status: ${permission}`)

  //   if (permission === 'denied') await Linking.openSettings()
  //   // setCameraPermissionStatus(permission)
  // }

  // if (cameraPermission == null || microphonePermission == null) {
  //   // still loading
  //   return null
  // }

  // const showPermissionsPage =
  //   cameraPermission !== 'granted' || microphonePermission === 'not-determined'

  // if (device == null)
  //   return (
  //     <View>
  //       <Text>dsd</Text>
  //     </View>
  //   )

  // const __takePicture = async () => {
  //   const res = await camera.current.takePhoto({})

  //   console.log(res)
  //   setPhoto(res?.path)
  //   console.log('save')
  //   setShowCamera(false)
  // }

  // const __savePhoto = async () => {
  //   await CameraRoll.save(`file://${photo}`, {
  //     type: 'photo'
  //   })

  //   console.log('__savePhoto')
  //   setVisible(!visible)
  //   set(`file://${photo}`)
  // }

  // const __retakePicture = () => {
  //   // setCapturedImage(null)
  //   // setPreviewVisible(false)
  //   // __startCamera()

  //   setShowCamera(!showCamera)
  //   setPhoto(null)
  // }

  const options = {
    mediaType: 'photo',
    includeBase64: false,
    maxHeight: 2000,
    maxWidth: 2000,
    // title: 'Select Image',
    // cancelAnimationFrame: true,
    // // cancelButtonTitle: 'Cancel',
    // takePhotoButtonTitle: 'Take Photo',
    // chooseFromLibraryButtonTitle: 'Choose from Library',
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
    // const result = await launchImageLibrary(options)

    const result = await launchCamera(options)
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

      {/* {showCamera ? (
        <Camera
          ref={camera}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={showCamera}
          photo={showCamera}
        />
      ) : (
        // photo && (
        //   <ImageBackground
        //     source={{uri: `file://${photo}`}}
        //     style={StyleSheet.absoluteFill}
        //   />
        // )
        <CameraPreview
          photo={photo}
          save={__savePhoto}
          retake={__retakePicture}
          // retakePicture={__retakePicture}
          setVisible={setVisible}
        />
      )}

      {showCamera && (
        <View
          style={{
            flex: 1,
            width: '100%',
            backgroundColor: 'transparent',
            flexDirection: 'row'
          }}>
          <View
            style={{
              position: 'absolute',
              left: '5%',
              top: '5%',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Ionicons name="close" size={40} color="#FFF" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              flexDirection: 'row',
              flex: 1,
              width: '100%',
              // padding: 20,
              paddingBottom: 25,
              paddingHorizontal: 25,

              justifyContent: 'space-around'
            }}>
            <TouchableOpacity
              onPress={__imagePicker}
              style={{justifyContent: 'center'}}>
              <Ionicons name="images-outline" size={40} color="#FFF" />
            </TouchableOpacity>

            <View
              style={{
                alignSelf: 'center',
                flex: 1,
                alignItems: 'center'
              }}>
              <TouchableOpacity
                onPress={__takePicture}
                style={{
                  width: 70,
                  height: 70,
                  bottom: 0,
                  borderRadius: 50,
                  borderColor: '#fff',
                  borderWidth: 4,
                  backgroundColor: 'transparent'
                }}
              />
            </View>
            <TouchableOpacity
              onPress={__imageCamera}
              style={{justifyContent: 'center'}}>
              <Ionicons name="camera-outline" size={40} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      )} */}

      {/* 
      {photo && (
        <FastImage
          // style={{width: 200, height: 200}}
          style={[StyleSheet.absoluteFill, {margin: 0}]}
          source={{
            uri: `file://${photo}`,
            // headers: { Authorization: 'someAuthToken' },
            priority: FastImage.priority.normal
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
      )} */}
    </Modal>
  )
}

const CameraPreview = ({photo, save, retake, setVisible}) => {
  const {t} = useTranslation()

  return (
    <View
      style={{
        // backgroundColor: 'transparent',
        flex: 1,
        width: '100%',
        height: '100%'
      }}>
      <View
        style={[styles.column, {flex: 1, justifyContent: 'flex-end', gap: 15}]}>
        <View
          style={{
            flex: 1,
            borderRadius: 15,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: '#000'
          }}>
          <FastImage
            // resizeMode={FastImage.resizeMode.contain}
            source={{
              uri: `file://${photo}`,
              priority: FastImage.priority.normal
            }}
            style={{
              flex: 1
            }}
          />
        </View>

        <View style={[styles.row, {justifyContent: 'space-between', gap: 3}]}>
          <TouchableOpacity
            onPress={() => setVisible(false)}
            style={styles.buttonPreview}>
            <Ionicons name="arrow-back" size={20} color={'#000'} />
            <Text style={{fontSize: 20, color: '#000'}}>
              {t('camera_back')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={retake} style={styles.buttonPreview}>
            <Ionicons name="refresh" size={20} color={'#000'} />

            <Text style={{fontSize: 20, color: '#000'}}>
              {t('camera_retake')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={save} style={styles.buttonPreview}>
            <Ionicons name="save" size={20} color={'#000'} />

            <Text style={{fontSize: 20, color: '#000'}}>
              {t('camera_save')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
