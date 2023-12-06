import React, {useEffect, useState, useRef, useCallback} from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  FlatList
} from 'react-native'
import debounce from 'lodash.debounce'
import moment from 'moment'
import Ionicons from 'react-native-vector-icons/Ionicons'
import SelectDropdown from 'react-native-select-dropdown'
import TabViewList from './TabViewList'
import ModalHeader from './ModalHeader'
import ModalDetail from './ModalDetail'
import ModalScan from './ModalScan'
// == Global Modal
import ModalCamera from '../../components/ModalCamera'
import ModalSignature from '../../components/ModalSignature'
import {path} from '../../constants/url'
import {useToast} from 'react-native-toast-notifications'
import {useTranslation} from 'react-i18next'
import {useAuthToken, useScan} from '../../hooks'
import {useDispatch} from 'react-redux'
import {resetToken} from '../../store/slices/tokenSlice'
import {
  fetchDetail,
  fetchDetailSelect,
  fetchHeaderSelect,
  hh_sel_box_by_receipt,
  sendConfirm,
  sendDetailConfirm,
  sendShipmentConfirm,
  sendSignature
} from '../../apis'
import {screenMap} from '../../constants/screenMap'
import ContainerAlert from '../../components/ContainerAlert'
import {Empty} from '../../components/SpinnerEmpty'

import PagerView from 'react-native-pager-view'
import Scan from './Scan'
import TabViewList_2 from './TabViewList_2'
import ModalHeaderInfo from '../../components/ModalHeaderInfo'

const ToggleState = {
  HEADER: 'HEADER',
  INFO: 'INFO',
  DETAIL: 'DETAIL',
  SCAN: 'SCAN',
  SIGNATURE: 'SIGNATURE',
  CAMERA: 'CAMERA'
}

