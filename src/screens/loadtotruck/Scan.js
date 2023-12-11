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
  ActivityIndicator,
  ScrollView
} from 'react-native'
import Clipboard from '@react-native-clipboard/clipboard'
import Ionicons from 'react-native-vector-icons/Ionicons'
import CustomTextInputAlert from '../../components/CustomTextInputAlert'
import {Empty} from '../../components/SpinnerEmpty'
import {useTranslation} from 'react-i18next'
import {useScan} from '../../hooks'
import {fetchBox, hh_check_ro_qty_box, hh_sel_box_by_receipt} from '../../apis'
import BarcodeInputAlert from '../../components/BarcodeInputAlert'
import axios from 'axios'

const generateItems = (numInput, item_no) => {
  const newItems = []
  for (let i = 0; i < numInput; i++) {
    newItems.push({box_id: `${item_no}/${i + 1}`, is_scan: null})
  }
  return newItems
}

const Scan = ({
  detail,
  checkScan,
  data,
  visible,
  setVisible,
  confirm,
  force,
  forceConfirm,
  navigation
}) => {
  const [items, setItems] = useState([])
  const [alertContainer, setAlertContainer] = useState(false)
  const [alertBarcode, setAlertBarcode] = useState(false)
  const [barcode, setBarcode] = useState('')
  const [input, setInput] = useState('')
  const [box, setBox] = useState(null)

  const {insertDetailsBox, setBoxAvail} = useScan()
  const {t} = useTranslation()
  const numInputs = Number(data?.qty_box)
  const scanRef = useRef(null)

  const [redata, setredata] = useState(false)

  // ----------------------------------------------------------
  // == API
  // ----------------------------------------------------------
  // const fetchBox_API = async (item_no) => {
  //   setLoading(true)
  //   try {
  //     const box = await fetchBox(item_no)
  //     setBox(box?.data)
  //     console.log('fetchBox')
  //   } catch (error) {
  //     Alert.alert('Something went wrong!', error.message)
  //   }
  //   setLoading(false)
  // }

  // useEffect(() => {
  //   const check_hh_sel_check_qty_box = async () => {
  //     try {
  //       const res = await hh_check_ro_qty_box({receipt_no: data?.receipt_no})

  //       const newDetail = detail?.map((el) => el.item_no)

  //       const success = newDetail?.filter((el) => !res.includes(el))

  //       console.log(success)
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   }
  //   if (data?.receipt_no) {
  //     check_hh_sel_check_qty_box()
  //   }
  // }, [data?.receipt_no, redata])

  // ----------------------------------------------------------
  // == EFFECT
  // ----------------------------------------------------------

  useEffect(() => {
    scanRef.current && scanRef.current?.focus()
  }, [])

  useEffect(() => {
    const fetch_hh_sel_box_by_receipt = async () => {
      try {
        const res = await hh_sel_box_by_receipt(data?.receipt_no)
        setBox(res)
      } catch (error) {
        console.log(error)
      }
    }

    // const check_hh_sel_check_qty_box = async () => {
    //   try {
    //     const res = await hh_check_ro_qty_box({receipt_no: data?.receipt_no})
    //     console.log('---', res)
    //     console.log(res === undefined)

    //     setCompleted(res === undefined)
    //   } catch (error) {
    //     console.log(error)
    //   }
    // }
    // check_hh_sel_check_qty_box()

    if (data?.receipt_no) {
      fetch_hh_sel_box_by_receipt()
    }
  }, [redata, data?.receipt_no])

  useEffect(() => {
    if (barcode.length != 0) {
      handleInputSubmit(barcode)
    }
  }, [barcode])

  // useEffect(() => {
  //   setBoxAvail(box?.filter((el) => el.is_scan === 'SCANED').length)

  //   box?.length != 0 && items?.every((el) => el.is_scan === 'SCANED')
  //     ? setCheckStatus(true)
  //     : setCheckStatus(false)

  //   if (box) {
  //     const newItems = items.map((el) => {
  //       const foundBox = box?.find((b) => b.box_id === el.box_id)
  //       return {
  //         ...el,
  //         is_scan: foundBox ? foundBox.is_scan : null
  //       }
  //     })

  //     setItems(newItems)
  //   }
  // }, [box])

  const check = (item_no, num) => {
    const res = detail?.findIndex(
      (el) => el.item_no == item_no && num > 0 && num <= Number(el.qty_box)
    )
    return res < 0 ? false : true
  }

  // ----------------------------------------------------------
  // == HANDLE
  // ----------------------------------------------------------
  const handleInputChange = async (value) => {
    setInput(value.toUpperCase())
  }

  const handleInputSubmit = async (text) => {
    const newValue = text.split('/')

    const checked = check(newValue[0], newValue[1])

    if (!checked) {
      // Alert.alert(t('barcode_invalid'), t('barcode_invalid_detail'), [], {
      //   cancelable: true
      // })

      setInput('')
    } else {
      let numBox = null

      for (const res of detail) {
        if (res.item_no === newValue[0]) {
          numBox += Number(newValue[1])
          break
        } else {
          numBox += Number(res.qty_box)
        }
      }
      console.log('numBox', numBox)
      console.log('success')
      await insertDetailsBox(
        newValue[0],
        Number(newValue[1]),
        numBox,
        'load',
        navigation
      )
      setredata((el) => !el)

      // const updatedItems = await Promise.all(
      //   items.map((item) =>
      //     item.box_id === `${newValue[0]}/${newValue[1]}`
      //       ? {...item, is_scan: 'SCANED'}
      //       : item
      //   )
      // )

      // setItems(updatedItems)
      setInput('')
    }
  }

  // ----------------------------------------------------------
  // == MAIN
  // ----------------------------------------------------------
  return (
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
              flex: 0.5,
              alignItems: 'center',
              width: '100%'
            }}>
            <Text style={{color: '#000', fontSize: 20}}>{'#'}</Text>
          </View>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              width: '100%'
            }}>
            <Text
              style={{
                color:
                  box?.length ==
                  detail?.reduce((sum, el) => sum + Number(el?.qty_box), 0)
                    ? 'magenta'
                    : '#000',
                fontSize: 20
              }}>{`${t('box')}(${box?.length || 0}/${
              detail?.reduce((sum, el) => sum + Number(el?.qty_box), 0) || 0
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
              onChangeText={(value) => handleInputSubmit(value)}
              placeholder={t('enter_barcode')}
              placeholderTextColor="#009DFF"
              blurOnSubmit={false}
              // onSubmitEditing={() => handleInputSubmit(input)}
              autoFocus={true}
              selectTextOnFocus={true}
              onStartShouldSetResponder={() => {
                Keyboard.dismiss()
                return false
              }}
              showSoftInputOnFocus={false}
              // onPressOut={() => setAlertBarcode(!alertBarcode)}
            />
          </View>

          <TouchableOpacity
            style={{
              flex: 1,
              alignItems: 'center'
            }}
            onPress={() => setAlertBarcode(!alertBarcode)}>
            <Ionicons
              style={styles.rightIcon}
              name={'hammer-outline'}
              size={30}
              color="#eee"
            />
          </TouchableOpacity>
        </View>

        {box !== null ? (
          <ScrollView nestedScrollEnabled={true} style={styles.modalContainer}>
            {box?.map((el, idx) => (
              <ScanItem
                key={idx}
                item={el}
                idx={detail?.find((e) => e.item_no === el.item_no)?.row_id}
                count={el.num_box}
              />
            ))}
          </ScrollView>
        ) : (
          <Empty text={box && t('empty')} />
        )}
      </View>

      {/* <CustomTextInputAlert
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
          /> */}

      {alertBarcode && (
        <BarcodeInputAlert
          visible={alertBarcode}
          onClose={() => setAlertBarcode(!alertBarcode)}
          setBarcode={setBarcode}
        />
      )}
    </View>
  )
}

// ----------------------------------------------------------
// == COMPONENT
// ----------------------------------------------------------
const ScanItem = React.memo(({item, idx, count}) => (
  <View
    key={item.box_id}
    style={[
      styles.row,
      {
        justifyContent: 'space-between',
        marginVertical: 3,
        backgroundColor: item?.is_scan === 'SCANED' ? '#ABFC7430' : null
      },
      idx && {
        borderTopWidth: 1,
        borderColor: '#ccc',
        borderStyle: 'dashed'
      }
    ]}>
    <View
      style={{
        flex: 0.5,
        alignItems: 'center',
        width: '100%'
      }}>
      <Text style={{color: '#999', fontSize: 20, fontStyle: 'italic'}}>
        {count}
      </Text>
    </View>
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
      <Text
        style={{
          fontSize: 20,
          color: '#000'
        }}>
        {item.box_id}
      </Text>
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
          size={25}
          color={'green'}
        />
      ) : (
        <Ionicons
          style={{alignSelf: 'center'}}
          name={'ellipsis-horizontal-outline'}
          size={20}
          color={'#000'}
        />
      )}
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
    maxHeight: 300
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  container: {
    marginTop: 15,

    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc'
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

export default React.memo(Scan)
