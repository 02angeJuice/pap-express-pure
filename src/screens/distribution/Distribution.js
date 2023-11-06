import React, {useEffect, useState, useCallback, useRef} from 'react'
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native'
import debounce from 'lodash.debounce'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {Empty} from '../../components/SpinnerEmpty'
import {screenMap} from '../../constants/screenMap'
import {useTranslation} from 'react-i18next'
import {useDispatch} from 'react-redux'
import {resetFilter, setFilterDi} from '../../store/slices/settingSlice'
import {useSettings} from '../../hooks'
import {fetchOrder, fetchOrderSelect} from '../../apis'

const Distribution = ({navigation}) => {
  const [order, setOrder] = useState(null)
  const [orderSelected, setOrderSelected] = useState(null)
  const [input, setInput] = useState('')
  const [toggleType, setToggleType] = useState(false)
  const [type, setType] = useState('all')

  const inputRef = useRef(null)
  const {t} = useTranslation()
  const {filter_di} = useSettings()
  const dispatch = useDispatch()

  // ----------------------------------------------------------
  // == API
  // ----------------------------------------------------------
  const fetchOrder_API = async () => {
    const orders = await fetchOrder(filter_di)
    if (filter_di === 'CLOSED') {
      setOrder(orders?.data.filter((el) => el.distributeType === 'PDT001'))
    } else if (filter_di === 'PDT002' || filter_di === 'PDT003') {
      setOrder(orders?.data.filter((el) => el.status !== 'CLOSED'))
    } else {
      setOrder(
        orders?.data.filter((el) =>
          el.status === 'CLOSED' ? el.distributeType === 'PDT001' : el
        )
      )
    }
  }

  const fetcOrderSelect_API = async (distribution_id) => {
    const orders = await fetchOrderSelect(distribution_id)
    setOrder(
      orders?.data.filter((el) =>
        el.status === 'CLOSED' ? el.distributeType === 'PDT001' : el
      )
    )
  }

  // ----------------------------------------------------------
  // == EFFECT
  // ----------------------------------------------------------
  useEffect(() => {
    inputRef.current && inputRef.current?.focus()
  }, [])

  useEffect(() => {
    return () => {
      dispatch(resetFilter())
    }
  }, [])

  useEffect(() => {
    fetchOrder_API()
  }, [filter_di])

  useEffect(() => {
    debouncedSearch()
    return debouncedSearch.cancel
  }, [input, debouncedSearch])

  // ----------------------------------------------------------
  // == HANDLE
  // ----------------------------------------------------------
  const search = () => {
    input?.length !== 0 ? fetcOrderSelect_API(input) : fetchOrder_API(filter_di)
  }

  const debouncedSearch = useCallback(debounce(search, 1000), [input])

  const handleInputChange = (text) => {
    setInput(text)
  }

  const handleSetOrderSelected = useCallback(
    (target) => {
      setOrderSelected(target.distribution_id)

      navigation.navigate(screenMap.DistributeDetail, {
        order_id: target.distribution_id
      })
    },
    [navigation]
  )

  const handleChangeType = (change) => {
    setType(change)
    dispatch(setFilterDi(change))
    setToggleType(false)
  }

  const handleChangeStatus = (change) => {
    setType('all')
    dispatch(setFilterDi(change))
    setToggleType(false)
  }

  const renderItem = useCallback(({item}) => {
    return (
      <ItemOrder
        item={item}
        selected={handleSetOrderSelected}
        orderSelected={orderSelected}
      />
    )
  }, [])
  // ----------------------------------------------------------
  // == MAIN
  // ----------------------------------------------------------
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        setToggleType(false)
      }}>
      <View style={styles.container}>
        {/* <KeyboardAvoidingView style={{flex: 1}} behavior="padding" enabled> */}

        <View
          style={[styles.row, {marginTop: 5, justifyContent: 'space-between'}]}>
          <View style={[styles.row, {justifyContent: 'flex-start', gap: 7}]}>
            <StatusButtonComponent
              color="#FF2E6E"
              text="ENTRY"
              status={filter_di}
              onPress={() => handleChangeStatus('DATA ENTRY')}
            />
            <StatusButtonComponent
              color="#539ffc"
              text="ONSHIP"
              status={filter_di}
              onPress={() => handleChangeStatus('ONSHIP')}
            />
            <StatusButtonComponent
              color="#95ed66"
              text="CLOSED"
              status={filter_di}
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
              type === 'PDT003' && {backgroundColor: '#FFC4D2'}
            ]}
            onPress={() => setToggleType(!toggleType)}>
            <Text style={{padding: 3, color: '#000'}}>
              {type === 'all' ? (
                <Ionicons color={'#000'} name={'funnel-outline'} size={25} />
              ) : type === 'PDT001' ? (
                <Ionicons color={'#000'} name={'home-outline'} size={25} />
              ) : type === 'PDT002' ? (
                <Ionicons
                  color={'#000'}
                  name={'bag-handle-outline'}
                  size={25}
                />
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
                  <Text style={{color: '#000'}}>{t('od_type_warehouse')}</Text>
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
                  <Text style={{color: '#000'}}>{t('od_type_express')}</Text>
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
                  <Ionicons
                    color={'#000'}
                    name={'business-outline'}
                    size={15}
                  />
                  <Text style={{color: '#000'}}>{t('od_type_self')}</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={[styles.header, {marginVertical: 5}]}>
          {/* <Text style={{color: '#000'}}>{t('receipt_no')}</Text> */}
          <TextInput
            ref={inputRef}
            style={[
              styles.groupInput,
              {
                color: '#000',
                backgroundColor: '#D2D2D2',
                fontWeight: 'normal',
                paddingHorizontal: 10,
                paddingVertical: 6
              }
            ]}
            onChangeText={handleInputChange}
            placeholder={t('enter_barcode')}
            placeholderTextColor="#000"
            value={input}
            editable={true}
            blurOnSubmit={false}
            onSubmitEditing={Keyboard.dismiss}
            selectTextOnFocus={true}
            onStartShouldSetResponder={() => {
              Keyboard.dismiss()
              return false
            }}
          />

          <TouchableOpacity
            style={styles.clearButtonX}
            onPress={() => {
              setInput('')
              inputRef.current && inputRef.current?.focus()
            }}>
            <Ionicons name="close" size={25} color="#777" />
          </TouchableOpacity>
        </View>
        <FlatList
          onScrollBeginDrag={() => {
            setToggleType(false)
            Keyboard.dismiss()
          }}
          keyboardShouldPersistTaps="handled"
          style={styles.list}
          keyExtractor={(el) => el.distribution_id.toString()}
          data={order}
          initialNumToRender={1}
          windowSize={5}
          scrollEventThrottle={10}
          renderItem={renderItem}
          ListEmptyComponent={<Empty text={order && t('empty')} />}
        />
        {/* </KeyboardAvoidingView> */}
      </View>
    </TouchableWithoutFeedback>
  )
}

