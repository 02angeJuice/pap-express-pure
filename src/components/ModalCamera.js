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
// import Camera from 'react-native-camera'

// import {Camera} from 'expo-camera';
// import * as ImagePicker from 'expo-image-picker';
import Modal from 'react-native-modal'
import {useTranslation} from 'react-i18next'

import {
  Camera,
  CameraPermissionStatus,
  useCameraDevices
} from 'react-native-vision-camera'
import {CameraRoll} from '@react-native-camera-roll/camera-roll'

// const ModalCamera = ({ set, visible, setVisible }) => {
//     const [startCamera, setStartCamera] = useState(false)
//     const [previewVisible, setPreviewVisible] = useState(false)
//     const [capturedImage, setCapturedImage] = useState(null)
//     const [cameraType, setCameraType] = useState(Camera.Constants.Type.back)
//     const [flashMode, setFlashMode] = useState('off')

//     const { t } = useTranslation()

//     const __startCamera = async () => {
//         const { status } = await Camera.requestCameraPermissionsAsync()

//         if (status === 'granted') {
//             setStartCamera(true)
//         } else {
//             Platform.OS === 'android'
//                 ? Alert.alert('Access denied')
//                 : alert('Access denied')
//         }
//     }
//     const __takePicture = async () => {
//         const photo = await camera.takePictureAsync()
//         setPreviewVisible(true)
//         setCapturedImage(photo)
//     }

//     const _browseImage = async () => {
//         setVisible(!visible)
//         let result = await ImagePicker.launchImageLibraryAsync({
//             allowsEditing: true,
//             // aspect: [4, 3],
//         })

//         if (!result.canceled) {
//             console.log('_browseImage', result.assets[0].uri)
//             set(result.assets[0].uri)
//         }
//     }

//     const __savePhoto = () => {
//         setVisible(!visible)
//         set(capturedImage.uri)
//     }
//     const __retakePicture = () => {
//         setCapturedImage(null)
//         setPreviewVisible(false)
//         __startCamera()
//     }
//     // const __handleFlashMode = () => {
//     //     if (flashMode === 'on') {
//     //         setFlashMode('off')
//     //     } else if (flashMode === 'off') {
//     //         setFlashMode('on')
//     //     } else {
//     //         setFlashMode('auto')
//     //     }
//     // }
//     // const __switchCamera = () => {
//     //     if (cameraType === 'back') {
//     //         setCameraType('front')
//     //     } else {
//     //         setCameraType('back')
//     //     }
//     // }

