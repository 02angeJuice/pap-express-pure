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
import {useTranslation} from 'react-i18next'
import {useFocus, useScan} from '../../hooks'
import {hh_sel_box_by_od} from '../../apis'
import {setfetchfocus} from '../../store/slices/focusSlice'
import {useDispatch} from 'react-redux'

import {Empty} from '../../components/SpinnerEmpty'
import BarcodeInputAlert from '../../components/BarcodeInputAlert'

const Scan = forwardRef(
  ({detail, distribute_id, orderStatus, navigation}, ref) => {
    const [alertBarcode, setAlertBarcode] = useState(false)
    const [barcode, setBarcode] = useState('')
    const [input, setInput] = useState('')
    const [box, setBox] = useState(null)
    const [boxcheck, setboxcheck] = useState(null)
    const [redata, setredata] = useState(false)
    const [expanded, setExpanded] = useState(true)

    const {t} = useTranslation()
    const dispatch = useDispatch()
    const {insertDetailsBox} = useScan()
    const {fetchfocus} = useFocus()

    // ----------------------------------------------------------
    // == EFFECT
    // ----------------------------------------------------------
    useEffect(() => {
      ref.current?.focus()
    }, [fetchfocus])

    useEffect(() => {
      const fetch_hh_sel_box_by_od = async () => {
        try {
          const res = await hh_sel_box_by_od(distribute_id)
          setBox(res)
          setboxcheck(res.filter((el) => el.is_scan !== 'SCANED'))
        } catch (error) {
          console.log(error)
        }
      }

      if (distribute_id) {
        fetch_hh_sel_box_by_od()
      }
    }, [redata, distribute_id])

    useEffect(() => {
      if (barcode.length != 0) {
        handleInputSubmit(barcode)
      }
    }, [barcode])

    // รอแก้ไปเช็คในเบส
    const check = useCallback(
      (box_id) => {
        const res = boxcheck?.findIndex((el) => el.box_id == box_id)
        return res < 0 ? false : true
      },
      [boxcheck]
    )

    // ----------------------------------------------------------
    // == HANDLE
    // ----------------------------------------------------------
    const handleInputSubmit = async (text) => {
      const newValue = text.split('/')
      const checked = check(text)

      if (!checked) {
        setInput('')
      } else {
        const checkHasScaned = box?.findIndex(
          (el) => el.box_id === text && el.is_scan_d === 'SCANED'
        )

        if (checkHasScaned < 0) {
          await insertDetailsBox(
            newValue[0],
            Number(newValue[1]),
            null,
            'distribute',
            navigation
          )
          setredata((el) => !el)
          setInput('')
        }
      }
    }

    // ----------------------------------------------------------
    // == MAIN
    // ----------------------------------------------------------
    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={() => dispatch(setfetchfocus())}>
          <View
            style={[
              styles.row,
              {
                justifyContent: 'space-between',
                borderBottomWidth: 0.5,
                borderStyle: 'dashed'
              }
            ]}>
            <View style={{flex: 0.5, alignItems: 'center', width: '100%'}}>
              <Text style={{color: '#000', fontSize: 20}}>{'#'}</Text>
            </View>
            <View style={{flex: 1, alignItems: 'center', width: '100%'}}>
              <Text
                style={{
                  color: box
                    ?.filter((el) => el.is_scan === 'IDLE')
                    .every((el) => el.is_scan_d === 'SCANED')
                    ? 'magenta'
                    : '#000',
                  fontSize: 16
                }}>{`(${
                box?.filter((el) => el.is_scan_d === 'SCANED')?.length || 0
              }/${
                box?.filter((el) => el.is_scan === 'IDLE')?.length || 0
              })`}</Text>
            </View>
            <View style={{flex: 2, alignItems: 'center'}}>
              <TextInput
                editable={orderStatus === 'DATA ENTRY'}
                ref={ref}
                style={{fontSize: 20, color: '#000'}}
                value={input}
                onChangeText={(value) => handleInputSubmit(value)}
                placeholder={t('enter_barcode')}
                placeholderTextColor={orderStatus === 'DATA ENTRY' && '#009DFF'}
                blurOnSubmit={false}
                showSoftInputOnFocus={false}
              />
            </View>

            <TouchableOpacity
              style={{flex: 1, alignItems: 'center'}}
              onPress={() => setAlertBarcode(!alertBarcode)}>
              <Ionicons
                style={styles.rightIcon}
                name={'hammer-outline'}
                size={30}
                color="#eee"
              />
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
        {expanded && (
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
                      key={idx}
                      item={item}
                      box_id={item.box_id?.split('/')[1]}
                    />
                  ))}
                </ScrollView>
              </TouchableWithoutFeedback>
            ) : (
              <Empty text={box && t('empty')} />
            )}
          </>
        )}

        <TouchableOpacity
          onPress={() => setExpanded(!expanded)}
          style={{width: '100%', alignItems: 'center'}}>
          <Ionicons
            name={expanded ? 'chevron-up-outline' : 'chevron-down-outline'}
            size={25}
            color={'#777'}
          />
        </TouchableOpacity>

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
)

// ----------------------------------------------------------
// == COMPONENT
// ----------------------------------------------------------
const ScanItem = React.memo(({item, box_id}) => {
  return (
    <View
      style={[
        styles.row,
        {
          justifyContent: 'space-around',
          backgroundColor:
            item?.is_scan_d === 'SCANED'
              ? '#ABFC7430'
              : item?.is_scan !== 'IDLE'
              ? '#ccc'
              : null,
          borderTopWidth: 1,
          borderColor: '#ccc',
          borderStyle: 'dashed'
        }
      ]}>
      <View style={{alignItems: 'center', width: '20%'}}>
        <Text style={{color: '#999', fontSize: 20, fontStyle: 'italic'}}>
          {item.num_box}
        </Text>
      </View>
      <View style={{width: '50%', alignItems: 'center'}}>
        <Text style={{fontSize: 14, color: '#000'}}>{item.box_id}</Text>
      </View>
      <View style={{width: '10%', alignItems: 'center'}}>
        <Text style={{fontSize: 14, color: '#000'}}>{box_id}</Text>
      </View>
      <View style={{width: '20%', alignItems: 'center'}}>
        {item?.is_scan_d === 'SCANED' ? (
          <Ionicons
            style={{alignSelf: 'center'}}
            name={'checkmark-circle-outline'}
            size={25}
            color={'green'}
          />
        ) : item?.is_scan !== 'IDLE' ? (
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
