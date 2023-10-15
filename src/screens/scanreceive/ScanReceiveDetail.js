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
  ActivityIndicator
} from 'react-native'

import Ionicons from 'react-native-vector-icons/Ionicons'
import {Empty} from '../../components/SpinnerEmpty'
import FastImage from 'react-native-fast-image'

import ModalScan from './ModalScan'

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
  fetchOrderSelect,
  sendItemConfirm,
  sendOrderConfirm
} from '../../apis'
import {screenMap} from '../../constants/screenMap'

const ToggleState = {
  SCAN: 'SCAN',
  SIGNATURE: 'SIGNATURE',
  CAMERA: 'CAMERA'
}

const ScanReceiveDetail = ({navigation, route}) => {
  const {order_id} = route?.params

  const [loading, setLoading] = useState(false)

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

  const {boxAvail, updateAvailBox, setBoxAvail} = useScan()

  const dispatch = useDispatch()

  // == API
  // =================================================================
  const fetchOrderDetail_API = async (distribution_id) => {
    const detail = await fetchOrderDetail(distribution_id)
    setDetail(detail.data)
  }

  const fetchOrderItem_API = async ({order_id, item_id}) => {
    const item = await fetchOrderItem({order_id, item_id})
    setItem(item.data[0])
  }

  const fetchOrderSelect_API = async (distribution_id) => {
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
  const toggleSetState = (newToggleState) => {
    if (toggleState === newToggleState) {
      setToggleState(null) // Toggle off if pressed again
    } else {
      setToggleState(newToggleState)
    }
  }

  const toggleButtonTab = (msg) => {
    if (msg === 'done') {
      setDone(true)
      setList(false)
    } else {
      setList(true)
      setDone(false)
    }
  }

  const setTab = () => {
    if (detail?.filter((el) => el.status === 'ONSHIP').length > 0) {
      toggleButtonTab('list')
    } else {
      toggleButtonTab('done')
    }
  }

  // == HANDLE
  // =================================================================
  const handleSetDetailSelected = (target) => {
    setDetailSelected(target)
    target?.status === 'ONSHIP' && setToggleState(ToggleState.SCAN)
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
          offset: 30,
          animationType: 'slide-in'
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

  const onPressConfirm = async (status) => {
    setLoading(!loading)

    const imgName = currentImage?.split('/').pop()
    const imgType = imgName?.split('.').pop()
    const signName = currentSign?.split('/').pop()
    const signType = signName?.split('.').pop()

    if (status) {
      // CHECK Item Detail Status !
      if (detail?.filter((el) => el.status === 'ONSHIP').length > 0) {
        alertReUse('load_invalid', 'load_invalid_detail')
      } else {
        // CHECK Signature required !
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
                offset: 30,
                animationType: 'slide-in'
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

          dispatch(setFilterRe('CLOSED'))

          setToggleButton(false)

          setLoading(false)
        }
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
      ? Alert.alert(t(msg), t(detail), [{onPress: () => setLoading(false)}])
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

        <View style={[styles.row, {gap: 2, justifyContent: 'flex-start'}]}>
          <Text style={{color: '#000'}}>{t('transport_type')}: </Text>
          <View
            style={[
              styles.status,
              styles.row,
              orderSelected?.distributeType === 'PDT001'
                ? styles.PICKED
                : orderSelected?.distributeType === 'PDT002'
                ? styles.ONSHIP
                : styles.ARRIVED,
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
                  : 'business'
              }
              size={15}
            />
            <Text style={{padding: 2, color: '#000'}}>
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
                {!done && detail?.filter((el) => el.status !== 'ONSHIP').length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {list && !done ? (
        <FlatList
          keyboardShouldPersistTaps="handled"
          keyExtractor={(el) => el.row_id}
          data={detail?.filter((el) => el.status === 'ONSHIP')}
          initialNumToRender={6}
          windowSize={5}
          renderItem={_renderDetail}
          ListEmptyComponent={<Empty text={t('od_item_confirmed')} />}
          scrollEnabled={false}
        />
      ) : (
        <FlatList
          keyboardShouldPersistTaps="handled"
          keyExtractor={(el) => el.row_id}
          data={detail?.filter((el) => el.status !== 'ONSHIP')}
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
          navigation={navigation}
        />
      )}

      {/* {detail?.every(el => el.status !== 'ONSHIP') &&
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
        )} */}

      {detail?.every((el) => el.status !== 'ONSHIP') &&
        orderSelected?.status === 'ONSHIP' && (
          <TouchableOpacity
            style={[styles.signatureBox]}
            onPress={() => toggleSetState(ToggleState.SIGNATURE)}
            disabled={orderSelected?.status !== 'ONSHIP'}>
            {currentSign !== null || orderSelected?.signature_onship ? (
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
                      uri: `${path.IMG}/${orderSelected?.signature_onship}`
                    }}
                  />
                )}
              </View>
            ) : (
              <View style={styles.imageUpload}>
                <Ionicons name="pencil" size={40} color="#4d4d4d" />
                <Text style={{color: '#000'}}>{`${t('signature')}`}</Text>
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

      {detail?.every((el) => el.status !== 'ONSHIP') &&
        orderSelected?.status === 'ONSHIP' && (
          <View style={styles.buttonGroup}>
            {toggleButton && (
              <TouchableOpacity
                disabled={loading}
                style={[
                  styles.button,
                  styles.shadow,
                  styles.row,
                  {justifyContent: 'center', gap: 10},
                  loading
                    ? {backgroundColor: '#000'}
                    : {backgroundColor: '#ABFC74'}
                ]}
                onPress={() => onPressConfirm(true)}>
                {loading ? (
                  <ActivityIndicator size={25} color="#FFF" />
                ) : (
                  <Ionicons
                    name={'checkmark-outline'}
                    size={25}
                    color={'#000'}
                  />
                )}

                <Text
                  style={[
                    {
                      color: '#183B00',
                      fontWeight: 'bold',
                      textAlign: 'center'
                    },
                    loading && {color: '#fff'}
                  ]}>
                  {t('confirm')}
                </Text>
              </TouchableOpacity>
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
        <Text style={{color: '#000'}}>
          {t('customer')}: {item.customer_id}
          {item?.collection && `-${item.collection}`}
        </Text>
        <Text style={{color: '#000'}}>
          {t('item_no')}: {item.item_no}
        </Text>
        <Text style={{color: '#000'}}>
          {t('tracking_four')}:
          {item.item_serial === null ? '-' : item.item_serial}
        </Text>
        <Text style={{color: '#000'}}>
          {t('tracking_no')}:{item.tracking_no ? item.tracking_no : ' -'}
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
          {t('annotations')}: {item.remark ? item.remark : `-`}
        </Text>
        <Text style={{flex: 1, flexWrap: 'wrap', color: '#000'}}>
          {t('instructions')}:{' '}
          {item.shipping_Instructions ? item.shipping_Instructions : `-`}
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

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: 10
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
