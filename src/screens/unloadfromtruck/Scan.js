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
  const [alert, setAlert] = useState(false)
  const [alertBarcode, setAlertBarcode] = useState(false)
  const [barcode, setBarcode] = useState('')
  const [input, setInput] = useState('')
  const [box, setBox] = useState(null)
  const [boxcheck, setboxcheck] = useState(null)

  const {insertDetailsBox, setBoxAvail} = useScan()
  const {t} = useTranslation()
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

  // ----------------------------------------------------------
  // == EFFECT
  // ----------------------------------------------------------

  useEffect(() => {
    const fetch_hh_sel_box_by_receipt = async () => {
      try {
        const res = await hh_sel_box_by_receipt(data?.receipt_no)
        setBox(res)
        setboxcheck(res.filter((el) => el.is_scan === 'SCANED'))
      } catch (error) {
        console.log(error)
      }
    }

    // const check_hh_sel_check_qty_box = async () => {
    //   try {
    //     const res = await hh_check_ro_qty_box({receipt_no: data?.receipt_no})
    //     console.log('---', res)
    //     console.log(res === undefined)
    //     // setCompleted(res === undefined)
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
  //   scanRef.current && scanRef.current?.focus()
  //   fetchBox_API(data?.item_no)

  //   const interval = setInterval(() => {
  //     fetchBox_API(data?.item_no)
  //   }, 10000)

  //   return () => clearInterval(interval)
  // }, [scan])

  // useEffect(() => {
  //   setBoxAvail(box?.filter((el) => el.is_scan === 'IDLE').length)

  //   box?.length != 0 && box?.every((el) => el.is_scan === 'IDLE')
  //     ? setCheckStatus(true)
  //     : setCheckStatus(false)
  // }, [box])

  // รอแก้ไปเช็คในเบส
  const check = (box_id) => {
    const res = boxcheck?.findIndex((el) => el.box_id == box_id)
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

    const checked = check(text)

    if (!checked) {
      // Alert.alert(t('barcode_invalid'), t('barcode_invalid_detail'), [], {
      //   cancelable: true
      // })
      setInput('')
    } else {
      await insertDetailsBox(
        newValue[0],
        Number(newValue[1]),
        null,
        'unload',
        navigation
      )
      setredata((el) => !el)

      setInput('')
    }
  }

  // const renderItem = useCallback(({item}) => {
  //   return <ScanItem item={item} />
  // }, [])
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
                color: box?.every((el) => el.is_scan === 'IDLE')
                  ? 'magenta'
                  : '#000',
                fontSize: 20
              }}>{`${t('box')}(${
              box?.filter((el) => el.is_scan === 'IDLE')?.length || 0
            }/${box?.length || 0})`}</Text>
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
        visible={alert}
        onClose={() => setAlert(!alert)}
        forceConfirm={forceConfirm}
        remark={data?.remark}
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
        backgroundColor:
          item?.is_scan === 'IDLE'
            ? '#ABFC7430'
            : item?.is_scan !== 'SCANED'
            ? '#ccc'
            : null
      },
      idx &&
        idx !== 1 && {
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
        {item.box_id.split('/')[1]}
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

    {/* <View
      style={{
        flex: 1,
        alignItems: 'center'
      }}>
      {item?.is_scan === 'SCANED' ? (
        <Ionicons
          style={{alignSelf: 'center'}}
          name={'ellipsis-horizontal-outline'}
          size={20}
          color={'#ccc'}
        />
      ) : (
        <Ionicons
          style={{alignSelf: 'center'}}
          name={'checkmark-circle-outline'}
          size={25}
          color={'green'}
        />
      )}
    </View> */}

    <View
      style={{
        flex: 1,
        alignItems: 'center'
      }}>
      {item?.is_scan === 'IDLE' ? (
        <Ionicons
          style={{alignSelf: 'center'}}
          name={'checkmark-circle-outline'}
          size={25}
          color={'green'}
        />
      ) : item?.is_scan !== 'SCANED' ? (
        <Ionicons
          style={{alignSelf: 'center'}}
          name={'close-circle-outline'}
          size={20}
          color={'red'}
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
// == STYLES
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
    right: 10,
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
