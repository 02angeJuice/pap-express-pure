import React, {useState, useEffect} from 'react'
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Platform,
  ActivityIndicator,
  Linking
} from 'react-native'

import Ionicons from 'react-native-vector-icons/Ionicons'
import {Empty} from '../../components/SpinnerEmpty'
import FastImage from 'react-native-fast-image'
import PagerView from 'react-native-pager-view'

// Global Modal
// import ModalCamera from '../../components/ModalCamera'
import ModalSignature from '../../components/ModalSignature'

import {useToast} from 'react-native-toast-notifications'
import {useTranslation} from 'react-i18next'
import {useAuthToken, useScan} from '../../hooks'
import {useDispatch} from 'react-redux'
import {resetToken} from '../../store/slices/tokenSlice'
import {setFilterRe} from '../../store/slices/settingSlice'

import {
  fetchOrderDetail,
  fetchOrderItem,
  hh_sel_box_by_od,
  hh_sel_distributes_by_id,
  sendItemConfirm,
  sendOrderConfirm
} from '../../apis'
import {screenMap} from '../../constants/screenMap'

import TabViewList_2 from './TabViewList_2'
import Scan from './Scan'
import {path} from '../../constants/url'

const ToggleState = {
  SCAN: 'SCAN',
  SIGNATURE: 'SIGNATURE',
  CAMERA: 'CAMERA'
}

