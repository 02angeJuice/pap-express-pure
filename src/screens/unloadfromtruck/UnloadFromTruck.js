import React, {useEffect, useState, useRef, useCallback, createRef} from 'react'

import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  TextInput,
  Image,
  Alert,
  Keyboard,
  ActivityIndicator,
  TouchableWithoutFeedback
} from 'react-native'
import debounce from 'lodash.debounce'
import moment from 'moment'
import Ionicons from 'react-native-vector-icons/Ionicons'
import ModalHeader from './ModalHeader'
// == Global Modal
import ModalCamera from '../../components/ModalCamera'
import ModalSignature from '../../components/ModalSignature'
import {path} from '../../constants/url'
import {useToast} from 'react-native-toast-notifications'
import {useTranslation} from 'react-i18next'
import {useAuthToken} from '../../hooks'
import {useDispatch} from 'react-redux'
import {resetToken} from '../../store/slices/tokenSlice'
import {setfetchfocus} from '../../store/slices/focusSlice'
import {
  fetchDetail,
  fetchHeaderSelect,
  hh_sel_box_by_receipt,
  sendConfirm,
  sendSignature
} from '../../apis'
import {screenMap} from '../../constants/screenMap'

import Scan from './Scan'
import TabViewList_2 from './TabViewList_2'
import ModalHeaderInfo from '../../components/ModalHeaderInfo'

const ToggleState = {
  HEADER: 'HEADER',
  INFO: 'INFO',
  SCAN: 'SCAN',
  DETAIL: 'DETAIL',
  SIGNATURE: 'SIGNATURE',
  CAMERA: 'CAMERA'
}

