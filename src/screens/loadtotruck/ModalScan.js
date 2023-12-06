import React, {useEffect, useState, useRef, useCallback} from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  FlatList,
  Keyboard,
  Modal,
  ActivityIndicator
} from 'react-native'
import Clipboard from '@react-native-clipboard/clipboard'
import Ionicons from 'react-native-vector-icons/Ionicons'
import CustomTextInputAlert from '../../components/CustomTextInputAlert'
import {Empty} from '../../components/SpinnerEmpty'
import {useTranslation} from 'react-i18next'
import {useScan} from '../../hooks'
import {fetchBox} from '../../apis'
import BarcodeInputAlert from '../../components/BarcodeInputAlert'

const generateItems = (numInput, item_no) => {
  const newItems = []
  for (let i = 0; i < numInput; i++) {
    newItems.push({box_id: `${item_no}/${i + 1}`, is_scan: null})
  }
  return newItems
}

const ModalScan = ({
  data,
  visible,
  setVisible,
  confirm,
  force,
  forceConfirm,
  navigation
}) => {
  const [loading, setLoading] = useState(false)
  const [scan, setScan] = useState(false)
  const [items, setItems] = useState([])
  const [checkStatus, setCheckStatus] = useState(false)
  const [alertContainer, setAlertContainer] = useState(false)
  const [alertBarcode, setAlertBarcode] = useState(false)
  const [barcode, setBarcode] = useState('')
  const [input, setInput] = useState('')
  const [box, setBox] = useState(null)
  const [reload, setReload] = useState(false)

  const {insertDetailsBox, setBoxAvail} = useScan()
  const {t} = useTranslation()
  const numInputs = Number(data?.qty_box)
  const scanRef = useRef(null)

  // ----------------------------------------------------------
  // == API
  // ----------------------------------------------------------
  const fetchBox_API = async (item_no) => {
    setLoading(true)
    try {
      const box = await fetchBox(item_no)
      setBox(box?.data)
      console.log('fetchBox')
    } catch (error) {
      Alert.alert('Something went wrong!', error.message)
    }
    setLoading(false)
  }

  // ----------------------------------------------------------
  // == EFFECT
  // ----------------------------------------------------------
  useEffect(() => {
    data?.qty_box && setItems(generateItems(numInputs, data?.item_no))
  }, [])

  useEffect(() => {
    if (barcode.length != 0) {
      handleInputSubmit(barcode)
    }

    console.log(barcode)
  }, [barcode])

  useEffect(() => {
    scanRef.current && scanRef.current?.focus()
    fetchBox_API(data?.item_no)

    const interval = setInterval(() => {
      fetchBox_API(data?.item_no)
    }, 10000)

    return () => {
      console.log('clear')
      clearInterval(interval)
    }
  }, [scan])

  useEffect(() => {
    setBoxAvail(box?.filter((el) => el.is_scan === 'SCANED').length)

    box?.length != 0 && items?.every((el) => el.is_scan === 'SCANED')
      ? setCheckStatus(true)
      : setCheckStatus(false)

    if (box) {
      const newItems = items.map((el) => {
        const foundBox = box?.find((b) => b.box_id === el.box_id)
        return {
          ...el,
          is_scan: foundBox ? foundBox.is_scan : null
        }
      })

      setItems(newItems)
    }
  }, [box])

  // ----------------------------------------------------------
  // == HANDLE
  // ----------------------------------------------------------
  const handleInputChange = async (value) => {
    value.includes(data?.item_no) && setScan(!scan)
    setInput(value.toUpperCase())
  }

  const handleInputSubmit = async (text) => {
    const newValue = text.split('/')
    const isValid =
      newValue[0] === data?.item_no &&
      newValue[1] > 0 &&
      newValue[1] <= numInputs

    if (!isValid) {
      if (
        (newValue[0] !== 'P' && newValue[0] !== 'p') ||
        text.length > data?.item_no.length + 1
      ) {
        Alert.alert(t('barcode_invalid'), t('barcode_invalid_detail'), [], {
          cancelable: true
        })
        setInput('')
      }
    } else {
      setReload(true)
      await insertDetailsBox(
        newValue[0],
        Number(newValue[1]),
        'load',
        navigation
      )
      setReload(false)

      const updatedItems = await Promise.all(
        items.map((item) =>
          item.box_id === `${newValue[0]}/${newValue[1]}`
            ? {...item, is_scan: 'SCANED'}
            : item
        )
      )
      setItems(updatedItems)
      setScan(!scan)
      setInput('')
    }
  }

  const renderItem = useCallback(({item}) => {
    return <ScanItem item={item} />
  }, [])
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
      <View style={styles.modalContainer}>
        <TouchableOpacity
          style={[styles.closeButton]}
          onPress={() => setVisible(!visible)}>
          <Ionicons name="close" size={30} color="#7a7a7a" />
        </TouchableOpacity>
        <View style={styles.container}>
          <View
            style={{
              marginVertical: 5,
              backgroundColor: '#fff',
              borderRadius: 5,
              flex: 1
            }}>
            <View
              style={[
                styles.row,
                {
                  justifyContent: 'space-between',
                  borderBottomWidth: 0.5,
                  marginBottom: 5,
                  borderStyle: 'dashed'
                }
              ]}>
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  width: '100%'
                }}>
                <Text style={{color: '#000', fontSize: 20}}>{`#${t('box')}(${
                  box ? box?.length : ''
                })`}</Text>
              </View>
              <View style={{flex: 2, alignItems: 'center'}}>
                <TextInput
                  ref={scanRef}
                  style={{
                    fontSize: 20,
                    color: '#000'
                  }}
                  value={input}
                  onChangeText={handleInputChange}
                  placeholder={t('enter_barcode')}
                  placeholderTextColor="#999"
                  blurOnSubmit={false}
                  onSubmitEditing={() => handleInputSubmit(input)}
                  selectTextOnFocus={true}
                  onStartShouldSetResponder={() => {
                    Keyboard.dismiss()
                    return false
                  }}
                  showSoftInputOnFocus={false}
                  onPressOut={() => setAlertBarcode(!alertBarcode)}
                />
              </View>

              <View
                style={{
                  flex: 1,
                  alignItems: 'center'
                }}>
                {/* <Text style={{fontSize: 20, color: '#000'}}>{t('status')}</Text> */}
              </View>
            </View>

            <FlatList
              keyboardShouldPersistTaps="handled"
              // keyboardShouldPersistTaps="always"
              style={{marginBottom: 5}}
              keyExtractor={(item, index) => index.toString()}
              data={items}
              ItemSeparatorComponent={() => (
                <View
                  style={{
                    borderBottomWidth: 0.5,
                    borderStyle: 'dashed',
                    borderColor: '#999999'
                  }}
                />
              )}
              initialNumToRender={1}
              windowSize={10}
              renderItem={renderItem}
              ListEmptyComponent={<Empty text={box && t('empty')} />}
            />
          </View>

          <View
            style={[
              styles.row,
              {
                justifyContent: 'space-between',
                gap: 5
              }
            ]}>
            {reload ? (
              // {(loading && !box) || reload ? (
              <TouchableOpacity
                disabled={reload}
                style={[
                  styles.button,
                  styles.row,
                  {
                    flex: 1,
                    justifyContent: 'center',
                    gap: 10,
                    backgroundColor: '#FFF'
                  }
                ]}>
                <ActivityIndicator size={20} color="#999" />
                <Text
                  style={[
                    {
                      color: '#999',
                      fontWeight: 'bold',
                      textAlign: 'center'
                    }
                  ]}>
                  Loading...
                </Text>
              </TouchableOpacity>
            ) : checkStatus || force ? (
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
                style={[styles.button, {backgroundColor: '#FFE683', flex: 1}]}
                onPress={() => setAlertContainer(!alertContainer)}>
                <Text
                  style={[
                    {
                      color: '#5E4600',
                      fontWeight: 'bold',
                      textAlign: 'center'
                    }
                  ]}>
                  {t('force_confirm')}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.button, {backgroundColor: '#fff', flex: 1}]}
              onPress={() => setVisible(!visible)}>
              <Text
                style={[
                  {
                    color: '#000',
                    fontWeight: 'bold',
                    textAlign: 'center'
                  }
                ]}>
                {t('close')}
              </Text>
            </TouchableOpacity>

            <CustomTextInputAlert
              visible={alertContainer}
              onClose={() => setAlertContainer(!alertContainer)}
              forceConfirm={forceConfirm}
              remark={data?.remark}
            />

            <BarcodeInputAlert
              visible={alertBarcode}
              onClose={() => setAlertBarcode(!alertBarcode)}
              setBarcode={setBarcode}
              item_no={data?.item_no}
            />
          </View>
        </View>
      </View>
    </Modal>
  )
}

