import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Linking
} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {useTranslation} from 'react-i18next'
import CustomText from './CustomText'

const ModalBoxConfirmAll = ({handleConfirmAll, open, handleOpen}) => {
  const {t} = useTranslation()
  // console.log(data)

  const handleCallPress = async (tel) => {
    const phoneNumberWithPrefix = `tel:${tel}`
    try {
      await Linking.openURL(phoneNumberWithPrefix)
    } catch (error) {
      console.error('Error opening phone app:', error)
    }
  }

  // ----------------------------------------------------------
  // == MAIN
  // ----------------------------------------------------------
  return (
    <Modal
      visible={open}
      transparent={true}
      statusBarTranslucent={true}
      onRequestClose={() => handleOpen(!open)}>
      <View style={styles.modalContainer}>
        <View style={styles.container}>
          <View style={styles.nav}>
            <Text style={[styles.textNav, {fontSize: 20}]}>
              {t('load_to_truck_confirm')}
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
              paddingHorizontal: 15,
              paddingVertical: 25,
              backgroundColor: '#fff',
              borderRadius: 5,
              gap: 10
            }}>
            <CustomText
              size="lg"
              text={t('confirmed_partial_title')}
              // style={{textAlign: 'center'}}
            />

            <CustomText
              size="lg"
              text={`** ${t('confirmed_partial_detail')}`}
              // style={{textAlign: 'center'}}
            />
          </View>

          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 10
            }}>
            <TouchableOpacity
              style={[
                styles.row,
                styles.button,
                {justifyContent: 'center', backgroundColor: '#FFE7E7'}
              ]}
              onPress={() => handleConfirmAll('partial')}>
              <Text style={styles.textButton}>{t('confirmed_partial')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.row,
                styles.button,
                {justifyContent: 'center', backgroundColor: '#E7FFDF'}
              ]}
              onPress={() => handleConfirmAll('all')}>
              <Text style={styles.textButton}>{t('confirmed_all')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const ButtonConfirmComponent = ({text, color, backgroundColor, onPress}) => {
  return (
    <TouchableOpacity
      style={[styles.button, styles.shadow, {backgroundColor: backgroundColor}]}
      onPress={onPress}>
      <CustomText
        size="md"
        color={color}
        text={'dsdsds'}
        style={{fontWeight: 'bold', textAlign: 'center'}}
      />
    </TouchableOpacity>
  )
}

// ----------------------------------------------------------
// == STYLE
// ----------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    borderRadius: 5,
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

  button: {
    backgroundColor: '#fff',
    borderRadius: 3,
    paddingHorizontal: 5,
    paddingVertical: 10,
    alignItems: 'center',
    width: '50%'
  },
  textButton: {
    color: '#000',
    fontSize: 20
  },
  shadow: {
    shadowOffset: {width: 0, height: 2},
    shadowColor: '#171717',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2
  }
})

export default ModalBoxConfirmAll
