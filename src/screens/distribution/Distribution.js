import React, {useEffect, useState, useCallback, useRef} from 'react'
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Keyboard
} from 'react-native'
// import Stack from '@rneui/base/stack'
import {Button, Chip} from '@rneui/themed'
import debounce from 'lodash.debounce'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {Empty} from '../../components/SpinnerEmpty'
import {screenMap} from '../../constants/screenMap'
import {useTranslation} from 'react-i18next'
import {useDispatch} from 'react-redux'
import {useFocus} from '../../hooks'
import {hh_sel_distributes_pagination} from '../../apis'
import {setfetchfocus} from '../../store/slices/focusSlice'
import {useNavigationState} from '@react-navigation/native'

const Distribution = ({navigation}) => {
  const [order, setOrder] = useState([])
  const [input, setInput] = useState('')
  const [toggleType, setToggleType] = useState(false)
  const [inputEnd, setInputEnd] = useState(false)

  const [key, setkey] = useState(false)

  const inputRef = useRef(null)
  const {t} = useTranslation()
  const dispatch = useDispatch()

  const {fetchfocus} = useFocus()

  const state = useNavigationState((state) => state)

  const [status, setStatus] = useState('DATA ENTRY')
  const [type, setType] = useState('')

  const [loading, setloading] = useState(false)

  const [pageNumber, setPageNumber] = useState(1)
  const [count, setcount] = useState(0)

  const fetchData = async () => {
    try {
      const res = await hh_sel_distributes_pagination(status, {
        page: pageNumber, // Increment the page number for the next page
        perPage: 20,
        search: input,
        distributeType: type
      })

      if (res?.result) {
        setOrder(res.result)
        setcount(res.count === 0 ? 1 : Math.ceil(res.count / 20))
      } else {
        setOrder([])
      }
    } catch (error) {
      console.log(error)
    }
    setloading(false)
  }

  // ----------------------------------------------------------
  // == API
  // ----------------------------------------------------------
  useEffect(() => {
    setloading(true)
    fetchData()
  }, [type, status, pageNumber, inputEnd])

  // ----------------------------------------------------------
  // == EFFECT
  // ----------------------------------------------------------
  useEffect(() => {
    inputRef.current?.focus()
  }, [fetchfocus])

  useEffect(() => {
    dispatch(setfetchfocus())
  }, [state])

  // useEffect(() => {
  //   if (input && !inputEnd) {
  //     debouncedSearch()
  //   }
  //   return debouncedSearch.cancel
  // }, [inputEnd, input, debouncedSearch])

  // ----------------------------------------------------------
  // == HANDLE
  // ----------------------------------------------------------
  const handleInputChange = (text) => {
    setInput(text)
    setPageNumber(1)

    setInputEnd((e) => !e)
    // setkey(() => false)
  }

  const debouncedSearch = debounce(handleInputChange, 500)

  const handleChangeType = (cType) => {
    setPageNumber(1)
    cType === type ? setType('') : setType(cType)
    setToggleType(false)
    // setkey(() => false)

    setkey(() => false)
    Keyboard.dismiss()
    dispatch(setfetchfocus())
  }

  const handleChangeStatus = (cStatus) => {
    setPageNumber(1)
    setStatus(cStatus)
    // setkey(() => false)

    setkey(() => false)
    Keyboard.dismiss()
    dispatch(setfetchfocus())
  }

  const handlePagination = (cPage) => {
    setPageNumber((el) => el + cPage)

    // dispatch(setfetchfocus())
    setkey(() => false)
    Keyboard.dismiss()
    dispatch(setfetchfocus())
  }

  const handleSetOrderSelected = (target) => {
    navigation.navigate(screenMap.DistributeDetail, {
      order_id: target.distribution_id
    })
  }

  const handleClear = () => {
    setInputEnd((e) => !e)
    setPageNumber(1)
    // setType('')
    // setStatus('DATA ENTRY')
    setInput('')
    inputRef?.current.clear()

    setkey(() => false)
    Keyboard.dismiss()
    dispatch(setfetchfocus())
  }

  const renderItem = useCallback(
    ({item}) => {
      return <ItemOrder item={item} selected={handleSetOrderSelected} />
    },
    [handleSetOrderSelected]
  )

  // ----------------------------------------------------------
  // == MAIN
  // ----------------------------------------------------------
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        setToggleType(false)

        dispatch(setfetchfocus())
        // setkey(() => false)
      }}>
      <View style={styles.container}>
        <View
          style={[styles.row, {marginTop: 5, justifyContent: 'space-between'}]}>
          <View style={[styles.row, {justifyContent: 'flex-start', gap: 7}]}>
            <StatusButtonComponent
              color="#FF2E6E"
              text="ENTRY"
              status={status}
              onPress={() => handleChangeStatus('DATA ENTRY')}
            />
            <StatusButtonComponent
              color="#539ffc"
              text="ONSHIP"
              status={status}
              onPress={() => handleChangeStatus('ONSHIP')}
            />
            <StatusButtonComponent
              color="#95ed66"
              text="CLOSED"
              status={status}
              onPress={() => handleChangeStatus('CLOSED')}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.shadow,
              styles.filter,
              {justifyContent: 'center', alignItems: 'center'},
              type === 'PDT001' && {backgroundColor: '#CFFFAE'},
              type === 'PDT002' && {backgroundColor: '#B5E3FF'},
              type === 'PDT003' && {backgroundColor: '#FFC4D2'},
              type === 'PDT004' && {backgroundColor: '#E0C9FF'}
            ]}
            onPress={() => setToggleType((el) => !el)}>
            <Text style={{padding: 3, color: '#000'}}>
              {type === '' ? (
                <Ionicons color={'#000'} name={'funnel-outline'} size={25} />
              ) : type === 'PDT001' ? (
                <Ionicons color={'#000'} name={'home-outline'} size={25} />
              ) : type === 'PDT002' ? (
                <Ionicons
                  color={'#000'}
                  name={'bag-handle-outline'}
                  size={25}
                />
              ) : type === 'PDT003' ? (
                <Ionicons color={'#000'} name={'cube-outline'} size={25} />
              ) : (
                <Ionicons color={'#000'} name={'business-outline'} size={25} />
              )}
            </Text>
          </TouchableOpacity>

          {toggleType && (
            <View
              style={[
                {
                  position: 'absolute',
                  top: 45,
                  right: 0,
                  backgroundColor: '#fff',
                  padding: 5,
                  borderRadius: 5,
                  zIndex: 2
                },
                styles.shadow
              ]}>
              <TouchableOpacity
                style={[
                  styles.row,
                  {gap: 8, borderRadius: 3, padding: 12},
                  type === 'PDT001' && {
                    backgroundColor: '#CFFFAE'
                  }
                ]}
                onPress={() => handleChangeType('PDT001')}>
                <View style={[styles.row, {gap: 5}]}>
                  <Ionicons color={'#000'} name={'home-outline'} size={15} />
                  <Text style={{color: '#000', fontSize: 20}}>
                    {t('od_type_warehouse')}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.row,
                  {gap: 8, borderRadius: 3, padding: 12},
                  type === 'PDT002' && {
                    backgroundColor: '#B5E3FF'
                  }
                ]}
                onPress={() => handleChangeType('PDT002')}>
                <View style={[styles.row, {gap: 5}]}>
                  <Ionicons
                    color={'#000'}
                    name={'bag-handle-outline'}
                    size={15}
                  />
                  <Text style={{color: '#000', fontSize: 20}}>
                    {t('od_type_express')}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.row,
                  {gap: 8, borderRadius: 3, padding: 12},
                  type === 'PDT003' && {
                    backgroundColor: '#FFC4D2'
                  }
                ]}
                onPress={() => handleChangeType('PDT003')}>
                <View style={[styles.row, {gap: 5}]}>
                  <Ionicons color={'#000'} name={'cube-outline'} size={15} />
                  <Text style={{color: '#000', fontSize: 20}}>
                    {t('od_type_self')}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.row,
                  {gap: 8, borderRadius: 3, padding: 12},
                  type === 'PDT004' && {
                    backgroundColor: '#E0C9FF'
                  }
                ]}
                onPress={() => handleChangeType('PDT004')}>
                <View style={[styles.row, {gap: 5}]}>
                  <Ionicons
                    color={'#000'}
                    name={'business-outline'}
                    size={15}
                  />
                  <Text style={{color: '#000', fontSize: 20}}>
                    {t('od_type_office')}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={[styles.header, {marginVertical: 5}]}>
          <TextInput
            ref={inputRef}
            style={[
              styles.groupInput,
              {
                color: '#000',
                fontSize: 20,
                backgroundColor: '#e2e2e2',
                fontWeight: 'normal',
                paddingHorizontal: 10,
                paddingVertical: 6
              }
            ]}
            keyboardShouldPersistTaps="handled"
            onChangeText={debouncedSearch}
            placeholder={t('enter_barcode')}
            placeholderTextColor="#009DFF"
            // value={input}
            // editable={true}
            blurOnSubmit={false}
            // onSubmitEditing={() => dispatch(setfetchfocus())}
            selectTextOnFocus={true}
            // recommended
            showSoftInputOnFocus={key}
            onFocus={() => setkey(() => true)}
            // clearTextOnFocus={true}

            // onPressIn={() => setkey(() => true)}
          />

          <TouchableOpacity style={styles.clearButtonX} onPress={handleClear}>
            <Ionicons name="close" size={25} color="#777" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            onScrollBeginDrag={() => {
              dispatch(setfetchfocus())
              setkey(() => false)
            }}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
            keyExtractor={(el) => el.distribution_id.toString()}
            data={order}
            initialNumToRender={3}
            windowSize={5}
            renderItem={renderItem}
            ListEmptyComponent={
              <Empty text={order?.length <= 0 && t('empty')} />
            }
          />
        )}

        <View
          style={{
            position: 'absolute',
            bottom: 10,
            right: 10,
            flexDirection: 'row',
            gap: 10
          }}>
          <Chip disabled title={`${pageNumber}/${count}`} />

          <Button
            disabled={pageNumber === 1}
            buttonStyle={{borderRadius: 10}}
            onPress={() => handlePagination(-1)}
            icon={{
              name: 'arrow-left',
              type: 'font-awesome',
              size: 15,
              color: 'white'
            }}
            iconleft>
            Prev
          </Button>
          <Button
            disabled={pageNumber === count}
            buttonStyle={{borderRadius: 10}}
            onPress={() => handlePagination(+1)}
            icon={{
              name: 'arrow-right',
              type: 'font-awesome',
              size: 15,
              color: 'white'
            }}
            iconRight>
            Next
          </Button>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

