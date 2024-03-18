import React, {useState} from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  Modal,
  TouchableWithoutFeedback
} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Signature from 'react-native-canvas-signature'
import {useTranslation} from 'react-i18next'
import RNFS from 'react-native-fs'

const ModalSignaturePad = ({set, open, handleOpen}) => {
  const [signature, setSignature] = useState(null)
  const {t} = useTranslation()

  // ----------------------------------------------------------
  // == HANDLE
  // ----------------------------------------------------------
  const handleOK = async (sign) => {
    const dataType = sign.split(';')[0]
    const fileType = sign.split(';')[0].split('/')[1]

    const fileName = `${new Date().getTime()}.${fileType}`
    const path = RNFS.CachesDirectoryPath + `/${fileName}`

    const base64Content = sign.replace(`${dataType};base64,`, '')

    await RNFS.writeFile(path, base64Content, 'base64')
      .then(() => RNFS.stat(path))
      .then((statResult) => {
        console.log(`file://${statResult?.path}`)

        setSignature(`file://${statResult?.path}`)
      })
      .catch((error) => {
        console.error('Error saving or retrieving the image:', error)
      })
  }

  // ----------------------------------------------------------
  // == MAIN
  // ----------------------------------------------------------
  return (
    <Modal
      visible={open}
      transparent={true}
      statusBarTranslucent={true}
      // animationType="slide"
      onRequestClose={() => handleOpen(!open)}>
      {/* <TouchableWithoutFeedback onPress={() => setVisible(!visible)}> */}
      <View style={styles.modalContainer}>
        <View style={styles.container}>
          <View style={styles.nav}>
            <Text style={[styles.textNav, {fontSize: 20}]}>
              {t('signature')}
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => handleOpen(!open)}>
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
            {Platform.OS === 'android' ? (
              <Signature lineWidth={1.5} lineColor="#000" onChange={handleOK} />
            ) : (
              <View style={[styles.row, {gap: 5}]}>
                <Text>{t('signature_support')}</Text>
              </View>
            )}
          </View>

          <View>
            <TouchableOpacity
              style={[styles.button, {backgroundColor: '#ABFC74'}]}
              onPress={() => {
                set(signature)
                handleOpen(!open)
              }}>
              <Text
                style={[
                  {
                    color: '#183B00',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    fontSize: 20
                  }
                ]}>
                {t('confirm')}
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
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  modalContainer: {
    flex: 1,
    paddingTop: 25,
    paddingBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    borderRadius: 5,
    overflow: 'hidden'
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
  button: {
    maxWidth: '100%',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center'
  }
})

export default React.memo(ModalSignaturePad)