//     return (
//         <Modal
//             isVisible={visible}
//             animationInTiming={1}
//             animationOutTiming={1}
//             onBackButtonPress={() => setVisible(!visible)}
//         >
//             <View style={styles.container}>
//                 {startCamera ? (
//                     <View
//                         style={{
//                             flex: 1,
//                             width: '100%',
//                         }}
//                     >
//                         {previewVisible && capturedImage ? (
//                             <CameraPreview
//                                 photo={capturedImage}
//                                 savePhoto={__savePhoto}
//                                 retakePicture={__retakePicture}
//                                 setVisible={setVisible}
//                             />
//                         ) : (
//                             <Camera
//                                 type={cameraType}
//                                 flashMode={flashMode}
//                                 style={{ flex: 1 }}
//                                 ratio="16:9"
//                                 ref={(r) => {
//                                     camera = r
//                                 }}
//                             >
//                                 <View
//                                     style={{
//                                         flex: 1,
//                                         width: '100%',
//                                         backgroundColor: 'transparent',
//                                         flexDirection: 'row',
//                                     }}
//                                 >
//                                     <View
//                                         style={{
//                                             position: 'absolute',
//                                             left: '5%',
//                                             top: '5%',
//                                             flexDirection: 'column',
//                                             justifyContent: 'space-between',
//                                         }}
//                                     >
//                                         <TouchableOpacity
//                                             onPress={() => setVisible(false)}
//                                         >
//                                             <Ionicons
//                                                 name="close"
//                                                 size={40}
//                                                 color="#FFF"
//                                             />
//                                         </TouchableOpacity>
//                                     </View>
//                                     <View
//                                         style={{
//                                             position: 'absolute',
//                                             bottom: 0,
//                                             flexDirection: 'row',
//                                             flex: 1,
//                                             width: '100%',
//                                             padding: 20,
//                                             justifyContent: 'space-between',
//                                         }}
//                                     >
//                                         <View
//                                             style={{
//                                                 alignSelf: 'center',
//                                                 flex: 1,
//                                                 alignItems: 'center',
//                                             }}
//                                         >
//                                             <TouchableOpacity
//                                                 onPress={__takePicture}
//                                                 style={{
//                                                     width: 70,
//                                                     height: 70,
//                                                     bottom: 0,
//                                                     borderRadius: 50,
//                                                     borderColor: '#fff',
//                                                     borderWidth: 4,
//                                                     backgroundColor:
//                                                         'transparent',
//                                                 }}
//                                             />
//                                         </View>
//                                     </View>
//                                 </View>
//                             </Camera>
//                         )}
//                     </View>
//                 ) : (
//                     <View
//                         style={{
//                             flex: 1,
//                             backgroundColor: '#fff',
//                             justifyContent: 'center',
//                             alignItems: 'center',
//                             borderRadius: 15,
//                         }}
//                     >
//                         <TouchableOpacity
//                             onPress={_browseImage}
//                             style={{
//                                 width: 130,
//                                 borderRadius: 4,
//                                 backgroundColor: '#183B00',
//                                 flexDirection: 'row',
//                                 justifyContent: 'center',
//                                 alignItems: 'center',
//                                 gap: 5,
//                                 height: 40,
//                             }}
//                         >
//                             <Ionicons
//                                 name="image-outline"
//                                 size={20}
//                                 color="#fff"
//                             />
//                             <Text
//                                 style={{
//                                     color: '#fff',
//                                     fontWeight: 'bold',
//                                     textAlign: 'center',
//                                 }}
//                             >
//                                 {t('photo')}
//                             </Text>
//                         </TouchableOpacity>

//                         <TouchableOpacity
//                             onPress={__startCamera}
//                             style={{
//                                 marginTop: 100,
//                                 width: 130,
//                                 borderRadius: 4,
//                                 backgroundColor: '#14274e',
//                                 flexDirection: 'row',
//                                 justifyContent: 'center',
//                                 alignItems: 'center',
//                                 gap: 5,
//                                 height: 40,
//                             }}
//                         >
//                             <Ionicons
//                                 name="camera-outline"
//                                 size={20}
//                                 color="#fff"
//                             />
//                             <Text
//                                 style={{
//                                     color: '#fff',
//                                     fontWeight: 'bold',
//                                     textAlign: 'center',
//                                 }}
//                             >
//                                 {t('camera')}
//                             </Text>
//                         </TouchableOpacity>

//                         <TouchableOpacity
//                             style={{
//                                 marginTop: 100,
//                                 width: 130,
//                                 borderRadius: 4,
//                                 backgroundColor: '#AE100F',
//                                 flexDirection: 'row',
//                                 justifyContent: 'center',
//                                 alignItems: 'center',
//                                 height: 40,
//                             }}
//                             onPress={() => setVisible(!visible)}
//                         >
//                             <Text
//                                 style={{
//                                     color: '#fff',
//                                     fontWeight: 'bold',
//                                     textAlign: 'center',
//                                 }}
//                             >
//                                 {t('close')}
//                             </Text>
//                         </TouchableOpacity>
//                     </View>
//                 )}

//                 {/* <StatusBar style="auto" /> */}
//             </View>
//         </Modal>
//     )
// }

// const CameraPreview = ({ photo, retakePicture, savePhoto, setVisible }) => {
//     const { t } = useTranslation()

