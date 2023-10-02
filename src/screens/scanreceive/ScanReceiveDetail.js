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
  Platform
} from 'react-native'

import Ionicons from 'react-native-vector-icons/Ionicons'
import {Empty} from '../../components/SpinnerEmpty'

import ModalScan from './ModalScan'

// Global Modal
import ModalCamera from '../../components/ModalCamera'
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
  fetchOrderSelect,
  sendItemConfirm,
  sendOrderConfirm
} from '../../apis'

const ToggleState = {
  SCAN: 'SCAN',
  SIGNATURE: 'SIGNATURE',
  CAMERA: 'CAMERA'
}

const ScanReceiveDetail = ({navigation, route}) => {
  const {order_id} = route?.params

  const [list, setList] = useState(false)
  const [done, setDone] = useState(false)

  const [toggleState, setToggleState] = useState(null)
  const [toggleButton, setToggleButton] = useState(false)

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

  const {boxAvail, updateAvailBox} = useScan()

  const dispatch = useDispatch()

  // == API
  // =================================================================
  const fetchOrderDetail_API = async distribution_id => {
    const detail = await fetchOrderDetail(distribution_id)
    setDetail(detail.data)
  }

  const fetchOrderItem_API = async ({order_id, item_id}) => {
    const item = await fetchOrderItem({order_id, item_id})
    setItem(item.data[0])
  }

  const fetchOrderSelect_API = async distribution_id => {
    const order = await fetchOrderSelect(distribution_id)
    setOrderSelected(order.data[0])
  }

  // == EFFECT
  // =================================================================
  useEffect(() => {
    fetchOrderSelect_API(order_id)
  }, [])

  useEffect(() => {
    orderSelected && fetchOrderDetail_API(orderSelected?.distribution_id)
  }, [orderSelected])

  useEffect(() => {
    if (orderSelected) {
      setTab()
      setToggleButton(orderSelected?.status !== 'CLOSED' ? true : false)
    }
  }, [detail])

  useEffect(() => {
    orderSelected && fetchOrderSelect_API(orderSelected?.distribution_id)
  }, [toggleButton])

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

  // == TOGGLE MODAL
  // =================================================================
  const toggleSetState = newToggleState => {
    if (toggleState === newToggleState) {
      setToggleState(null) // Toggle off if pressed again
    } else {
      setToggleState(newToggleState)
    }
  }

  const toggleButtonTab = msg => {
    if (msg === 'done') {
      setDone(true)
      setList(false)
    } else {
      setList(true)
      setDone(false)
    }
  }

  const setTab = () => {
    if (detail?.filter(el => el.status === 'ONSHIP').length > 0) {
      toggleButtonTab('list')
    } else {
      toggleButtonTab('done')
    }
  }

  // == HANDLE
  // =================================================================
  const handleSetDetailSelected = target => {
    setDetailSelected(target)
    target?.status === 'ONSHIP' && setToggleState(ToggleState.SCAN)
  }

  const onPressForceConfirm = async (message, status = null) => {
    setRemark(message)
    setForce(status)
  }

  const onPressScanConfirm = async () => {
    await updateAvailBox(detailSelected?.item_no, boxAvail)

    await sendItemConfirm(
      {
        distribution_id: orderSelected?.distribution_id,
        item_no: detailSelected?.item_no,
        status: 'CLOSED',
        // force_confirm: force,
        // remark: remark,
        maker: userName
      },
      refresh
    ).catch(err => {
      console.log(err.message)
      dispatch(resetToken())

      if (err.message == 401) {
        alertReUse('auth_access_denied', 'auth_access_denied_detail')
      }

      alertReUse('auth_access_denied', 'auth_access_denied_detail')
    })

    await fetchOrderItem_API({
      order_id: orderSelected?.distribution_id,
      item_id: detailSelected?.item_no
    })

    toast.show(t('confirmed'), {
      type: 'success',
      placement: 'bottom',
      duration: 4000,
      offset: 30,
      animationType: 'slide-in'
    })

    setToggleState(null)
  }

  const onPressConfirm = async status => {
    const imgName = currentImage?.split('/').pop()
    const imgType = imgName?.split('.').pop()
    const signName = currentSign?.split('/').pop()
    const signType = signName?.split('.').pop()

    if (status) {
      // CHECK Item Detail Status !
      if (detail?.filter(el => el.status === 'ONSHIP').length > 0) {
        alertReUse('load_invalid', 'load_invalid_detail')
      } else {
        // CHECK Signature required !
        // if (currentSign === null) {
        //     Alert.alert(
        //         'Signature must be required...!',
        //         `Please fill your signature.`
        //     )
        // } else {
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

        currentImage !== null
          ? obj.append('files', {
              uri: currentImage,
              name: `ITEM-OD.${imgType}`,
              type: `image/${imgType}`
            })
          : obj.append('files', null)

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

        await sendOrderConfirm(obj, refresh).catch(err => {
          console.log(err.message)

          console.log(err)

          if (err.message == 401) {
            dispatch(resetToken())
            alertReUse('auth_access_denied', err.message)
          }

          alertReUse('auth_access_denied', 'auth_access_denied_detail')
        })

        // sendConfirm({
        //     distribution_id: orderSelected?.distribution_id,
        //     status:
        //         orderSelected?.distributeType !== 'PDT002'
        //             ? 'CLOSED'
        //             : 'WAITING',
        //     last_update: `${moment().format(
        //         'YYYY-MM-DDTHH:mm:ss.SSS'
        //     )}Z`,
        //     update_by: 'b0_test',
        // })

        toast.show(t('confirmed'), {
          type: 'success',
          placement: 'bottom',
          duration: 4000,
          offset: 30,
          animationType: 'slide-in'
        })

        dispatch(setFilterRe('CLOSED'))

        setToggleButton(false)
        // }
      }
    }

    // else {
    //     // TEST: cancel
    //     // ==============================
    //     sendConfirm(
    //         {
    //             distribution_id: orderSelected?.distribution_id,
    //             status: 'DATA ENTRY',
    //             last_update: `${moment().format(
    //                 'YYYY-MM-DDTHH:mm:ss.SSS'
    //             )}Z`,
    //             update_by: 'b0_test',
    //         },
    //         refresh
    //     )

    //     toast.show('REVERSE Successfully', {
    //         type: 'warning',
    //         placement: 'bottom',
    //         duration: 4000,
    //         offset: 30,
    //         animationType: 'slide-in',
    //     })

    //     setToggleButton(true)
    // }
  }

  const alertReUse = (msg, detail) => {
    Platform.OS === 'android'
      ? Alert.alert(t(msg), t(detail))
      : alert(t(msg), t(detail))
  }

  const _renderDetail = ({item}) => {
    return <ItemDetail item={item} detailSelected={handleSetDetailSelected} />
  }

  // == COMPONENT DistributeDetail
  // =================================================================
  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View
        style={[
          styles.itemContent,
          styles.shadow,
          {
            backgroundColor: '#FFF',
            borderRadius: 5,
            marginVertical: 10
          }
        ]}>
        <Text style={{color: '#000'}}>
          {t('receipt')}: {orderSelected?.distribution_id}
        </Text>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center'
          }}>
          <Text style={{color: '#000'}}>{t('transport_type')}: </Text>
          <View
            style={[
              styles.status,
              orderSelected?.distributeType === 'PDT001'
                ? styles.PICKED
                : orderSelected?.distributeType === 'PDT002'
                ? styles.ONSHIP
                : styles.ARRIVED,
              {
                justifyContent: 'center',
                alignItems: 'center'
              }
            ]}>
            <Text style={{padding: 2}}>
              {orderSelected?.distributeType === 'PDT001'
                ? `${t('od_type_warehouse')}`
                : orderSelected?.distributeType === 'PDT002'
                ? `${t('od_type_express')}`
                : `${t('od_type_self')}`}
            </Text>
          </View>
        </View>
      </View>

      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          borderRadius: 2.5,
          borderWidth: 0.2,
          height: 40,
          marginBottom: 5
        }}>
        <TouchableOpacity
          style={[
            {
              flex: 1,
              alignItems: 'center',
              height: '100%',
              justifyContent: 'center',
              borderRadius: 8
            },
            list
              ? {backgroundColor: '#AE100F'}
              : {backgroundColor: 'transparent'}
          ]}
          onPress={() => toggleButtonTab('list')}>
          <Text style={list ? {color: '#fff'} : {color: '#000'}}>
            {t('od_waiting')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            {
              flex: 1,
              alignItems: 'center',
              height: '100%',
              justifyContent: 'center',
              flexDirection: 'row',
              borderRadius: 8,
              gap: 5
            },
            done
              ? {backgroundColor: '#AE100F'}
              : {backgroundColor: 'transparent'}
          ]}
          onPress={() => toggleButtonTab('done')}>
          <Text style={done ? {color: '#fff'} : {color: '#000'}}>
            {t('od_confirm')}
          </Text>
          {!done && (
            <View
              style={{
                backgroundColor: '#2FC58B',
                borderRadius: 50,
                width: 15,
                alignItems: 'center',
                justifyContent: 'center'
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 10
                }}>
                {!done && detail?.filter(el => el.status !== 'ONSHIP').length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {list && !done ? (
        <FlatList
          keyboardShouldPersistTaps="handled"
          keyExtractor={el => el.row_id}
          data={detail?.filter(el => el.status === 'ONSHIP')}
          initialNumToRender={6}
          windowSize={5}
          renderItem={_renderDetail}
          ListEmptyComponent={<Empty text={t('od_item_confirmed')} />}
          scrollEnabled={false}
        />
      ) : (
        <FlatList
          keyboardShouldPersistTaps="handled"
          keyExtractor={el => el.row_id}
          data={detail?.filter(el => el.status !== 'ONSHIP')}
          initialNumToRender={6}
          windowSize={5}
          renderItem={_renderDetail}
          ListEmptyComponent={<Empty text={t('od_item_empty')} />}
          scrollEnabled={false}
        />
      )}

      {item && toggleState === ToggleState.SCAN && (
        <ModalScan
          data={item}
          visible={true}
          setVisible={() => toggleSetState(null)}
          confirm={onPressScanConfirm}
          force={force}
          forceConfirm={onPressForceConfirm}
        />
      )}

      {detail?.every(el => el.status !== 'ONSHIP') &&
        orderSelected?.status === 'ONSHIP' && (
          <TouchableOpacity
            style={[styles.signatureBox]}
            onPress={() => toggleSetState(ToggleState.CAMERA)}
            disabled={orderSelected?.status !== 'ONSHIP'}>
            {currentImage !== null || orderSelected?.img_item_onship ? (
              <View style={styles.preview}>
                {currentImage ? (
                  <Image
                    resizeMode={'contain'}
                    style={{width: '100%', height: 180}}
                    source={{
                      uri: currentImage
                    }}
                  />
                ) : (
                  <Image
                    resizeMode={'contain'}
                    style={{width: '100%', height: 180}}
                    source={{
                      uri: `${path.IMG}/${orderSelected?.img_item_onship}`
                    }}
                  />
                )}
              </View>
            ) : (
              <View style={styles.imageUpload}>
                <Ionicons name="image-outline" size={45} color="#4d4d4d" />
                <Text>{`${t('photo')} / ${t('camera')}`}</Text>
              </View>
            )}

            {toggleState === ToggleState.CAMERA && (
              <ModalCamera
                set={setCurrentImage}
                visible={true}
                setVisible={() => toggleSetState(null)}
              />
            )}
          </TouchableOpacity>
        )}

      {detail?.every(el => el.status !== 'ONSHIP') &&
        orderSelected?.status === 'ONSHIP' && (
          <TouchableOpacity
            style={[styles.signatureBox]}
            onPress={() => toggleSetState(ToggleState.SIGNATURE)}
            disabled={orderSelected?.status !== 'ONSHIP'}>
            {currentSign !== null || orderSelected?.signature_onship ? (
              <View style={styles.preview}>
                {currentSign ? (
                  <Image
                    resizeMode="contain"
                    style={{width: '100%', height: 180}}
                    // source={{
                    //     uri: orderSelected?.signature_onship
                    //         ? `${path.IMG}/${orderSelected?.signature_onship}`
                    //         : currentSign,
                    // }}

                    source={{
                      uri: currentSign
                    }}
                  />
                ) : (
                  <Image
                    resizeMode={'contain'}
                    style={{width: '100%', height: 180}}
                    source={{
                      uri: `${path.IMG}/${orderSelected?.signature_onship}`
                    }}
                  />
                )}
              </View>
            ) : (
              <View style={styles.imageUpload}>
                <Ionicons name="pencil" size={40} color="#4d4d4d" />
                <Text>{`${t('signature')}`}</Text>
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

      {detail?.every(el => el.status !== 'ONSHIP') &&
        orderSelected?.status === 'ONSHIP' && (
          <View style={styles.buttonGroup}>
            {toggleButton && (
              <ButtonConfirmComponent
                text={`${t('confirm')}`}
                color="#183B00"
                backgroundColor="#ABFC74"
                onPress={() => onPressConfirm(true)}
              />
            )}
          </View>
        )}
    </ScrollView>
  )
}

// == COMPONENT ItemDetail
// =================================================================
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
        {/* <Text>
                    {t('customer')}: {item.customer_id}
                </Text>
                <Text>
                    {t('phone')}: {item.phone}
                </Text> */}
        <Text style={{color: '#000'}}>
          {t('item_no')}: {item.item_no}
        </Text>
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
          {t('annotations')}: {item.remark ? item.remark : `-`}
        </Text>
        <Text style={{flex: 1, flexWrap: 'wrap', color: '#000'}}>
          {t('instructions')}:{' '}
          {item.shipping_Instructions ? item.shipping_Instructions : `-`}
        </Text>
        <Text style={{color: '#000'}}>
          {t('status')}: {item.status}
        </Text>
      </View>
    </TouchableOpacity>
  )
})

const ButtonConfirmComponent = ({text, color, backgroundColor, onPress}) => {
  return (
    <TouchableOpacity
      style={[styles.button, styles.shadow, {backgroundColor: backgroundColor}]}
      onPress={onPress}>
      <Text
        style={{
          color: color,
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
        {text}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: 10
    // overflow: 'hidden',
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
    backgroundColor: '#4AB800',
    color: '#183B00'
  },
  ONSHIP: {
    backgroundColor: '#009DFF',
    color: '#003F67'
  },
  ARRIVED: {
    backgroundColor: '#FF003C',
    color: '#4A0011'
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