// ----------------------------------------------------------
// == COMPONENT
// ----------------------------------------------------------
const ScanItem = React.memo(({item}) => (
  <View key={item.box_id}>
    <View
      style={[
        styles.row,
        {
          justifyContent: 'space-between',
          marginVertical: 3
        }
      ]}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          width: '100%'
        }}>
        <Text style={{color: '#000', fontSize: 20}}>
          {item.box_id?.split('/')[1]}
        </Text>
      </View>
      <View style={{flex: 2, alignItems: 'center'}}>
        <TouchableOpacity
          onLongPress={async () => {
            Clipboard.setString(item.box_id)
            console.log('copy ', item.box_id)
            // await Clipboard.getString()
          }}>
          <Text style={{color: '#000', fontSize: 20}}>{item.box_id}</Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          flex: 1,
          alignItems: 'center'
        }}>
        {item?.is_scan === 'SCANED' ? (
          <Ionicons
            style={{alignSelf: 'center'}}
            name={'checkmark-circle-outline'}
            size={20}
            color={'green'}
          />
        ) : (
          <Ionicons
            style={{alignSelf: 'center'}}
            name={'ellipsis-horizontal-outline'}
            size={10}
            color={'#000'}
          />
        )}
      </View>
    </View>
  </View>
))

// ----------------------------------------------------------
// == STYLE
// ----------------------------------------------------------
const styles = StyleSheet.create({
  input: {
    width: 200,
    height: 40,
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10
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
    zIndex: 2,
    position: 'absolute',
    right: 12,
    top: 35,
    transform: [{translateY: -5}]
  },
  button: {
    maxWidth: '100%',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center'
  }
})

export default React.memo(ModalScan)