const LoadToTruck = ({navigation}) => {
  const [loading, setLoading] = useState(false)
  const [toggleState, setToggleState] = useState(null)
  const [toggleButton, setToggleButton] = useState(false)
  const [headerSelected, setHeaderSelected] = useState(null)
  const [detail, setDetail] = useState(null)
  const [detailSelected, setDetailSelected] = useState(null)
  const [detailInfo, setDetailInfo] = useState(null)
  const [currentSign, setCurrentSign] = useState(null)
  const [currentImage, setCurrentImage] = useState(null)
  const [shipment, setShipment] = useState(null)
  const [force, setForce] = useState(null)
  const [remark, setRemark] = useState(null)
  const [alert, setAlert] = useState(false)
  const [containerOk, setContainerOk] = useState(null)
  const [input, setInput] = useState('')

  const [box, setBox] = useState(null)

  const inputRef = useRef(null)
  const toast = useToast()
  const {t} = useTranslation()
  const {userName, token, refresh} = useAuthToken()
  const {boxAvail, setBoxAvail} = useScan()

  // const scanRef = useRef(null)

  const dispatch = useDispatch()

  const checkScan = (item_no, num) => {
    const res = detail?.findIndex(
      (el) => el.item_no == item_no && num > 0 && num <= Number(el.qty_box)
    )
    return res < 0 ? false : true
  }

  // ----------------------------------------------------------
  // == API
  // ----------------------------------------------------------

  const fetchHeaderSelect_API = async (receipt_no) => {
    const select = await fetchHeaderSelect(receipt_no)
    setHeaderSelected(select.data[0])
    setToggleButton(select.data[0]?.status === 'PICKED' ? true : false)
  }
  const fetchDetail_API = async (receipt_no) => {
    const detail = await fetchDetail(receipt_no)
    setDetail(detail.data)
  }
  const fetchDetailSelect_API = async ({header_id, detail_id}) => {
    const select = await fetchDetailSelect({header_id, detail_id})
    setDetailSelected(select.data[0])
  }

  useEffect(() => {
    const fetch_hh_sel_box_by_receipt = async () => {
      try {
        const res = await hh_sel_box_by_receipt(headerSelected?.receipt_no)

        setBox(res)
      } catch (error) {}
    }

    if (headerSelected?.receipt_no) {
      fetch_hh_sel_box_by_receipt()
    }
  }, [headerSelected?.receipt_no])

  // ----------------------------------------------------------
  // == EFFECT
  // ----------------------------------------------------------
  useEffect(() => {
    inputRef.current && inputRef.current?.focus()
  }, [])
  useEffect(() => {
    headerSelected?.receipt_no && fetchDetail_API(headerSelected?.receipt_no)
  }, [headerSelected?.receipt_no])
  useEffect(() => {
    headerSelected?.receipt_no &&
      fetchHeaderSelect_API(headerSelected?.receipt_no)
  }, [toggleButton])
  useEffect(() => {
    headerSelected?.receipt_no && fetchDetail_API(headerSelected?.receipt_no)
  }, [detailSelected])
  useEffect(() => {
    debouncedSearch()
    return debouncedSearch.cancel
  }, [input, debouncedSearch])

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
  const search = () => {
    input?.length !== 0 && fetchHeaderSelect_API(input)
  }
  const debouncedSearch = useCallback(debounce(search, 750), [input])
  const handleChangeTextInput = (text) => {
    const upper = text.toUpperCase()
    setInput(upper)
  }
  const handleSetHeaderSelected = (target) => {
    setToggleButton(target.status === 'PICKED' ? true : false)
    setToggleState(null)
    setCurrentSign(null)
    setCurrentImage(null)
    setInput('')
    setShipment(null)
    setContainerOk(null)
    setHeaderSelected(target)
  }
  const handleSetDetailSelected = (target) => {
    setDetailSelected(target)
    target?.status !== 'LOADED' && setToggleState(ToggleState.SCAN)
  }
  const handleSetDetailInfo = (target) => {
    setDetailInfo(target)
    setToggleState(ToggleState.DETAIL)
  }
  const onPressClear = () => {
    setHeaderSelected(null)
    setDetail(null)
    setDetailSelected(null)
    setCurrentImage(null)
    setCurrentSign(null)
    setInput('')
    setShipment(null)
    setContainerOk(null)
    inputRef.current?.focus()
  }
  const onPressForceConfirm = async (message, status = null) => {
    setRemark(message)
    setForce(status)
  }
  const onPressScanConfirm = async () => {
    await sendDetailConfirm(
      {
        receipt_no: headerSelected?.receipt_no,
        item_no: detailSelected?.item_no,
        status: 'LOADED',
        force_confirm: force,
        remark: remark,
        qty_box_avail: boxAvail,
        update_by: userName
      },
      refresh
    )
      .then(() => {
        toast.show(t('confirmed'), {
          type: 'success',
          placement: 'bottom',
          duration: 4000,
          offset: 30
          // animationType: 'slide-in'
        })
      })
      .catch((err) => {
        // console.log(err.message)

        if (err.message == 401) {
          dispatch(resetToken())
          navigation.reset({index: 0, routes: [{name: screenMap.Login}]})

          alertReUse('auth_access_denied', 'auth_access_denied_detail')
        }
        alertReUse('auth_access_denied', 'auth_access_denied_detail')
      })

    await fetchDetailSelect_API({
      header_id: headerSelected?.receipt_no,
      detail_id: detailSelected?.item_no
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
      // if (detail?.filter((el) => el.status === 'PICKED').length > 0) {
      if (false) {
        alertReUse('load_invalid', 'load_invalid_detail')
      } else if (shipment === null) {
        alertReUse('load_shipment', 'load_shipment_detail')
      } else {
        // CHECK Signature required !
        if (currentSign === null) {
          alertReUse('signature_required', 'signature_required_detail')
        } else {
          if (containerOk !== null) {
            // SENT ITEM PICKED --> ONSHIP
            // ==============================
            const obj = new FormData()

            obj.append('files', {
              uri: currentSign,
              name: `SIGNATURE-1.${signType}`,
              type: `image/${signType}`
            })

            currentImage !== null
              ? obj.append('files', {
                  uri: currentImage,
                  name: `ITEM-02.${imgType}`,
                  type: `image/${imgType}`
                })
              : obj.append('files', null)

            obj.append('receipt_no', headerSelected?.receipt_no)
            obj.append('status', 'ONSHIP')

            await sendSignature(obj, refresh).catch((err) => {
              // console.log(err.message)
            })
            await sendShipmentConfirm(
              {
                receipt_no: headerSelected?.receipt_no,
                shipment_confirm:
                  headerSelected?.shipment === (shipment === 0 ? 'car' : 'ship')
                    ? null
                    : 1
              },
              refresh
            ).catch((err) => {
              console.log(err.message)
            })

            await sendConfirm(
              {
                receipt_no: headerSelected?.receipt_no,
                statusHeader: 'ONSHIP',
                statusDetail: 'LOADED',
                date: `${moment().format('YYYY-MM-DDTHH:mm:ss.SSS')}Z`,
                maker: userName,
                container_no: containerOk
              },
              refresh
            )
              .then(() => {
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
                  navigation.reset({
                    index: 0,
                    routes: [{name: screenMap.Login}]
                  })
                  alertReUse('auth_access_denied', 'auth_access_denied_detail')
                }
                alertReUse('auth_access_denied', 'auth_access_denied_detail')
              })

            headerSelected?.shipment !== (shipment === 0 ? 'car' : 'ship') &&
              alertReUse('load_alert', 'load_alert_detail')

            setCurrentImage(null)
            setCurrentSign(null)
            setContainerOk(null)
            setToggleButton(false)
            setLoading(false)
          } else {
            setAlert(!alert)
          }
        }
      }
    }
  }
  const alertReUse = (msg, detail) => {
    Platform.OS === 'android'
      ? Alert.alert(t(msg), t(detail), [{onPress: () => setLoading(false)}])
      : alert(t(msg), t(detail))
  }
  const handleContainerClose = () => {
    setAlert(!alert)
    setLoading(false)
    Keyboard.dismiss()
  }

  // const renderItem = useCallback(({item}) => {
  //   return <ScanItem item={item} />
  // }, [])

  // ----------------------------------------------------------
  // == MAIN
  // ----------------------------------------------------------
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView
        // onLayout={() => inputRef.current?.focus()}

        style={styles.container}
        scrollEnabled={true}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled">
        <View style={styles.form}>
          <View
            style={[
              styles.row,
              {
                gap: 0,
                justifyContent: 'space-evenly'
              }
            ]}>
            <View flex={0.4}>
              <Text style={{color: '#000', fontSize: 20}}>
                {t('transport_type')}:{' '}
              </Text>
            </View>
            <View style={{flex: 0.6}}>
              <SelectDropdown
                data={[`${t('car')}`, `${t('ship')}`]}
                buttonStyle={[
                  {
                    borderRadius: 5,
                    backgroundColor: '#D2D2D2',
                    height: 40,
                    width: '100%'
                  },
                  shipment === null && {
                    borderWidth: 1,
                    borderStyle: 'dashed',
                    borderColor: '#7A7A7A'
                  }
                ]}
                buttonTextStyle={{fontSize: 16}}
                rowTextStyle={{fontSize: 16}}
                defaultButtonText={t('transport_select')}
                dropdownStyle={{borderRadius: 5, marginTop: 0}}
                onSelect={(selectedItem, index) => {
                  // console.log(selectedItem, index)
                  setShipment(index)
                }}
                buttonTextAfterSelection={(selectedItem, index) =>
                  shipment === null ? t('transport_select') : selectedItem
                }
                rowTextForSelection={(item, index) => item}
              />
            </View>
          </View>

          {/* RECEIPT */}
          <View style={{display: 'flex', flexDirection: 'column', gap: 0}}>
            <View>
              <Text style={{color: '#000', fontSize: 20}}>
                {t('receipt_no')}
              </Text>
            </View>
            <View style={styles.groupForm}>
              <View style={{flex: 0.7}}>
                <TextInput
                  ref={inputRef}
                  style={[
                    styles.groupInput,
                    {
                      fontWeight: 'normal',
                      flex: 0.75,
                      color: '#000',
                      fontSize: 20
                    },
                    headerSelected?.status_hh === 'EDITING'
                      ? {
                          backgroundColor: '#FFDA4A',
                          borderColor: '#000',
                          borderWidth: 1
                        }
                      : {backgroundColor: '#D2D2D2'}
                  ]}
                  onChangeText={handleChangeTextInput}
                  placeholder={t('enter_barcode')}
                  placeholderTextColor="#000"
                  value={headerSelected ? headerSelected?.receipt_no : input}
                  editable={true}
                  blurOnSubmit={false}
                  onSubmitEditing={Keyboard.dismiss}
                />
              </View>

              <TouchableOpacity
                disabled={!headerSelected}
                style={[
                  {
                    flex: 0.15,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }
                ]}
                onPress={() => toggleSetState(ToggleState.INFO)}>
                <Ionicons
                  style={styles.rightIcon}
                  name={'newspaper-outline'}
                  size={30}
                  color={headerSelected ? '#58C21075' : '#ccc'}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.clearButton,
                  styles.shadow,
                  {
                    backgroundColor: '#2a52be',
                    flex: 0.3
                  }
                ]}
                onPress={() => toggleSetState(ToggleState.HEADER)}>
                <View style={[styles.row, {justifyContent: 'center', gap: 1}]}>
                  <Ionicons
                    style={{alignSelf: 'center'}}
                    // name={'document-text-outline'}
                    name={'document-text-outline'}
                    size={20}
                    color="#fff"
                  />
                  <Text
                    style={[
                      {
                        color: '#fff',
                        fontSize: 20,
                        textAlign: 'center'
                      }
                    ]}>
                    {t('receipt')}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 5,
              justifyContent: 'space-between'
            }}>
            <View style={{display: 'flex', flex: 0.3, flexDirection: 'column'}}>
              <View>
                <Text style={{color: '#000', fontSize: 20}}>
                  {t('container_no')}
                </Text>
              </View>
              <TouchableOpacity
                disabled={!headerSelected && true}
                onPress={() =>
                  headerSelected?.status === 'PICKED' && setAlert(!alert)
                }>
                <TextInput
                  style={[
                    styles.groupInput,
                    {
                      backgroundColor: '#D2D2D2',
                      fontWeight: 'bold',
                      fontSize: 20,
                      color: '#000',
                      textAlign: 'center'
                    },
                    containerOk === null && {
                      borderWidth: 1,
                      borderStyle: 'dashed',
                      borderColor: '#7A7A7A'
                    }
                  ]}
                  defaultValue={headerSelected?.container_no}
                  value={containerOk && containerOk}
                  editable={false}
                />
              </TouchableOpacity>
            </View>

            <View style={{display: 'flex', flex: 0.4, flexDirection: 'column'}}>
              <View>
                <Text style={{color: '#000', fontSize: 20}}>
                  {t('customer')}
                </Text>
              </View>
              <TextInput
                style={[
                  styles.groupInput,
                  {
                    backgroundColor: '#D2D2D2',
                    fontWeight: 'bold',
                    color: '#000',
                    fontSize: 20
                  }
                ]}
                defaultValue={headerSelected?.customer_id}
                editable={false}
              />
            </View>

            <View
              style={{
                display: 'flex',
                flex: 0.3,
                justifyContent: 'flex-end'
              }}>
              <TouchableOpacity
                style={[
                  styles.clearButton,
                  styles.shadow,
                  {backgroundColor: '#AE100F'}
                ]}
                onPress={() => onPressClear()}>
                <View style={[styles.row, {justifyContent: 'center', gap: 1}]}>
                  <Ionicons
                    style={{alignSelf: 'center'}}
                    // name={'document-text-outline'}
                    name={'trash-bin-outline'}
                    size={20}
                    color="#fff"
                  />
                  <Text
                    style={[
                      {
                        color: '#fff',
                        fontSize: 20,
                        textAlign: 'center'
                      }
                    ]}>
                    {t('clear')}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {toggleState === ToggleState.HEADER && (
          <ModalHeader
            headerSelected={headerSelected?.receipt_no}
            onPress={handleSetHeaderSelected}
            visible={true}
            setVisible={() => toggleSetState(null)}
          />
        )}

        {/* {headerSelected && detail?.length > 0 && (
          <TabViewList detail={detail} />
        )} */}

        {headerSelected && detail?.length > 0 && (
          <TabViewList_2 detail={detail} />
        )}

        {headerSelected && (
          <Scan detail={detail} checkScan={checkScan} data={headerSelected} />
        )}

        {headerSelected && toggleState === ToggleState.INFO && (
          <ModalHeaderInfo
            data={headerSelected}
            visible={toggleState === ToggleState.INFO}
            setVisible={() => toggleSetState(null)}
          />
        )}

        {headerSelected?.container_no && (
          <ContainerAlert
            visible={alert}
            onClose={handleContainerClose}
            // forceConfirm={forceConfirm}
            container_no={headerSelected?.container_no}
            setContainerOk={setContainerOk}
            containerOk={containerOk}
          />
        )}

        <View>
          {headerSelected && (
            <TouchableOpacity
              style={[styles.signatureBox]}
              onPress={() => toggleSetState(ToggleState.CAMERA)}
              disabled={headerSelected?.status === 'ONSHIP'}>
              {currentImage !== null || headerSelected?.img_item_onship ? (
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
                        uri: `${path.IMG}/${headerSelected?.img_item_onship}`
                      }}
                    />
                  )}
                </View>
              ) : (
                <View style={styles.imageUpload}>
                  <Ionicons name="image-outline" size={45} color="#4d4d4d" />
                  <Text style={{color: '#000', fontSize: 20}}>{`${t(
                    'photo'
                  )} / ${t('camera')}`}</Text>
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

          {headerSelected && (
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
              disabled={headerSelected?.status === 'ONSHIP'}>
              {currentSign !== null || headerSelected?.signature_onship ? (
                <View style={styles.preview}>
                  {currentSign ? (
                    <Image
                      resizeMode="contain"
                      style={{width: '100%', height: 180}}
                      source={{
                        uri: currentSign
                      }}
                    />
                  ) : (
                    <Image
                      resizeMode={'contain'}
                      style={{width: '100%', height: 180}}
                      source={{
                        uri: `${path.IMG}/${headerSelected?.signature_onship}`
                      }}
                    />
                  )}
                </View>
              ) : (
                <View style={[styles.imageUpload]}>
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

          {headerSelected && (
            <View style={styles.buttonGroup}>
              {headerSelected?.status !== 'ARRIVED' &&
              detail?.every((el) => el.status !== 'UNLOADED') ? (
                toggleButton ? (
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
                ) : (
                  <ButtonConfirmComponent
                    text={`${t('success')}`}
                    color="#000"
                    backgroundColor="#fff"
                  />
                )
              ) : (
                <ButtonConfirmComponent
                  text={`${t('success')}`}
                  color="#000"
                  backgroundColor="#fff"
                />
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
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

// ----------------------------------------------------------
// == STYLE
// ----------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
    paddingTop: 10,
    backgroundColor: '#fff'
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  form: {
    display: 'flex',

    flexDirection: 'column',
    justifyContent: 'center',
    gap: 8
  },
  groupForm: {
    display: 'flex',
    flexDirection: 'row',
    gap: 8
  },
  groupInput: {
    backgroundColor: '#F4F4F4',
    borderColor: '#7A7A7A',
    borderRadius: 5,
    paddingHorizontal: 6,
    width: '100%'
  },
  tab: {
    flex: 1
  },
  clearButton: {
    padding: 10,
    borderRadius: 5,
    paddingVertical: 15
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 15,
    marginBottom: 20
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

export default React.memo(LoadToTruck)
