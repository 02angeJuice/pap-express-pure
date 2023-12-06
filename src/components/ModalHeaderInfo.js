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

const ModalHeaderInfo = ({data, visible, setVisible}) => {
  const {t} = useTranslation()

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
      visible={visible}
      transparent={true}
      statusBarTranslucent={true}
      // animationType="slide"
      onRequestClose={() => setVisible(!visible)}>
      {/* <TouchableWithoutFeedback onPress={() => setVisible(!visible)}> */}
      <View style={styles.modalContainer}>
        <View style={styles.container}>
          <View style={styles.nav}>
            <Text style={[styles.textNav, {fontSize: 20}]}>
              {t('receipt_detail')}
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setVisible(!visible)}>
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
            <View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                <Text style={{color: '#000', fontSize: 20}}>
                  {t('container_no')}:{' '}
                  {data?.container_no === null ? '-' : data?.container_no}{' '}
                </Text>
                <Text style={{color: '#000', fontSize: 20}}>
                  {data?.customer_id === null ? '-' : data?.customer_id}
                </Text>
              </View>

              <View
                style={{
                  borderStyle: 'dashed',
                  borderColor: '#999',
                  borderBottomWidth: 0.5,
                  margin: 2
                }}
              />
              <Text style={{color: '#000', fontSize: 20}}>
                {t('date_departure')}:{' '}
                {data?.date_departure === null ? '-' : data?.date_departure}
              </Text>

              <Text style={{color: '#000', fontSize: 20}}>
                {t('date_arrival')}:{' '}
                {data?.date_departure === null ? '-' : data?.date_departure}
              </Text>

              <Text style={{color: '#000', fontSize: 20}}>
                {t('car_regis')}:{' '}
                {data?.Chinese_car_registration === null
                  ? '-'
                  : data?.Chinese_car_registration}
              </Text>
              <Text style={{color: '#000', fontSize: 20}}>
                {t('driver')}:{' '}
                {data?.Chinese_driver === null ? '-' : data?.Chinese_driver}
              </Text>
              <Text style={{color: '#000', fontSize: 20}}>
                {t('transport_type')}:{' '}
                {data?.shipment === null
                  ? '-'
                  : data?.shipment === 'car'
                  ? `${t('car')}`
                  : `${t('ship')}`}
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  gap: 10
                }}>
                <Text style={{color: '#000', fontSize: 20}}>{t('phone')}:</Text>
                <TouchableOpacity onPress={() => handleCallPress(data?.phone)}>
                  <Text
                    style={{
                      color: '#009DFF',
                      fontSize: 20
                    }}>
                    {data?.phone === null ? '-' : data?.phone}
                  </Text>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  borderStyle: 'dashed',
                  borderColor: '#999',
                  borderBottomWidth: 0.5,
                  margin: 2
                }}
              />
              <Text style={{color: '#000', fontSize: 20}}>
                {t('status')}: {data?.status}
              </Text>
            </View>
          </View>

          <View>
            <TouchableOpacity
              style={[styles.button, {backgroundColor: '#FFF'}]}
              onPress={() => setVisible(!visible)}>
              <Text
                style={{
                  color: '#000',
                  fontWeight: 'bold',
                  alignSelf: 'center',
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
    backgroundColor: '#FF7676',
    padding: 10,
    borderRadius: 5
  }
})

export default ModalHeaderInfo