//     return (
//         <View
//             style={{
//                 backgroundColor: 'transparent',
//                 flex: 1,
//                 width: '100%',
//                 height: '100%',
//             }}
//         >
//             <ImageBackground
//                 source={{ uri: photo && photo.uri }}
//                 style={{
//                     flex: 1,
//                 }}
//             >
//                 <View
//                     style={{
//                         flex: 1,
//                         flexDirection: 'column',
//                         padding: 15,
//                         justifyContent: 'flex-end',
//                     }}
//                 >
//                     <View
//                         style={{
//                             display: 'flex',
//                             flexDirection: 'row',
//                             justifyContent: 'space-between',
//                             alignItems: 'center',
//                             gap: 3,
//                         }}
//                     >
//                         <TouchableOpacity
//                             onPress={() => setVisible(false)}
//                             style={styles.buttonPreview}
//                         >
//                             <Ionicons name="arrow-back" size={20} />
//                             <Text style={{ fontSize: 20 }}>
//                                 {t('camera_back')}
//                             </Text>
//                         </TouchableOpacity>

//                         <TouchableOpacity
//                             onPress={retakePicture}
//                             style={styles.buttonPreview}
//                         >
//                             <Ionicons name="refresh" size={20} />

//                             <Text style={{ fontSize: 20 }}>
//                                 {t('camera_retake')}
//                             </Text>
//                         </TouchableOpacity>

//                         <TouchableOpacity
//                             onPress={savePhoto}
//                             style={styles.buttonPreview}
//                         >
//                             <Ionicons name="save" size={20} />

//                             <Text style={{ fontSize: 20 }}>
//                                 {t('camera_save')}
//                             </Text>
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//             </ImageBackground>
//         </View>
//     )
// }

const ModalCamera = ({set, visible, setVisible}) => {
  const devices = useCameraDevices()
  const device = devices.back
  const [cameraPermission, setCameraPermission] = useState(
    CameraPermissionStatus
  )
  const [microphonePermission, setMicrophonePermission] = useState(
    CameraPermissionStatus
  )

  const [photo, setPhoto] = useState(null)
  const [showCamera, setShowCamera] = useState(true)

  const camera = useRef(null)

  useEffect(() => {
    Camera.getCameraPermissionStatus().then(setCameraPermission)
    Camera.getMicrophonePermissionStatus().then(setMicrophonePermission)
  }, [])

  useEffect(() => {
    permit()
  }, [])

  const permit = async () => {
    console.log('Requesting camera permission...')
    const permission = await Camera.requestCameraPermission()
    console.log(`Camera permission status: ${permission}`)

    if (permission === 'denied') await Linking.openSettings()
    // setCameraPermissionStatus(permission)
  }

  if (cameraPermission == null || microphonePermission == null) {
    // still loading
    return null
  }

  const showPermissionsPage =
    cameraPermission !== 'granted' || microphonePermission === 'not-determined'

  if (device == null)
    return (
      <View>
        <Text>dsd</Text>
      </View>
    )

  const _takePicture = async () => {
    const res = await camera.current.takePhoto({})

    console.log(res)
    setPhoto(res?.path)
    console.log('save')
    setShowCamera(false)
  }

  const _cameraRoll = async () => {
    await CameraRoll.save(`file://${photo}`, {
      type: 'photo'
    })

    console.log('saved')
  }

  return (
    <Modal
      isVisible={visible}
      animationInTiming={1}
      animationOutTiming={1}
      onBackButtonPress={() => setVisible(!visible)}>
      {showCamera ? (
        <Camera
          ref={camera}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          photo={true}
        />
      ) : (
        photo && (
          <ImageBackground
            source={{uri: `file://${photo}`}}
            style={StyleSheet.absoluteFill}
          />
        )
      )}

      <TouchableOpacity
        style={{padding: 20, backgroundColor: 'pink'}}
        onPress={_takePicture}>
        <Text>TAKE PIC</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{padding: 20, backgroundColor: 'pink'}}
        onPress={_cameraRoll}>
        <Text>_cameraRoll</Text>
      </TouchableOpacity>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 15,

    overflow: 'hidden'
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
