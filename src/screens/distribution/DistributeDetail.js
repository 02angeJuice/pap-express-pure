import React, {useState, useEffect, createRef} from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  Linking,
  TouchableWithoutFeedback,
  Switch
} from 'react-native'

import Ionicons from 'react-native-vector-icons/Ionicons'
import FastImage from 'react-native-fast-image'
// Global Modal
// import ModalCamera from '../../components/ModalCamera'
import ModalSignature from '../../components/ModalSignature'

// import SelectDropdown from 'react-native-select-dropdown'

import {useToast} from 'react-native-toast-notifications'
import {useTranslation} from 'react-i18next'
import {useAuthToken} from '../../hooks'
import {useDispatch} from 'react-redux'
import {resetToken} from '../../store/slices/tokenSlice'
import {setFilterDi} from '../../store/slices/settingSlice'
import {setfetchfocus} from '../../store/slices/focusSlice'

import {
  fetchOrderDetail,
  hh_sel_box_by_od,
  hh_sel_distributes_by_id,
  selTruckList,
  sendOrderConfirm
} from '../../apis'
import {screenMap} from '../../constants/screenMap'

import TabViewList_2 from './TabViewList_2'
import Scan from './Scan'
import {Empty} from '../../components/SpinnerEmpty'
import {path} from '../../constants/url'
import Information from './Information'

const ToggleState = {
  SCAN: 'SCAN',
  SIGNATURE: 'SIGNATURE',
  CAMERA: 'CAMERA'
}

const DistributeDetail = ({navigation, route}) => {
  const {order_id} = route?.params
  const [redata, setredata] = useState(false)

  const [loading, setLoading] = useState(false)
  const [toggleState, setToggleState] = useState(null)
  const [orderSelected, setOrderSelected] = useState(null)
  const [detail, setDetail] = useState(null)
  const [currentSign, setCurrentSign] = useState(null)
  const [currentImage, setCurrentImage] = useState(null)
  const [force, setForce] = useState(null)
  const [remark, setRemark] = useState(null)

  const [truckList, setTruckList] = useState([])
  const [selectTruck, setSelectTruck] = useState(null)

  const toast = useToast()
  const {t} = useTranslation()
  const {userName, refresh} = useAuthToken()

  const ref = createRef(null)

  const dispatch = useDispatch()

  // ----------------------------------------------------------
  // == API
  // ----------------------------------------------------------
  const fetchOrderDetail_API = async (distribution_id) => {
    const res = await fetchOrderDetail(distribution_id)
    setDetail(res.data)
  }
  const fetchOrderSelect_API = async (distribution_id) => {
    const order = await hh_sel_distributes_by_id(distribution_id)
    setOrderSelected(order?.data[0])
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
    const fetchTruckList = async () => {
      let result = await selTruckList({
        page: 1,
        perPage: 100
      })

      if (result.status) {
        const formattedTruckList = result?.data?.dataList.map((truck) => ({
          label: truck.truck_no,
          value: truck.truck_no
        }))

        console.log(formattedTruckList)

        setTruckList(formattedTruckList)
      }
    }
    fetchTruckList()
  }, [])

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

  const onPressConfirm = async () => {
    const res = await hh_sel_box_by_od(order_id)
    const checkStatus = res
      ?.filter((el) => el.is_scan === 'IDLE')
      .every((el) => el.is_scan_d === 'SCANED')
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

      obj.append('files', null)
      obj.append('id', orderSelected?.distribution_id)
      obj.append(
        'status',
        orderSelected?.distributeType === 'PDT001' ? 'CLOSED' : 'ONSHIP'
      )
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

            alertReUse('auth_access_denied', 'auth_access_denied_detail')
          }

          alertReUse('auth_access_denied', err.message)
        })

      setredata((el) => !el)

      setLoading(false)
    }
    setLoading(false)
  }

  const alertReUse = (msg, detail) => {
    Alert.alert(t(msg), t(detail), [{onPress: () => setLoading(false)}])
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
  if (!orderSelected) {
    return <Empty />
  } else {
    return (
      <TouchableWithoutFeedback onPress={() => dispatch(setfetchfocus())}>
        <ScrollView
          style={styles.container}
          keyboardShouldPersistTaps="handled">
          {orderSelected ? (
            <Information orderSelected={orderSelected} />
          ) : (
            <Empty text={orderSelected && t('empty')} />
          )}

          {order_id && <TabViewList_2 detail={detail} />}

          {order_id && (
            <Scan
              ref={ref}
              detail={detail}
              distribute_id={order_id}
              orderStatus={orderSelected?.status}
            />
          )}

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
              disabled={orderSelected?.status !== 'DATA ENTRY'}>
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
                  <Text style={{color: '#000', fontSize: 18}}>{`${t(
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

          {/* 
      {detail?.every((el) => el.status !== 'DATA ENTRY') &&
        orderSelected?.status === 'DATA ENTRY' && ( */}

          {order_id && (
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                disabled={orderSelected?.status !== 'DATA ENTRY'}
                style={[
                  styles.button,
                  styles.shadow,
                  styles.row,
                  {justifyContent: 'center', gap: 10},

                  {
                    backgroundColor:
                      orderSelected?.status === 'DATA ENTRY'
                        ? '#ABFC74'
                        : '#ccc'
                  }
                ]}
                onPress={onPressConfirm}>
                {loading ? (
                  <ActivityIndicator size={25} />
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
                      textAlign: 'center',
                      fontSize: 18
                    }
                  ]}>
                  {t('confirm')}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </TouchableWithoutFeedback>
    )
  }
}

// ----------------------------------------------------------
// == COMPONENT
// ----------------------------------------------------------

// ----------------------------------------------------------
// == STYLE
// ----------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: 5
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  column: {
    display: 'flex',
    flexDirection: 'column'
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
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc'
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
  },

  dropdownButtonStyle: {
    width: 200,
    height: 50,
    backgroundColor: '#E9ECEF',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26'
  },
  dropdownButtonArrowStyle: {
    fontSize: 28
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8
  },
  dropdownMenuStyle: {
    backgroundColor: '#E9ECEF',
    borderRadius: 8
  },
  dropdownItemStyle: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26'
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8
  }
})

export default DistributeDetail