// ----------------------------------------------------------
// == COMPONENT
// ----------------------------------------------------------
const ItemOrder = React.memo(({item, selected, orderSelected}) => {
  const {t} = useTranslation()

  return (
    <TouchableOpacity
      style={[
        styles.item,
        styles.shadow,
        item?.distribution_id === orderSelected && {
          borderWidth: 2.5,
          borderLeftWidth: 10
        },
        item?.status === 'DATA ENTRY' && {
          borderColor: '#FF003C'
        },
        item?.status === 'ONSHIP' && {
          borderColor: '#539ffc'
        },
        item?.status === 'CLOSED' && {
          borderColor: '#95ed66'
        }
      ]}
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
          <Text style={{color: '#000', fontStyle: 'italic'}}>
            ({item.first_name} {item.last_name})
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
            {item.address} - {item.subdistrict} {item.district} {item.province}{' '}
            {item.zip_code}
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
                item?.distributeType === 'PDT001'
                  ? 'home'
                  : item?.distributeType === 'PDT002'
                  ? 'bag-handle'
                  : 'business'
              }
              size={15}
            />
            <Text style={{padding: 2, color: '#000'}}>
              {item?.distributeType === 'PDT001'
                ? `${t('od_type_warehouse')}`
                : item?.distributeType === 'PDT002'
                ? `${t('od_type_express')}`
                : `${t('od_type_self')}`}
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
    borderRadius: 5,
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
