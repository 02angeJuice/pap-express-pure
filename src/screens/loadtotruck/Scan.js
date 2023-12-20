import React, {useEffect, useState, forwardRef, useCallback} from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  TouchableWithoutFeedback
} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {Empty} from '../../components/SpinnerEmpty'
import {useTranslation} from 'react-i18next'
import {useFocus, useScan} from '../../hooks'
import {hh_sel_box_by_receipt} from '../../apis'
import BarcodeInputAlert from '../../components/BarcodeInputAlert'

import {setfetchfocus} from '../../store/slices/focusSlice'
import {useDispatch} from 'react-redux'

const Scan = forwardRef(({detail, data, box, setredata, navigation}, ref) => {
  const [alertBarcode, setAlertBarcode] = useState(false)
  const [barcode, setBarcode] = useState('')
  const [input, setInput] = useState('')
  // const [box, setBox] = useState(null)
  // const [redata, setredata] = useState(false)

  const {t} = useTranslation()
  const {insertDetailsBox} = useScan()
  const dispatch = useDispatch()
  const {fetchfocus} = useFocus()

  useEffect(() => {
    console.log('fetchfocus')
    ref.current?.focus()
  }, [fetchfocus])

  // useEffect(() => {
  //   const fetch_hh_sel_box_by_receipt = async () => {
  //     try {
  //       const res = await hh_sel_box_by_receipt(data)
  //       setBox(res)
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   }
  //   if (data) {
  //     fetch_hh_sel_box_by_receipt()
  //   }
  // }, [redata, data])

  useEffect(() => {
    if (barcode.length != 0) {
      console.log('barcode')
      handleInputSubmit(barcode)
    }
  }, [barcode])

  const check = useCallback(
    (item_no, num) => {
      const res = detail?.findIndex(
        (el) => el.item_no == item_no && num > 0 && num <= Number(el.qty_box)
      )
      return res < 0 ? false : true
    },
    [detail]
  )

  // ----------------------------------------------------------
  // == HANDLE
  // ----------------------------------------------------------
  const handleInputSubmit = useCallback(
    async (text) => {
      const newValue = text.split('/')
      const checked = check(newValue[0], newValue[1])

      if (!checked) {
        setInput('')
      } else {
        const checkHasScaned = box?.findIndex((el) => el.box_id === text)

        if (checkHasScaned < 0) {
          let numBox = null

          for (const res of detail) {
            if (res.item_no === newValue[0]) {
              numBox += Number(newValue[1])
              break
            } else {
              numBox += Number(res.qty_box)
            }
          }

          await insertDetailsBox(
            newValue[0],
            Number(newValue[1]),
            numBox,
            'load',
            navigation
          )
          setredata((el) => !el)
          setInput('')
        }
      }
    },
    [box, check, detail, insertDetailsBox, navigation, setredata]
  )

  // ----------------------------------------------------------
  // == MAIN
  // ----------------------------------------------------------
  return (
    <TouchableWithoutFeedback onPress={() => dispatch(setfetchfocus())}>
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
                  fontSize: 16
                }}>{`${t('box')}(${box?.length || 0}/${
                detail?.reduce((sum, el) => sum + Number(el?.qty_box), 0) || 0
              })`}</Text>
            </View>
            <View style={{flex: 2, alignItems: 'center'}}>
              <TextInput
                ref={ref}
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
                // autoFocus={true}
                // onStartShouldSetResponder={() => {
                //   Keyboard.dismiss()
                //   return false
                // }}
                showSoftInputOnFocus={false}
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

          <>
            {box !== null ? (
              <TouchableWithoutFeedback
                onPress={() => dispatch(setfetchfocus())}>
                <ScrollView
                  keyboardShouldPersistTaps="handled"
                  nestedScrollEnabled={true}
                  style={styles.modalContainer}>
                  {box?.map((item, idx) => (
                    <ScanItem
                      idx={idx}
                      key={idx}
                      item={item}
                      // box_id={item.box_id?.split('/')[1]}
                    />
                  ))}
                </ScrollView>
              </TouchableWithoutFeedback>
            ) : (
              <Empty text={box && t('empty')} />
            )}
          </>
        </View>

        {alertBarcode && (
          <BarcodeInputAlert
            visible={alertBarcode}
            onClose={() => setAlertBarcode(!alertBarcode)}
            setBarcode={setBarcode}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  )
})

// ----------------------------------------------------------
// == COMPONENT
// ----------------------------------------------------------
// const ScanItem = React.memo(({item, box_id, count}) => {
//   return (
//     <View
//       key={item.box_id}
//       style={[
//         styles.row,
//         {
//           justifyContent: 'space-between',
//           backgroundColor: item.is_scan === 'SCANED' ? '#F3FFEC' : null,
//           borderTopWidth: 0.5,
//           borderColor: '#ccc',
//           borderStyle: 'dashed'
//         }
//       ]}>
//       <View
//         style={{
//           flex: 0.5,
//           alignItems: 'center',
//           width: '100%'
//         }}>
//         <Text style={{color: '#999', fontSize: 16, fontStyle: 'italic'}}>
//           {count}
//         </Text>
//       </View>
//       <View
//         style={{
//           flex: 1,
//           alignItems: 'center',
//           width: '100%'
//         }}>
//         <Text style={{color: '#000', fontSize: 16}}>{box_id}</Text>
//       </View>
//       <View style={{flex: 2, alignItems: 'center'}}>
//         <Text style={{fontSize: 14, color: '#000'}}>{item.box_id}</Text>
//       </View>

//       <View
//         style={{
//           flex: 1,
//           alignItems: 'center'
//         }}>
//         {item.is_scan === 'SCANED' ? (
//           <Ionicons
//             name={'checkmark-circle-outline'}
//             size={20}
//             color={'green'}
//           />
//         ) : (
//           <Ionicons
//             name={'ellipsis-horizontal-outline'}
//             size={20}
//             // color={'#000'}
//           />
//         )}
//       </View>
//     </View>
//   )
// })

const ScanItem = React.memo(({item, idx}) => {
  return (
    <View
      key={idx}
      style={[
        styles.row,
        {
          // justifyContent: 'space-between',
          // borderTopWidth: 1,
          // borderColor: '#ccc',
          // borderStyle: 'dashed'
        }
      ]}>
      <View
        style={{
          flex: 0.5,
          alignItems: 'center',
          width: '100%'
        }}>
        <Text style={{color: '#000', fontSize: 16}}>{item.num_box}</Text>
      </View>
      <View style={{flex: 2, alignItems: 'center'}}>
        <Text
          style={{
            fontSize: 16,
            color: '#000'
          }}>
          {/* {box_id} */}
        </Text>
      </View>
      <View style={{flex: 2, alignItems: 'center'}}>
        <Text style={{fontSize: 14, color: '#000'}}>{item.item_no}</Text>
      </View>
      <View style={{flex: 1, alignItems: 'center'}}>
        <Text
          style={{
            fontSize: 16,
            color: '#000'
          }}>
          {item.qty_box}
        </Text>
      </View>

      <View
        style={{
          flex: 1,
          alignItems: 'center'
        }}>
        {item.is_scan === 'SCANED' ? (
          <Ionicons
            name={'checkmark-circle-outline'}
            size={20}
            color={'green'}
          />
        ) : (
          <Ionicons
            name={'ellipsis-horizontal-outline'}
            size={20}
            color={'#000'}
          />
        )}
      </View>
    </View>
  )
})

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
