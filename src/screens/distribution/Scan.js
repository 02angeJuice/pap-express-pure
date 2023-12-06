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
import Ionicons from 'react-native-vector-icons/Ionicons'
import CustomTextInputAlert from '../../components/CustomTextInputAlert'
import {Empty} from '../../components/SpinnerEmpty'
import {useTranslation} from 'react-i18next'
import {useScan} from '../../hooks'
import {fetchBox, hh_sel_box_by_od} from '../../apis'
import BarcodeInputAlert from '../../components/BarcodeInputAlert'

const Scan = ({
  detail,
  checkScan,
  distribute_id,
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

  const {insertDetailsBox, setBoxAvail} = useScan()
  const {t} = useTranslation()
  const scanRef = useRef(null)

  const [redata, setredata] = useState(false)

  // ----------------------------------------------------------
  // == EFFECT
  // ----------------------------------------------------------
  useEffect(() => {
    const fetch_hh_sel_box_by_receipt = async () => {
      // console.log(headerSelected?.receipt_no)
      try {
        const res = await hh_sel_box_by_od(distribute_id)
        // console.log(res)
        setBox(res)
      } catch (error) {
        console.log(error)
      }
    }

    if (distribute_id) {
      fetch_hh_sel_box_by_receipt()
    }
  }, [redata, distribute_id])

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
  //   setBoxAvail(box?.filter((el) => el.is_scan_d === 'SCANED').length)

  //   box?.length != 0 && box?.every((el) => el.is_scan_d === 'SCANED')
  //     ? setCheckStatus(true)
  //     : setCheckStatus(false)
  // }, [box])

  // ----------------------------------------------------------
  // == HANDLE
  // ----------------------------------------------------------
  const handleInputChange = async (value) => {
    value.includes(distribute_id) && setScan(!scan)
    setInput(value.toUpperCase())
  }

  const handleInputSubmit = async (text) => {
    const newValue = text.split('/')
    // const isValid = box?.find((el) => el.box_id === text)

    const checked = checkScan(newValue[0], newValue[1])

    if (!checked) {
      Alert.alert(t('barcode_invalid'), t('barcode_invalid_detail'), [], {
        cancelable: true
      })

      setInput('')
    } else {
      await insertDetailsBox(
        newValue[0],
        Number(newValue[1]),
        'distribute',
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
            <Text style={{color: '#000', fontSize: 20}}>{`${t('box')}(${
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
              placeholderTextColor="#009DFF"
              blurOnSubmit={false}
              onSubmitEditing={() => handleInputSubmit(input)}
              autoFocus={true}
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
            }}></View>
        </View>

        {box !== null ? (
          <ScrollView nestedScrollEnabled={true} style={styles.modalContainer}>
            {box?.map((el, idx) => (
              <ScanItem
                key={idx}
                item={el}
                idx={
                  detail?.find(
                    (e) =>
                      e.item_no === el.item_no &&
                      el?.box_id?.split('/')[1] === '1'
                  )?.row_id
                }
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
          // item_no={item?.item_no}
        />
      )}
    </View>
  )
}

// ----------------------------------------------------------
// == COMPONENT
// ----------------------------------------------------------
const ScanItem = React.memo(({item, idx}) => (
  <View
    key={item?.box_id}
    style={[
      styles.row,
      {
        justifyContent: 'space-between',
        marginVertical: 3
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
        {idx}
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

    <View
      style={{
        flex: 1,
        alignItems: 'center'
      }}>
      {item?.is_scan_d !== 'SCANED' ? (
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
    height: 300
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