const UnloadFromTruck = ({navigation}) => {
  const [loading, setLoading] = useState(false)
  const [toggleState, setToggleState] = useState(null)
  const [toggleButton, setToggleButton] = useState(false)
  const [headerSelected, setHeaderSelected] = useState(null)
  const [detail, setDetail] = useState(null)
  const [detailSelected, setDetailSelected] = useState(null)
  const [currentSign, setCurrentSign] = useState(null)
  const [currentImage, setCurrentImage] = useState(null)
  const [force, setForce] = useState(null)
  const [remark, setRemark] = useState(null)
  const [input, setInput] = useState('')

  const [redata, setredata] = useState(false)

  const toast = useToast()
  const {t} = useTranslation()
  const {userName, refresh} = useAuthToken()

  const inputRef = useRef(null)
  const ref = createRef(null)

  const dispatch = useDispatch()

  // ----------------------------------------------------------
  // == API
  // ----------------------------------------------------------
  const fetchHeaderSelect_API = async (receipt_no) => {
    const select = await fetchHeaderSelect(receipt_no)
    setHeaderSelected(select.data[0])
    setToggleButton(select.data[0]?.status === 'ONSHIP' ? true : false)
  }
  const fetchDetail_API = async (receipt_no) => {
    const detail = await fetchDetail(receipt_no)
    setDetail(detail.data)
  }
  // ----------------------------------------------------------
  // == EFFECT
  // ----------------------------------------------------------
  useEffect(() => {
    if (ref?.current) {
      ref.current?.focus()
    } else {
      inputRef.current?.focus()
    }
  }, [])

  useEffect(() => {
    headerSelected?.receipt_no.length > 0 &&
      fetchDetail_API(headerSelected?.receipt_no)
  }, [redata, headerSelected?.receipt_no])
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
    setInput(text.toUpperCase())
  }
  const handleSetHeaderSelected = (target) => {
    setToggleButton(target.status === 'ONSHIP' ? true : false)
    setToggleState(null)
    setHeaderSelected(target)
    setCurrentSign(null)
    setCurrentImage(null)
    setInput('')
  }
  const onPressClear = () => {
    setHeaderSelected(null)
    setDetail(null)
    setDetailSelected(null)
    setCurrentImage(null)
    setCurrentSign(null)
    setInput('')
    inputRef.current?.focus()
  }

  const onPressConfirm = async () => {
    const res = await hh_sel_box_by_receipt(headerSelected?.receipt_no)
    const checkStatus = res?.every((el) => el.is_scan === 'IDLE')
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

    // CHECK Item Detail Status !
    // if (detail?.filter((el) => el.status === 'LOADED').length > 0) {
    //   alertReUse('load_invalid', 'load_invalid_detail')

    // alertReUse('load_invalid', 'load_invalid_detail')
    // CHECK Signature required !
    if (currentSign === null) {
      alertReUse('signature_required', 'signature_required_detail')
    } else {
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
      obj.append('status', 'ARRIVED')

      await sendSignature(obj, refresh).catch((err) => {
        console.log(err.message)
      })
      await sendConfirm(
        {
          receipt_no: headerSelected?.receipt_no,
          statusHeader: 'ARRIVED',
          statusDetail: 'UNLOADED',
          date: `${moment().format('YYYY-MM-DDTHH:mm:ss.SSS')}Z`,
          maker: userName
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
            navigation.reset({index: 0, routes: [{name: screenMap.Login}]})
            alertReUse('auth_access_denied', 'auth_access_denied_detail')
          }
          alertReUse('auth_access_denied', 'auth_access_denied_detail')
        })

      setredata((el) => !el)

      setToggleButton(false)
      setLoading(false)
    }

    setLoading(false)
  }

  const alertReUse = (msg, detail) => {
    Alert.alert(t(msg), t(detail), [{onPress: () => setLoading(false)}])
  }

  // ----------------------------------------------------------
  // == MAIN
  // ----------------------------------------------------------
  return (
    <TouchableWithoutFeedback onPress={() => dispatch(setfetchfocus())}>
      <ScrollView
        style={styles.container}
        scrollEnabled={true}
        // keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled">
        <View style={styles.form}>
          {/* RECEIPT */}
          <View style={{display: 'flex', flexDirection: 'column', gap: 0}}>
            <View>
              <Text style={{color: '#000', fontSize: 20}}>
                {t('receipt_no')}
              </Text>
            </View>
            <View style={styles.groupForm}>
              <View
                style={{flex: 0.7}}
                pointerEvents={headerSelected ? 'none' : 'auto'}>
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
                  showSoftInputOnFocus={!headerSelected}
                />
              </View>

              <TouchableOpacity
                disabled={!headerSelected}
                style={{
                  flex: 0.15,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
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
                    style={{color: '#fff', fontSize: 20, textAlign: 'center'}}>
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

              <TextInput
                style={[
                  styles.groupInput,
                  {
                    backgroundColor: '#D2D2D2',
                    fontWeight: 'bold',
                    fontSize: 20,
                    color: '#000',
                    textAlign: 'center'
                  }
                ]}
                defaultValue={headerSelected?.container_no}
                editable={false}
              />
            </View>

            <View
              style={{
                display: 'flex',
                flex: 0.4,
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
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
                    fontSize: 16
                  }
                ]}
                defaultValue={headerSelected?.customer_id}
                editable={false}
              />
            </View>

            <View
              style={{display: 'flex', flex: 0.3, justifyContent: 'flex-end'}}>
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
                    style={{color: '#fff', fontSize: 20, textAlign: 'center'}}>
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
            visible={toggleState === ToggleState.HEADER}
            setVisible={() => toggleSetState(null)}
          />
        )}

        {headerSelected && <TabViewList_2 detail={detail} />}
        {headerSelected && (
          <Scan
            ref={ref}
            detail={detail}
            data={headerSelected?.receipt_no}
            orderStatus={headerSelected?.status}
          />
        )}
        {headerSelected && toggleState === ToggleState.INFO && (
          <ModalHeaderInfo
            data={headerSelected}
            visible={toggleState === ToggleState.INFO}
            setVisible={() => toggleSetState(null)}
          />
        )}

        <View>
          {headerSelected && (
            <TouchableOpacity
              style={[styles.signatureBox]}
              onPress={() => toggleSetState(ToggleState.CAMERA)}
              disabled={headerSelected?.status === 'ARRIVED'}>
              {currentImage !== null || headerSelected?.img_item_arrive ? (
                <View style={styles.preview}>
                  {currentImage ? (
                    <Image
                      resizeMode={'contain'}
                      style={{width: '100%', height: 180}}
                      source={{uri: currentImage}}
                    />
                  ) : (
                    <Image
                      resizeMode={'contain'}
                      style={{width: '100%', height: 180}}
                      source={{
                        uri: `${path.IMG}/${headerSelected?.img_item_arrive}`
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
              disabled={headerSelected?.status === 'ARRIVED'}>
              {currentSign !== null || headerSelected?.signature_arrive ? (
                <View style={styles.preview}>
                  {currentSign ? (
                    <Image
                      resizeMode="contain"
                      style={{width: '100%', height: 180}}
                      source={{uri: currentSign}}
                    />
                  ) : (
                    <Image
                      resizeMode={'contain'}
                      style={{width: '100%', height: 180}}
                      source={{
                        uri: `${path.IMG}/${headerSelected?.signature_arrive}`
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

          {headerSelected && (
            <View style={styles.buttonGroup}>
              {headerSelected?.status !== 'PICKED' &&
              detail?.every((el) => el.status !== 'PICKED') ? (
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
                    onPress={onPressConfirm}>
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
                          textAlign: 'center',
                          fontSize: 20
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
                    // onPress={() => onPressConfirm(false)}
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
const ButtonConfirmComponent = ({text, color, backgroundColor, onPress}) => {
  return (
    <TouchableOpacity
      style={[styles.button, styles.shadow, {backgroundColor: backgroundColor}]}
      onPress={onPress}>
      <Text
        style={{
          color: color,
          fontWeight: 'bold',
          textAlign: 'center',
          fontSize: 20
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
  }
})
export default React.memo(UnloadFromTruck)