// ----------------------------------------------------------
// == COMPONENT
// ----------------------------------------------------------
const ItemOrder = React.memo(({item, selected}) => {
  const {t} = useTranslation()

  return (
    <TouchableOpacity
      style={[styles.item, styles.shadow]}
      onPress={() => selected(item)}>
      <View
        key={item?.distribution_id}
        style={[
          styles.itemContent,
          item?.status === 'DATA ENTRY' && {
            borderLeftColor: '#FF003C',
            borderLeftWidth: 10,
            backgroundColor: '#FFEBF1'
          },
          item?.status === 'ONSHIP' && {
            borderLeftColor: '#539ffc',
            borderLeftWidth: 10,
            backgroundColor: '#EBF4FF'
          },
          item?.status === 'CLOSED' && {
            borderLeftColor: '#95ed66',
            borderLeftWidth: 10,
            backgroundColor: '#E3FFD4'
          }
        ]}>
        <View style={[styles.row, {gap: 3}]}>
          <Text style={{color: '#000'}}>{t('receipt_no')}:</Text>
          <Text style={{color: '#000', fontWeight: '500'}}>
            {item.distribution_id}
          </Text>
        </View>

        {item.distributeType !== 'PDT001' && (
          <Text style={{color: '#000'}}>
            {t('driver')}: {item.driver}
          </Text>
        )}

        <View style={[styles.row, {justifyContent: 'space-between'}]}>
          <View style={[styles.row, {gap: 3}]}>
            <Text style={{color: '#000'}}>{t('recipient')}:</Text>
            <Text style={{color: '#000', fontWeight: 'bold'}}>
              {item.customer_id}
            </Text>
          </View>
          <Text style={{color: '#000', fontStyle: 'italic', fontWeight: 700}}>
            {`${item.first_name === '-' ? '' : item.first_name || ''}`}
            {`${item.last_name === '-' ? '' : ' ' + item.last_name || ''}`}
          </Text>
        </View>

        <View
          style={[
            styles.row,
            {
              justifyContent: 'center',
              gap: 3,
              backgroundColor: '#fff',
              borderRadius: 5,
              borderColor: '#d3d3d3',
              borderWidth: 1,
              padding: 3,
              marginVertical: 4
            }
          ]}>
          <Ionicons color={'#FF0000'} name={'location-outline'} size={15} />
          <Text style={{flex: 1, flexWrap: 'wrap', color: '#000'}}>
            {item.address?.replace('-', '')} {item.subdistrict} {item.district}{' '}
            {item.province} {item.zip_code}
          </Text>
        </View>

        <View style={[styles.row, {gap: 2, justifyContent: 'flex-start'}]}>
          <Text style={{color: '#000'}}>{t('transport_type')}: </Text>
          <View
            style={[
              styles.status,
              styles.row,
              item.distributeType === 'PDT001'
                ? styles.PICKED
                : item.distributeType === 'PDT002'
                ? styles.ONSHIP
                : item.distributeType === 'PDT003'
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
                item?.distributeType === 'PDT001'
                  ? 'home'
                  : item?.distributeType === 'PDT002'
                  ? 'bag-handle'
                  : item?.distributeType === 'PDT003'
                  ? 'cube'
                  : 'business'
              }
              size={15}
            />
            <Text style={{padding: 2, color: '#000'}}>
              {item?.distributeType === 'PDT001'
                ? `${t('od_type_warehouse')}`
                : item?.distributeType === 'PDT002'
                ? `${t('od_type_express')}`
                : item?.distributeType === 'PDT003'
                ? `${t('od_type_self')}`
                : `${t('od_type_office')}`}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
})

const StatusButtonComponent = ({color, text, status, onPress}) => {
  return (
    <TouchableOpacity
      style={[
        styles.filter,
        styles.shadow,
        status?.includes(text) && {backgroundColor: '#E3FFD4'}
      ]}
      onPress={onPress}>
      <View style={[styles.row, {justifyContent: 'center'}, ,]}>
        <Ionicons
          style={{alignSelf: 'center'}}
          name={'ellipse'}
          size={15}
          color={color}
        />
        <Text style={{fontSize: 12, color: '#000'}}> {text}</Text>
      </View>
    </TouchableOpacity>
  )
}

// ----------------------------------------------------------
// == STYLE
// ----------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    paddingHorizontal: 5
  },
  filter: {
    backgroundColor: '#fff',
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderRadius: 5
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemHeader: {
    backgroundColor: '#AE100F',
    padding: 15
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
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 15
  },

  textHeader: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  list: {
    borderRadius: 5,
    overflow: 'hidden',
    marginVertical: 5
  },
  itemContent: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10
  },
  item: {
    marginVertical: 5,
    borderRadius: 10,
    overflow: 'hidden'
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
  shadow: {
    shadowOffset: {width: 0, height: 2},
    shadowColor: '#171717',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2
  },

  groupForm: {
    display: 'flex',
    flexDirection: 'row',
    gap: 8
  },
  groupInput: {
    backgroundColor: '#F4F4F4',
    borderColor: '#7A7A7A',
    borderRadius: 10,
    paddingHorizontal: 6,
    width: '100%'
  },
  clearButtonX: {
    position: 'absolute',
    right: 10,
    top: '30%',
    transform: [{translateY: -5}]
  },
  appContainer: {
    flex: 1,
    padding: 16
  }
})

export default React.memo(Distribution)
