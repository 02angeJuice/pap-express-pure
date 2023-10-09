import React, {useEffect, useState, useRef} from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
  FlatList
} from 'react-native'

import Ionicons from 'react-native-vector-icons/Ionicons'
import Modal from 'react-native-modal'
import {Table, Row, Rows} from 'react-native-table-component'

import CustomTextInputAlert from '../../components/CustomTextInputAlert'
import {Empty} from '../../components/SpinnerEmpty'

import {useTranslation} from 'react-i18next'
import {useScan} from '../../hooks'

import {fetchBox} from '../../apis'

const ModalScan = ({
  data,
  visible,
  setVisible,
  confirm,
  force,
  forceConfirm,
  navigation
}) => {
  const [checkStatus, setCheckStatus] = useState(false)
  const [alert, setAlert] = useState(false)

  const [input, setInput] = useState('')
  const [box, setBox] = useState(null)
  const [reload, setReload] = useState(false)

  const {insertDetailsBox, setBoxAvail} = useScan()
  const {t} = useTranslation()

  const numInputs = Number(data?.qty_box)

  // == API
  // =================================================================
  const fetchBox_API = async (item_no) => {
    const box = await fetchBox(item_no)
    setBox(box?.data)

    console.log(box?.data)
  }

  // == EFFECT
  // =================================================================
  useEffect(() => {
    if (data?.item_no) {
      fetchBox_API(data?.item_no)
    }
  }, [data, reload])

  useEffect(() => {
    if (box?.length > 0) {
      box?.length === box?.filter((el) => el.is_scan === 'IDLE').length
        ? setCheckStatus(true)
        : setCheckStatus(false)

      setBoxAvail(box?.filter((el) => el.is_scan === 'IDLE').length)
    }
  }, [box])

  // == HANDLE
  // =================================================================
  const handleInputChange = async (value) => {
    setInput(value.toUpperCase())

    const newValue = value.split('/')
    const item = newValue[0]
    const index = Number(newValue[1])

    const isValid = box?.find((el) => el.box_id === value.toUpperCase())

    if (!isValid) {
      if (value.length > data?.item_no.length + 1) {
        Platform.OS === 'android'
          ? Alert.alert(t('barcode_invalid'), t('barcode_invalid_detail'), [
              {
                text: t('confirm'),
                onPress: () => console.log('OK Pressed')
              }
            ])
          : alert(t('barcode_invalid'), t('barcode_invalid_detail'))

        setInput('')
      }
    } else {
      await insertDetailsBox(item, index, 'unload', navigation)
      setReload(!reload)
      setInput('')
    }
  }

  const rows = Array.from({length: numInputs}, (_, index) => {
    const boxId = `${data?.item_no}/${index + 1}`
    const matchingBox = box?.find((el) => el.box_id === boxId)
    const isScanned = matchingBox?.is_scan === 'SCANED'

    return [
      `${index + 1}`,
      boxId,
      matchingBox ? (
        isScanned ? (
          <Ionicons
            style={{alignSelf: 'center'}}
            name={'ellipsis-horizontal-outline'}
            size={10}
            color={'#000'}
          />
        ) : (
          <Ionicons
            style={{alignSelf: 'center'}}
            name={'checkmark-circle-outline'}
            size={20}
            color={'green'}
          />
        )
      ) : (
        <Ionicons
          style={{alignSelf: 'center'}}
          name={'close-circle-outline'}
          size={20}
          color={'red'}
        />
      )
    ]
  })

  const _renderItem = ({item}) => {
    return <ScanItem item={item} />
  }

  // == COMPONENT ModalScan
  // =================================================================
  return (
    <Modal
      isVisible={visible}
      animationInTiming={1}
      animationOutTiming={1}
      onBackButtonPress={() => setVisible(!visible)}>
      <View style={styles.container}>
        <View style={styles.nav}>
          <Text style={styles.textNav}>
            {t('item_no')} {data?.item_no}
          </Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setVisible(!visible)}>
            <Ionicons name="close" size={25} color="#fff" />
          </TouchableOpacity>
        </View>

        {box !== null ? (
          <View
            style={{
              marginVertical: 5,
              backgroundColor: '#fff',
              borderRadius: 5,
              flex: 1
            }}>
            <Table style={{paddingBottom: 70}}>
              <Row
                style={{
                  borderBottomWidth: 0.5,
                  marginBottom: 5,
                  borderStyle: 'dashed'
                }}
                textStyle={{textAlign: 'center', color: '#000'}}
                data={[
                  `#${t('box')}(${numInputs})`,
                  <TextInput
                    style={{fontSize: 12, color: '#000'}}
                    value={input}
                    onChangeText={handleInputChange}
                    placeholder={t('enter_barcode')}
                    placeholderTextColor="#000"
                    autoFocus={true}
                    blurOnSubmit={false}
                    // showSoftInputOnFocus={false}
                    // editable={!barcodeStatus.every((el) => el === true)}
                  />,
                  `${t('status')}`
                ]}
              />
              <FlatList
                style={{marginBottom: 5}}
                keyExtractor={(item, index) => index.toString()}
                data={rows}
                ItemSeparatorComponent={() => (
                  <View style={{backgroundColor: '#eeeeee99', height: 1}} />
                )}
                initialNumToRender={6}
                windowSize={5}
                renderItem={_renderItem}
              />
            </Table>
          </View>
        ) : (
          <Empty />
        )}

        <View
          style={[
            styles.row,
            {
              justifyContent: 'space-between',
              gap: 5
            }
          ]}>
          {checkStatus || force ? (
            <TouchableOpacity
              style={[styles.button, {backgroundColor: '#ABFC74', flex: 1}]}
              onPress={() => confirm()}>
              <Text
                style={[
                  {
                    color: '#183B00',
                    fontWeight: 'bold',
                    textAlign: 'center'
                  }
                ]}>
                {t('confirm')}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.button, {backgroundColor: '#fff', flex: 1}]}
              onPress={() => setAlert(!alert)}>
              <Text
                style={[
                  {
                    color: '#183B00',
                    fontWeight: 'bold',
                    textAlign: 'center'
                  }
                ]}>
                {t('force_confirm')}
              </Text>
            </TouchableOpacity>
          )}

          <CustomTextInputAlert
            visible={alert}
            onClose={() => setAlert(!alert)}
            forceConfirm={forceConfirm}
            remark={data?.remark}
          />
        </View>
      </View>
    </Modal>
  )
}

const ScanItem = React.memo(({item}) => {
  return (
    <Row
      textStyle={[
        {
          textAlign: 'center',
          fontSize: 12,
          marginBottom: 5,
          color: '#000',
          paddingVertical: 7
        }
      ]}
      data={item}
    />
  )
})

const styles = StyleSheet.create({
  input: {
    width: 200,
    height: 40,
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    // backgroundColor: '#fff',
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

export default React.memo(ModalScan)