const ScanReceiveDetail = ({navigation, route}) => {
  const {order_id} = route?.params
  const [redata, setredata] = useState(false)

  const [loading, setLoading] = useState(false)
  const [toggleState, setToggleState] = useState(null)
  const [orderSelected, setOrderSelected] = useState(null)
  const [detail, setDetail] = useState(null)
  const [detailSelected, setDetailSelected] = useState(null)
  const [currentSign, setCurrentSign] = useState(null)
  const [currentImage, setCurrentImage] = useState(null)
  const [force, setForce] = useState(null)
  const [remark, setRemark] = useState(null)
  const [item, setItem] = useState(null)

  const toast = useToast()
  const {t} = useTranslation()
  const {userName, token, refresh} = useAuthToken()
  const {boxAvail, updateAvailBox, setBoxAvail} = useScan()

  const dispatch = useDispatch()

  // ----------------------------------------------------------
  // == API
  // ----------------------------------------------------------
  const fetchOrderDetail_API = async (distribution_id) => {
    const detail = await fetchOrderDetail(distribution_id)
    setDetail(detail.data)
  }
  const fetchOrderItem_API = async ({order_id, item_id}) => {
    const item = await fetchOrderItem({order_id, item_id})
    setItem(item.data[0])
  }
  const fetchOrderSelect_API = async (distribution_id) => {
    const order = await hh_sel_distributes_by_id(distribution_id)
    setOrderSelected(order.data[0])
  }

  // ----------------------------------------------------------
  // == EFFECT
  // ----------------------------------------------------------
  useEffect(() => {
    if (order_id) {
      fetchOrderSelect_API(order_id)
    }
  }, [redata, order_id])

  useEffect(() => {
    orderSelected && fetchOrderDetail_API(orderSelected?.distribution_id)
  }, [orderSelected])

  useEffect(() => {
    orderSelected && fetchOrderDetail_API(orderSelected?.distribution_id)
  }, [item])

  useEffect(() => {
    detailSelected?.item_no &&
      fetchOrderItem_API({
        order_id: orderSelected?.distribution_id,
        item_id: detailSelected?.item_no
      })
  }, [detailSelected])

  // ----------------------------------------------------------
  // == HANDLE
  // ----------------------------------------------------------
  const toggleSetState = (newToggleState) => {
    if (toggleState === newToggleState) {
      setToggleState(null) // Toggle off if pressed again
    } else {
      setToggleState(newToggleState)
    }
  }

  const onPressForceConfirm = async (message, status = null) => {
    setRemark(message)
    setForce(status)
  }

  const onPressScanConfirm = async () => {
    await sendItemConfirm(
      {
        distribution_id: orderSelected?.distribution_id,
        item_no: detailSelected?.item_no,
        status: 'CLOSED',
        force_confirm: force,
        remark: remark,
        maker: userName
      },
      refresh
    )
      .then(async () => {
        await updateAvailBox(detailSelected?.item_no, boxAvail)

        toast.show(t('confirmed'), {
          type: 'success',
          placement: 'bottom',
          duration: 4000,
          offset: 30
          // animationType: 'slide-in'
        })
      })
      .catch((err) => {
        console.log(err.message)

        if (err.message == 401) {
          dispatch(resetToken())

          navigation.reset({index: 0, routes: [{name: screenMap.Login}]})
          alertReUse('auth_access_denied', 'auth_access_denied_detail')
        }

        alertReUse('auth_access_denied', 'auth_access_denied_detail')
      })

    await fetchOrderItem_API({
      order_id: orderSelected?.distribution_id,
      item_id: detailSelected?.item_no
    })

    setBoxAvail(null)

    setRemark('')
    setForce('')
    setToggleState(null)
  }

  const onPressConfirm = async () => {
    const res = await hh_sel_box_by_od(order_id)

    // const checkStatus = res?.every((el) => el.is_scan_d === 'DONE')

    const checkStatus = res
      ?.filter((el) => el.is_scan === 'IDLE')
      .every((el) => el.is_scan_d === 'DONE')

    console.log(checkStatus, checkStatus ? 'completed' : 'incomplete')

    if (!checkStatus) {
      Alert.alert(t('load_invalid'), t('load_invalid_detail_confirm'), [
        {
          text: t('cancel'),
          onPress: () => {
            setLoading(false)
          },
          style: 'cancel'
        },
        {
          text: t('confirm'),
          onPress: () => onSave()
        }
      ])
    } else {
      onSave()
    }
  }
  const onSave = async () => {
    setLoading(true)

    const imgName = currentImage?.split('/').pop()
    const imgType = imgName?.split('.').pop()
    const signName = currentSign?.split('/').pop()
    const signType = signName?.split('.').pop()

    if (currentSign === null) {
      alertReUse('signature_required', 'signature_required_detail')
    } else {
      // STATUS: DATA ENTRY --> CLOSED/WAITING
      // ==============================
      const obj = new FormData()

      currentSign !== null
        ? obj.append('files', {
            uri: currentSign,
            name: `SIGNATURE-OD.${signType}`,
            type: `image/${signType}`
          })
        : obj.append('files', null)

      // currentImage !== null
      //   ? obj.append('files', {
      //       uri: currentImage,
      //       name: `ITEM-OD.${imgType}`,
      //       type: `image/${imgType}`
      //     })
      //   : obj.append('files', null)

      obj.append('files', null)

      obj.append('id', orderSelected?.distribution_id)
      obj.append('status', 'CLOSED')
      // obj.append(
      //     'status',
      //     orderSelected?.distributeType === 'PDT001'
      //         ? 'CLOSED'
      //         : 'ONSHIP'
      // )
      obj.append('maker', userName)
      obj.append('distributeType', orderSelected?.distributeType)

      await sendOrderConfirm(obj, refresh)
        .then(() => {
          toast.show(t('confirmed'), {
            type: 'success',
            placement: 'bottom',
            duration: 4000,
            offset: 30
          })
        })
        .catch((err) => {
          console.log(err.message)

          if (err.message == 401) {
            dispatch(resetToken())

            navigation.reset({index: 0, routes: [{name: screenMap.Login}]})
            alertReUse('auth_access_denied', err.message)
          }

          alertReUse('auth_access_denied', 'auth_access_denied_detail')
        })

      setredata((el) => !el)

      dispatch(setFilterRe('CLOSED'))

      setLoading(false)
    }
    setLoading(false)
  }

  const alertReUse = (msg, detail) => {
    Platform.OS === 'android'
      ? Alert.alert(t(msg), t(detail), [{onPress: () => setLoading(false)}])
      : alert(t(msg), t(detail))
  }

  const handleCallPress = async (phone) => {
    try {
      await Linking.openURL(`tel:${phone}`)
    } catch (error) {
      console.error('Error opening phone app:', error)
    }
  }

  // ----------------------------------------------------------
  // == MAIN
  // ----------------------------------------------------------
  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View
        style={[
          styles.column,
          {
            marginTop: 10,
            backgroundColor: '#FFF',
            borderRadius: 5,
            gap: 3
          },
          styles.itemContent,
          orderSelected?.status === 'DATA ENTRY' && {
            borderLeftColor: '#FF003C',
            borderLeftWidth: 10,
            backgroundColor: '#FFEBF1'
          },
          orderSelected?.status === 'ONSHIP' && {
            borderLeftColor: '#539ffc',
            borderLeftWidth: 10,
            backgroundColor: '#EBF4FF'
          },
          orderSelected?.status === 'CLOSED' && {
            borderLeftColor: '#95ed66',
            borderLeftWidth: 10,
            backgroundColor: '#E3FFD4'
          }
        ]}>
        <View style={[styles.row, {justifyContent: 'space-end'}]}>
          <View style={[styles.row, {gap: 3}]}>
            <Text style={{color: '#000', fontSize: 20}}>
              {t('receipt_no')}:
            </Text>
            <Text style={{color: '#000', fontSize: 20, fontWeight: '700'}}>
              {orderSelected?.distribution_id}
            </Text>
          </View>
        </View>

        {orderSelected?.distributeType !== 'PDT001' && (
          <Text style={{color: '#000', fontSize: 20}}>
            {t('driver')}: {orderSelected?.driver}
          </Text>
        )}

        <View style={[styles.row, {justifyContent: 'space-between'}]}>
          <View style={[styles.row, {gap: 3}]}>
            <Text style={{color: '#000', fontSize: 20}}>{t('recipient')}:</Text>
            <Text style={{color: '#000', fontSize: 20, fontWeight: 'bold'}}>
              {orderSelected?.customer_id}
            </Text>
          </View>
          <Text style={{color: '#000', fontSize: 20, fontStyle: 'italic'}}>
            ({orderSelected?.first_name} {orderSelected?.last_name})
          </Text>
        </View>

        <View
          style={[
            styles.column,
            {justifyContent: 'flex-start', marginTop: 10}
          ]}>
          <View style={[styles.row, {gap: 3}]}>
            <Text style={{color: '#000', fontSize: 20}}>Phone: </Text>

            <TouchableOpacity
              disabled={!orderSelected?.phone}
              onPress={() => handleCallPress(orderSelected?.phone)}>
              <Text
                style={{
                  color: orderSelected?.phone ? '#007ECC' : '#000',
                  fontSize: 20,
                  fontWeight: 'bold'
                }}>
                {orderSelected?.phone || '--'}
              </Text>
            </TouchableOpacity>

            {orderSelected?.phone && (
              <Ionicons name={'call'} size={20} color="#007ECC" />
            )}
          </View>

          <View style={[styles.row, {gap: 3}]}>
            <Text style={{color: '#000', fontSize: 20}}>Phone2: </Text>

            <TouchableOpacity
              disabled={!orderSelected?.phonespare}
              onPress={() => handleCallPress(orderSelected?.phonespare)}>
              <Text
                style={{
                  color: orderSelected?.phonespare ? '#007ECC' : '#000',
                  fontSize: 20,
                  fontWeight: 'bold'
                }}>
                {orderSelected?.phonespare || '--'}
              </Text>
            </TouchableOpacity>

            {orderSelected?.phonespare && (
              <Ionicons name={'call'} size={20} color="#007ECC" />
            )}
          </View>
        </View>

        <View
          style={[
            styles.row,
            {
              justifyContent: 'center',
              gap: 3,
              backgroundColor: '#fff',
              borderRadius: 5,
              borderColor: '#eee',
              borderWidth: 1,
              padding: 3,
              marginVertical: 4
            }
          ]}>
          <Ionicons color="#FF0000" name="location-outline" size={20} />
          <Text
            style={{flex: 1, flexWrap: 'wrap', color: '#000', fontSize: 20}}>
            {orderSelected?.address} - {orderSelected?.subdistrict}{' '}
            {orderSelected?.district} {orderSelected?.province}{' '}
            {orderSelected?.zip_code}
          </Text>
        </View>

        <View style={[styles.row, {gap: 2, justifyContent: 'flex-start'}]}>
          <Text style={{color: '#000', fontSize: 20}}>
            {t('transport_type')}:{' '}
          </Text>
          <View
            style={[
              styles.status,
              styles.row,
              orderSelected?.distributeType === 'PDT001'
                ? styles.PICKED
                : orderSelected?.distributeType === 'PDT002'
                ? styles.ONSHIP
                : orderSelected?.distributeType === 'PDT003'
                ? styles.ARRIVED
                : styles.OFFICE,
              {
                justifyContent: 'center',
                alignItems: 'center',
                gap: 5,
                borderColor: '#000',
                borderWidth: 0.5
              }
            ]}>
            <Ionicons
              color={'#000'}
              name={
                orderSelected?.distributeType === 'PDT001'
                  ? 'home'
                  : orderSelected?.distributeType === 'PDT002'
                  ? 'bag-handle'
                  : orderSelected?.distributeType === 'PDT003'
                  ? 'cube'
                  : 'business'
              }
              size={15}
            />
            <Text style={{padding: 2, color: '#000', fontSize: 20}}>
              {orderSelected?.distributeType === 'PDT001'
                ? `${t('od_type_warehouse')}`
                : orderSelected?.distributeType === 'PDT002'
                ? `${t('od_type_express')}`
                : orderSelected?.distributeType === 'PDT003'
                ? `${t('od_type_self')}`
                : `${t('od_type_office')}`}
            </Text>
          </View>
        </View>

        <View style={[styles.row, {gap: 2, justifyContent: 'flex-start'}]}>
          <Text style={{color: '#000', fontSize: 20}}>{t('status')}:</Text>
          <View
            style={[
              styles.status,

              orderSelected?.status === 'CLOSED'
                ? {backgroundColor: '#2FC58B'}
                : orderSelected?.status === 'ONSHIP'
                ? {backgroundColor: '#009DFF'}
                : {backgroundColor: '#FF2F61'}
            ]}>
            <Text style={{padding: 2, color: '#FFF', fontSize: 18}}>
              {orderSelected?.status}
            </Text>
          </View>
        </View>
      </View>

      {order_id && <TabViewList_2 detail={detail} />}
      {order_id && <Scan detail={detail} distribute_id={order_id} />}
      {/* <PagerView
        style={{width: '100%', height: 375}}
        initialPage={1}
        pageMargin={10}>
        {order_id && <TabViewList_2 key="2" detail={detail} />}
        {order_id && (
          <Scan
            key="1"
            detail={detail}
            checkScan={checkScan}
            distribute_id={order_id}
          />
        )}
      </PagerView> */}

      {order_id && (
        <TouchableOpacity
          style={[
            styles.signatureBox,
            !currentSign && {
              borderWidth: 1,
              borderStyle: 'dashed',
              borderColor: '#7A7A7A'
            }
          ]}
          onPress={() => toggleSetState(ToggleState.SIGNATURE)}
          disabled={orderSelected?.status !== 'ONSHIP'}>
          {currentSign !== null || orderSelected?.signature_img ? (
            <View style={styles.preview}>
              {currentSign ? (
                <FastImage
                  resizeMode={FastImage.resizeMode.contain}
                  source={{
                    uri: currentSign,
                    priority: FastImage.priority.normal
                  }}
                  style={{width: '100%', height: 180}}
                />
              ) : (
                <Image
                  resizeMode={'contain'}
                  style={{width: '100%', height: 180}}
                  source={{
                    uri: `${path.IMG}/${orderSelected?.signature_img}`
                  }}
                />
              )}
            </View>
          ) : (
            <View style={styles.imageUpload}>
              <Ionicons name="pencil" size={40} color="#4d4d4d" />
              <Text style={{color: '#000', fontSize: 20}}>{`${t(
                'signature'
              )}`}</Text>
            </View>
          )}

          {toggleState === ToggleState.SIGNATURE && (
            <ModalSignature
              set={setCurrentSign}
              visible={true}
              setVisible={() => toggleSetState(null)}
            />
          )}
        </TouchableOpacity>
      )}

      {/* {detail?.every((el) => el.status !== 'ONSHIP') &&
        orderSelected?.status === 'ONSHIP' && ( */}

      {order_id && (
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            disabled={orderSelected?.status !== 'ONSHIP'}
            style={[
              styles.button,
              styles.shadow,
              styles.row,
              {justifyContent: 'center', gap: 10},
              {
                backgroundColor:
                  orderSelected?.status === 'ONSHIP' ? '#ABFC74' : '#ccc'
              }
            ]}
            onPress={onPressConfirm}>
            {loading ? (
              <ActivityIndicator size={25} />
            ) : (
              <Ionicons name={'checkmark-outline'} size={25} color={'#000'} />
            )}

            <Text
              style={[
                {
                  color: '#183B00',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  fontSize: 20
                }
              ]}>
              {t('confirm')}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  )
}

// ----------------------------------------------------------
// == COMPONENT
// ----------------------------------------------------------
const ItemDetail = React.memo(({item, detailSelected}) => {
  const {t} = useTranslation()

  return (
    <TouchableOpacity
      style={[styles.item, styles.shadow]}
      onPress={item?.status === 'ONSHIP' ? () => detailSelected(item) : null}>
      <View
        style={[
          styles.itemHeader,
          item.status === 'CLOSED'
            ? {backgroundColor: '#2FC58B'}
            : item.status === 'ONSHIP'
            ? {backgroundColor: '#009DFF'}
            : {backgroundColor: '#AE100F'}
        ]}>
        <Text style={styles.textHeader}>
          {t('receipt_no')}: {item.receipt_no}
        </Text>
      </View>
      <View style={styles.itemContent}>
        <Text style={{color: '#000'}}>
          {t('customer')}: {item.customer_id}
          {item?.collection && `-${item.collection}`}
        </Text>
        <Text style={{color: '#000'}}>
          {t('item_no')}: {item.item_no}
        </Text>
        <Text style={{color: '#000'}}>
          {t('tracking_four')}:{' '}
          {item.item_serial === null ? ' -' : item.item_serial}
        </Text>
        <Text style={{color: '#000'}}>
          {t('tracking_no')}: {item.tracking_no ? item.tracking_no : ' -'}
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
          {t('item_name')}: {item.item_name}
        </Text>
        <Text style={{color: '#000'}}>
          {t('box_amount')} （{t('box')}）: {item.qty_box}
        </Text>
        <Text style={{color: '#000'}}>
          {t('box_amount_actual')} （{t('box')}）: {item.qty_box_avail}
        </Text>
        <Text style={{flex: 1, flexWrap: 'wrap', color: '#000'}}>
          {t('annotations')}: {item.remark ? item.remark : ` -`}
        </Text>
        <Text style={{flex: 1, flexWrap: 'wrap', color: '#000'}}>
          {t('instructions')}:{' '}
          {item.shipping_Instructions ? item.shipping_Instructions : ` -`}
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
          {t('status')}: {item.status}
        </Text>
      </View>
    </TouchableOpacity>
  )
})

// ----------------------------------------------------------
// == STYLE
// ----------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: 5
    // overflow: 'hidden',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemHeader: {
    backgroundColor: '#AE100F',
    padding: 10
  },
  textHeader: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold'
  },

  itemContent: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10
  },
  item: {
    marginVertical: 8,
    // marginTop: 8,
    overflow: 'hidden',
    borderRadius: 8
  },
  status: {
    marginLeft: 5,
    paddingHorizontal: 3,
    paddingVertical: 1,
    borderRadius: 5,

    fontWeight: 'bold'
  },
  PICKED: {
    backgroundColor: '#CFFFAE',
    color: '#183B00'
  },
  ONSHIP: {
    backgroundColor: '#B5E3FF',
    color: '#003F67'
  },
  ARRIVED: {
    backgroundColor: '#FFC4D2',
    color: '#4A0011'
  },
  OFFICE: {
    backgroundColor: '#E0C9FF',
    color: '#5719AA'
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 15,
    marginBottom: 15
  },
  button: {
    flex: 1,
    maxWidth: '100%',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center'
  },
  shadow: {
    shadowOffset: {width: 0, height: 2},
    shadowColor: '#171717',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2
  },
  signatureBox: {
    marginTop: 15,
    height: 200,
    backgroundColor: '#F0F0F0',
    borderRadius: 5
  },
  preview: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageUpload: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default ScanReceiveDetail
