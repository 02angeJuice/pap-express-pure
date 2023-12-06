import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback
} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {useTranslation} from 'react-i18next'

const ModalDetail = ({data, visible, setVisible}) => {
  const {t} = useTranslation()

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
            <Text style={styles.textNav}>{t('item_detail')}</Text>
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
              <Text style={{color: '#000'}}>
                {t('customer')}: {data?.customer_id}
                {data?.collection && `-${data.collection}`}
              </Text>
              <Text style={{color: '#000'}}>
                {t('item_no')}: {data?.item_no}
              </Text>
              <Text style={{color: '#000'}}>
                {t('tracking_four')}:{' '}
                {data?.item_serial === null ? '-' : data?.item_serial}
              </Text>
              <Text style={{color: '#000'}}>
                {t('tracking_no')}:{' '}
                {data?.tracking_no === null ? '-' : data?.tracking_no}{' '}
              </Text>
              <View
                style={{
                  borderStyle: 'dashed',
                  borderColor: '#999',
                  borderBottomWidth: 0.5,
                  margin: 2
                }}
              />
              <Text style={{color: '#000'}}>
                {t('item_name')}: {data?.item_name}
              </Text>
              <Text style={{color: '#000'}}>
                {t('item_detail')}: {data?.item_description}
              </Text>
              <Text style={{color: '#000'}}>
                {t('box_amount')} （{t('box')}）: {data?.qty_box}
              </Text>
              <Text style={{color: '#000'}}>
                {t('box_amount')} （{t('box_piece')} / {t('box')}）:{' '}
                {data?.qty_piece}
              </Text>
              <Text style={{color: '#000'}}>
                {t('box_amount_actual')} （{t('box')}）:{' '}
                {data?.qty_box_avail === null ? ' -' : data?.qty_box_avail}
              </Text>
              <Text style={{color: '#000'}}>
                {t('total_weight')}:{' '}
                {data?.weight_total == 0 ? ' -' : `${data?.weight_total} KG`}
              </Text>
              <Text style={{color: '#000'}}>
                {t('width')}* {t('length')}* {t('height')}:
                {data?.width === null
                  ? ' -'
                  : ` ${data?.width}x${data?.long}x${data?.height} CM`}
              </Text>
              <View
                style={{
                  borderStyle: 'dashed',
                  borderColor: '#999',
                  borderBottomWidth: 0.5,
                  margin: 2
                }}
              />
              <Text style={{color: '#000'}}>
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
                  alignSelf: 'center'
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

export default ModalDetail
