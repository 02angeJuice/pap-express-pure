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

const ModalHeaderInfo = ({data, open, handleOpen}) => {
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
            <CustomText
              size="md"
              color="#FFF"
              text={t('receipt_detail')}
              style={{paddingVertical: 15, paddingHorizontal: 10}}
            />
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
            <View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                <CustomText
                  size="md"
                  text={`${t('container_no')}: ${data?.container_no || '--'}`}
                />
                <CustomText size="md" text={data?.customer_id || '--'} />
              </View>

              <View
                style={{
                  borderStyle: 'dashed',
                  borderColor: '#999',
                  borderBottomWidth: 0.5,
                  margin: 2
                }}
              />
              <CustomText
                size="md"
                text={`${t('date_departure')}: ${data?.date_departure || '--'}`}
              />
              <CustomText
                size="md"
                text={`${t('date_arrival')}: ${data?.arrival_date || '--'}`}
              />
              <CustomText
                size="md"
                text={`${t('car_regis')}: ${
                  data?.Chinese_car_registration || '--'
                }`}
              />
              <CustomText
                size="md"
                text={`${t('driver')}: ${data?.Chinese_driver || '--'}`}
              />
              <CustomText
                size="md"
                text={`${t('transport_type')}: ${
                  data?.shipment === 'car' ? t('car') : t('ship') || '--'
                }`}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  gap: 10
                }}>
                <CustomText size="md" text={`${t('phone')}: `} />
                <TouchableOpacity
                  disabled={!data?.phone}
                  onPress={() => handleCallPress(data?.phone)}>
                  <CustomText
                    size="md"
                    color={data?.phone ? '#007ECC' : '#000'}
                    text={data?.phone || '--'}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  gap: 10
                }}>
                <CustomText size="md" text={`${t('phone2')}: `} />
                <TouchableOpacity
                  disabled={!data?.phone_spare}
                  onPress={() => handleCallPress(data?.phone_spare)}>
                  <CustomText
                    size="md"
                    color={data?.phone_spare ? '#007ECC' : '#000'}
                    text={data?.phone_spare || '--'}
                  />
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
              <CustomText
                size="md"
                text={`${t('status')}: ${data?.status || '--'}`}
              />
            </View>
          </View>

          <View>
            <TouchableOpacity
              style={[styles.button, {backgroundColor: '#FFF'}]}
              onPress={() => handleOpen(false)}>
              <CustomText
                size="md"
                text={t('close')}
                style={{fontWeight: 'bold', alignSelf: 'center'}}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
    justifyContent: 'space-between',
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
