import React from 'react'
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Modal from 'react-native-modal'
import {useTranslation} from 'react-i18next'

const ModalDetail = ({data, visible, setVisible}) => {
  const {t} = useTranslation()

  console.log(data)

  return (
    <Modal
      isVisible={visible}
      animationInTiming={1}
      animationOutTiming={1}
      onBackButtonPress={() => setVisible(!visible)}>
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
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
              <Text style={{color: '#000'}}>
                {t('tracking_no')}:{' '}
                {data?.tracking_no === null ? '-' : data?.tracking_no}{' '}
              </Text>
              <Text style={{color: '#000'}}>
                {t('tracking_four')}:{' '}
                {data?.item_serial === null ? '-' : data?.item_serial}
              </Text>
            </View>
            <Text style={{color: '#000'}}>
              {t('item_no')}: {data?.item_no}
            </Text>
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
              {t('total_weight')}: {data?.weight_total} KG
            </Text>
            <Text style={{color: '#000'}}>
              {t('width')}* {t('length')}* {t('height')}: {data?.width}x
              {data?.long}x{data?.height} CM
            </Text>
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
    </Modal>
  )
}

const styles = StyleSheet.create({
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
    backgroundColor: '#FF7676',
    padding: 10,
    borderRadius: 5
  }
})

export default ModalDetail
