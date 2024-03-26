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
import NetInfoCheck from '../../components/NetInfoCheck'
import ModalSignaturePad from '../../components/ModalSignaturePad'
import ModalImagePicker from '../../components/ModalImagePicker'
import CustomText from '../../components/CustomText'

const UnloadFromTruck = ({navigation}) => {
  const [loading, setLoading] = useState(false)
  const [toggleState, setToggleState] = useState(null)
  const [toggleButton, setToggleButton] = useState(false)
  const [headerSelected, setHeaderSelected] = useState(null)
  const [detail, setDetail] = useState(null)
  const [detailSelected, setDetailSelected] = useState(null)

  const [currentSign, setCurrentSign] = useState(null)
  const [currentImage, setCurrentImage] = useState(null)

  const [img1, setImg1] = useState(null)
  const [img2, setImg2] = useState(null)
  const [img3, setImg3] = useState(null)
  const [img4, setImg4] = useState(null)
  const [img5, setImg5] = useState(null)

  const [force, setForce] = useState(null)
  const [remark, setRemark] = useState(null)
  const [input, setInput] = useState('')

  const [openHeaderList, setOpenHeaderList] = useState(false)
  const [openHeaderInfo, setOpenHeaderInfo] = useState(false)

  const [openSignature, setOpenSignature] = useState(false)

  const [openImg1, setOpenImg1] = useState(false)
  const [openImg2, setOpenImg2] = useState(false)
  const [openImg3, setOpenImg3] = useState(false)
  const [openImg4, setOpenImg4] = useState(false)
  const [openImg5, setOpenImg5] = useState(false)

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

    const imgName1 = img1?.split('/').pop()
    const imgType1 = imgName1?.split('.').pop()

    const imgName2 = img2?.split('/').pop()
    const imgType2 = imgName2?.split('.').pop()

    const imgName3 = img3?.split('/').pop()
    const imgType3 = imgName3?.split('.').pop()

    const imgName4 = img4?.split('/').pop()
    const imgType4 = imgName4?.split('.').pop()

    const imgName5 = img5?.split('/').pop()
    const imgType5 = imgName5?.split('.').pop()

    const signName = currentSign?.split('/').pop()
    const signType = signName?.split('.').pop()

    // CHECK Item Detail Status !
    // if (detail?.filter((el) => el.status === 'LOADED').length > 0) {
    //   alertReUse('load_invalid', 'load_invalid_detail')

    // alertReUse('load_invalid', 'load_invalid_detail')
    // CHECK Signature required !
    // if (currentSign === null) {
    //   alertReUse('signature_required', 'signature_required_detail')
    // } else {
    // SENT ITEM PICKED --> ONSHIP
    // ==============================
    const obj = new FormData()

    currentSign !== null
      ? obj.append('files', {
          uri: currentSign,
          name: `SIGNATURE-1.${signType}`,
          type: `image/${signType}`
        })
      : obj.append('files', null)

    img1 !== null
      ? obj.append('files', {
          uri: img1,
          name: `ITEM-01.${imgType1}`,
          type: `image/${imgType1}`
        })
      : obj.append('files', null)

    img2 !== null
      ? obj.append('files', {
          uri: img2,
          name: `ITEM-02.${imgType2}`,
          type: `image/${imgType2}`
        })
      : obj.append('files', null)

    img3 !== null
      ? obj.append('files', {
          uri: img3,
          name: `ITEM-03.${imgType3}`,
          type: `image/${imgType3}`
        })
      : obj.append('files', null)

    img4 !== null
      ? obj.append('files', {
          uri: img4,
          name: `ITEM-04.${imgType4}`,
          type: `image/${imgType4}`
        })
      : obj.append('files', null)

    img5 !== null
      ? obj.append('files', {
          uri: img5,
          name: `ITEM-05.${imgType5}`,
          type: `image/${imgType5}`
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
        date: `${moment().utc(true).format('YYYY-MM-DDTHH:mm:ss.SSS')}Z`,
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

    setCurrentSign(null)
    setImg1(null)
    setImg2(null)
    setImg3(null)
    setImg4(null)
    setImg5(null)

    setToggleButton(false)
    setLoading(false)
    // }

    // setLoading(false)
  }

  const alertReUse = (msg, detail) => {
    Alert.alert(t(msg), t(detail), [{onPress: () => setLoading(false)}])
  }

  // ----------------------------------------------------------
  // == MAIN
  // ----------------------------------------------------------
  return (
    <>
      <NetInfoCheck />
      <ModalHeader
        headerSelected={headerSelected?.receipt_no}
        onPress={handleSetHeaderSelected}
        open={openHeaderList}
        handleOpen={setOpenHeaderList}
      />
      <ModalHeaderInfo
        data={headerSelected}
        open={openHeaderInfo}
        handleOpen={setOpenHeaderInfo}
      />

      <ModalSignaturePad
        set={setCurrentSign}
        open={openSignature}
        handleOpen={setOpenSignature}
      />
      <ModalImagePicker
        set={setImg1}
        open={openImg1}
        handleOpen={setOpenImg1}
      />
      <ModalImagePicker
        set={setImg2}
        open={openImg2}
        handleOpen={setOpenImg2}
      />
      <ModalImagePicker
        set={setImg3}
        open={openImg3}
        handleOpen={setOpenImg3}
      />
      <ModalImagePicker
        set={setImg4}
        open={openImg4}
        handleOpen={setOpenImg4}
      />
      <ModalImagePicker
        set={setImg5}
        open={openImg5}
        handleOpen={setOpenImg5}
      />

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
                  onPress={() => setOpenHeaderInfo(!openHeaderInfo)}>
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
                    {backgroundColor: '#2a52be', flex: 0.3}
                  ]}
                  onPress={() => setOpenHeaderList(!openHeaderList)}>
                  <View
                    style={[styles.row, {justifyContent: 'center', gap: 1}]}>
                    <Ionicons
                      style={{alignSelf: 'center'}}
                      // name={'document-text-outline'}
                      name={'document-text-outline'}
                      size={20}
                      color="#fff"
                    />
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 20,
                        textAlign: 'center'
                      }}>
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
              <View
                style={{display: 'flex', flex: 0.3, flexDirection: 'column'}}>
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
                  <View
                    style={[styles.row, {justifyContent: 'center', gap: 1}]}>
                    <Ionicons
                      style={{alignSelf: 'center'}}
                      // name={'document-text-outline'}
                      name={'trash-bin-outline'}
                      size={20}
                      color="#fff"
                    />
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 20,
                        textAlign: 'center'
                      }}>
                      {t('clear')}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {/* 
          {toggleState === ToggleState.HEADER && (
            <ModalHeader
              headerSelected={headerSelected?.receipt_no}
              onPress={handleSetHeaderSelected}
              visible={toggleState === ToggleState.HEADER}
              setVisible={() => toggleSetState(null)}
            />
          )} */}

          {headerSelected && <TabViewList_2 detail={detail} />}
          {headerSelected && (
            <Scan
              ref={ref}
              detail={detail}
              data={headerSelected?.receipt_no}
              orderStatus={headerSelected?.status}
            />
          )}

          <View>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              // pagingEnabled
            >
              {/* {headerSelected && (
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
            )} */}
              {/* image 1 */}
              <TouchableOpacity
                style={[
                  {display: headerSelected ? 'flex' : 'none'},
                  styles.imageBox
                ]}
                onPress={() => setOpenImg1(!openImg1)}
                disabled={headerSelected?.status === 'ARRIVED'}>
                {img1 !== null || headerSelected?.img_item_arrive ? (
                  <View style={styles.preview}>
                    <Image
                      resizeMode={'contain'}
                      style={{width: '100%', height: 180}}
                      source={{
                        uri:
                          img1 ||
                          `${path.IMG}/${headerSelected?.img_item_arrive}`
                      }}
                    />
                  </View>
                ) : (
                  <View style={styles.imageUpload}>
                    <Ionicons name="image-outline" size={45} color="#4d4d4d" />
                    <CustomText size="md" text={`${t('photo')} 1`} />
                  </View>
                )}
              </TouchableOpacity>

              {/* image 2 */}
              <TouchableOpacity
                style={[
                  {display: headerSelected ? 'flex' : 'none'},
                  styles.imageBox
                ]}
                onPress={() => setOpenImg2(!openImg2)}
                disabled={headerSelected?.status === 'ARRIVED'}>
                {img2 !== null || headerSelected?.img_item_arrive_2 ? (
                  <View style={styles.preview}>
                    <Image
                      resizeMode={'contain'}
                      style={{width: '100%', height: 180}}
                      source={{
                        uri:
                          img2 ||
                          `${path.IMG}/${headerSelected?.img_item_arrive_2}`
                      }}
                    />
                  </View>
                ) : (
                  <View style={styles.imageUpload}>
                    <Ionicons name="image-outline" size={45} color="#4d4d4d" />
                    <CustomText size="md" text={`${t('photo')} 2`} />
                  </View>
                )}
              </TouchableOpacity>

              {/* image 3 */}
              <TouchableOpacity
                style={[
                  {display: headerSelected ? 'flex' : 'none'},
                  styles.imageBox
                ]}
                onPress={() => setOpenImg3(!openImg3)}
                disabled={headerSelected?.status === 'ARRIVED'}>
                {img3 !== null || headerSelected?.img_item_arrive_3 ? (
                  <View style={styles.preview}>
                    <Image
                      resizeMode={'contain'}
                      style={{width: '100%', height: 180}}
                      source={{
                        uri:
                          img3 ||
                          `${path.IMG}/${headerSelected?.img_item_arrive_3}`
                      }}
                    />
                  </View>
                ) : (
                  <View style={styles.imageUpload}>
                    <Ionicons name="image-outline" size={45} color="#4d4d4d" />
                    <CustomText size="md" text={`${t('photo')} 3`} />
                  </View>
                )}
              </TouchableOpacity>

              {/* image 4 */}
              <TouchableOpacity
                style={[
                  {display: headerSelected ? 'flex' : 'none'},
                  styles.imageBox
                ]}
                onPress={() => setOpenImg4(!openImg4)}
                disabled={headerSelected?.status === 'ARRIVED'}>
                {img4 !== null || headerSelected?.img_item_arrive_4 ? (
                  <View style={styles.preview}>
                    <Image
                      resizeMode={'contain'}
                      style={{width: '100%', height: 180}}
                      source={{
                        uri:
                          img4 ||
                          `${path.IMG}/${headerSelected?.img_item_arrive_4}`
                      }}
                    />
                  </View>
                ) : (
                  <View style={styles.imageUpload}>
                    <Ionicons name="image-outline" size={45} color="#4d4d4d" />
                    <CustomText size="md" text={`${t('photo')} 4`} />
                  </View>
                )}
              </TouchableOpacity>

              {/* image 5 */}
              <TouchableOpacity
                style={[
                  {display: headerSelected ? 'flex' : 'none'},
                  styles.imageBox
                ]}
                onPress={() => setOpenImg5(!openImg5)}
                disabled={headerSelected?.status === 'ARRIVED'}>
                {img5 !== null || headerSelected?.img_item_arrive_5 ? (
                  <View style={styles.preview}>
                    <Image
                      resizeMode={'contain'}
                      style={{width: '100%', height: 180}}
                      source={{
                        uri:
                          img5 ||
                          `${path.IMG}/${headerSelected?.img_item_arrive_5}`
                      }}
                    />
                  </View>
                ) : (
                  <View style={styles.imageUpload}>
                    <Ionicons name="image-outline" size={45} color="#4d4d4d" />
                    <CustomText size="md" text={`${t('photo')} 5`} />
                  </View>
                )}
              </TouchableOpacity>
            </ScrollView>

            {/* ===================================================================== */}

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
                // onPress={() => toggleSetState(ToggleState.SIGNATURE)}
                onPress={() => setOpenSignature(!openSignature)}
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
                    <CustomText size="md" text={t('signature')} />
                  </View>
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
    </>
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

  imageBox: {
    marginTop: 15,
    height: 200,
    width: 250,
    // marginHorizontal: 5,
    marginRight: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc'
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
