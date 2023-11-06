import React, {useState, useEffect, useCallback} from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal
} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {Empty} from '../../components/SpinnerEmpty'
import {fetchHeader} from '../../apis'
import {useTranslation} from 'react-i18next'

const ModalHeader = ({onPress, visible, setVisible, headerSelected}) => {
  const [header, setHeader] = useState(null)
  const [status, setStatus] = useState('ONSHIP')
  const {t} = useTranslation()

  // ----------------------------------------------------------
  // == API
  // ----------------------------------------------------------
  const fetchHeader_API = async (status) => {
    const header = await fetchHeader(status)

    setHeader(
      header.data?.filter(
        (el) => el.status !== 'PICKED' && el.status !== 'CLOSED'
      )
    )
  }

  // ----------------------------------------------------------
  // == EFFECT
  // ----------------------------------------------------------
  useEffect(() => {
    fetchHeader_API(status)
  }, [status])

  const renderItem = useCallback(
    ({item}) => (
      <HeaderItem
        item={item}
        onPress={onPress}
        headerSelected={headerSelected}
      />
    ),
    []
  )
  // ----------------------------------------------------------
  // == MAIN
  // ----------------------------------------------------------
  return (
    <Modal
      visible={visible}
      transparent={true}
      statusBarTranslucent={true}
      // animationType="slide"
      onRequestClose={() => setVisible(!visible)}>
      <View style={styles.modalContainer}>
        <View style={styles.nav}>
          <Text style={styles.textNav}>{t('unload_from_truck')}</Text>
          <TouchableOpacity
            style={styles.closeButton}
            // onPress={() => setVisible(false)}
            onPress={setVisible}>
            <Ionicons name="close" size={25} color="#fff" />
          </TouchableOpacity>
        </View>
        <View
          style={[
            styles.row,
            {
              marginTop: 5,
              justifyContent: 'flex-start',
              gap: 7
            }
          ]}>
          <StatusButtonComponent
            color="#AEAEAE"
            backgroundColor="#FFF"
            text="ALL"
            onPress={() => setStatus('')}
          />

          <StatusButtonComponent
            color="#8FCDF3"
            backgroundColor="#009DFF"
            text="ONSHIP"
            onPress={() => setStatus('ONSHIP')}
          />
          <StatusButtonComponent
            color="#F78EA6"
            backgroundColor="#FF003C"
            text="ARRIVED"
            onPress={() => setStatus('ARRIVED')}
          />
        </View>
        <FlatList
          keyboardShouldPersistTaps="handled"
          style={[styles.list, {borderRadius: 5}]}
          keyExtractor={(el) => el.receipt_no.toString()}
          data={header}
          initialNumToRender={1}
          windowSize={5}
          renderItem={renderItem}
          ListEmptyComponent={<Empty text={t('empty')} />}
        />
        <ButtonComponent
          text={t('close')}
          fontWeight="bold"
          color="#000"
          // color="#6E0000"
          // backgroundColor="#FF7676"
          backgroundColor="#FFF"
          onPress={setVisible}
        />
      </View>
    </Modal>
  )
}

// ----------------------------------------------------------
// == COMPONENT
// ----------------------------------------------------------
const HeaderItem = React.memo(({item, onPress, headerSelected}) => {
  const {t} = useTranslation()

  return (
    <TouchableOpacity style={[styles.item]} onPress={() => onPress(item)}>
      <View
        key={item?.receipt_no}
        style={[
          styles.itemHeader,
          item.receipt_no === headerSelected && {
            borderColor: '#FFF',
            borderWidth: 1,
            borderStyle: 'dashed',
            borderBottomWidth: 0
          },
          item.status_hh === 'EDITING' && {
            borderColor: '#000',
            backgroundColor: '#FFDA4A'
          }
        ]}>
        <View style={[styles.row, {justifyContent: 'space-between'}]}>
          <Text
            style={[
              styles.textHeader,
              item.status_hh === 'EDITING' && {
                color: '#000'
              }
            ]}>
            {t('receipt_no')}: {item.receipt_no}
          </Text>
          {item.status_hh === 'EDITING' && (
            <View style={[styles.row, {gap: 5}]}>
              <Ionicons
                style={{alignSelf: 'center'}}
                name={'cube-outline'}
                size={15}
                color="#000"
              />
              <Ionicons
                style={{alignSelf: 'center'}}
                name={'qr-code-outline'}
                size={15}
                color="#000"
              />
            </View>
          )}
        </View>
      </View>
      <View
        style={[
          styles.itemContent,
          item.receipt_no === headerSelected && {
            borderColor: '#AE100F',
            borderWidth: 1,
            borderStyle: 'dashed',
            borderTopWidth: 0
          },
          item.status_hh === 'EDITING' && {
            borderColor: '#000'
          }
        ]}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
          <Text style={{color: '#000'}}>
            {t('container_no')}: {item.container_no}
          </Text>

          <Text style={{color: '#000'}}>
            {item.customer_id === null ? '-' : item.customer_id}
          </Text>
        </View>
        <Text style={{color: '#000'}}>
          {t('date_departure')}:{' '}
          {item.date_departure === null ? '-' : item.date_departure}
        </Text>
        <Text style={{color: '#000'}}>
          {t('date_arrival')}:{' '}
          {item.arrival_date === null ? '-' : item.arrival_date}
        </Text>

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center'
            }}>
            <Text style={{color: '#000'}}>{t('status')}:</Text>
            <View
              style={[
                styles.status,
                item.status === 'PICKED'
                  ? styles.PICKED
                  : item.status === 'ONSHIP'
                  ? styles.ONSHIP
                  : styles.ARRIVED,
                {
                  justifyContent: 'center',
                  alignItems: 'center'
                }
              ]}>
              <Text style={{fontSize: 10}}>{item.status}</Text>
            </View>
          </View>

          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              gap: 5
            }}>
            <Text style={{color: '#F00'}}>
              {item.shipment_confirm && `（${t('change')}）`}
            </Text>
            <Text>
              {item.shipment === 'car' ? `${t('car')}` : `${t('ship')}`}
            </Text>
            <Ionicons
              style={{
                alignSelf: 'center',
                color: `${item.shipment === 'car' ? '#FF009E' : '#009DFF'}`
              }}
              name={`${item.shipment === 'car' ? 'car' : 'boat'}-outline`}
              size={20}
              color={'#000'}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
})

const StatusButtonComponent = ({color, backgroundColor, text, onPress}) => {
  return (
    <TouchableOpacity
      style={[styles.filter, {backgroundColor: backgroundColor}]}
      onPress={onPress}>
      <View style={[styles.row, {justifyContent: 'center'}]}>
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

const ButtonComponent = ({
  text,
  fontWeight,
  color,
  backgroundColor,
  onPress
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, {backgroundColor: backgroundColor}]}
      onPress={onPress}>
      <Text
        style={{
          color: color,
          fontWeight: fontWeight,
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
    overflow: 'hidden'
  },
  modalContainer: {
    flex: 1,
    paddingTop: 25,
    paddingBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  filter: {
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
    paddingVertical: 8,
    paddingHorizontal: 10
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
    fontSize: 14,
    fontWeight: 'bold'
  },

  itemContent: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10
  },
  list: {
    borderRadius: 5,
    overflow: 'hidden',
    marginVertical: 5
  },

  item: {
    marginVertical: 5,
    borderRadius: 8,
    overflow: 'hidden'
  },
  status: {
    marginLeft: 5,
    paddingHorizontal: 3,
    paddingVertical: 1,
    borderRadius: 5,

    fontWeight: 'bold'
  },
  button: {
    padding: 10,
    borderRadius: 5
  },
  shadow: {
    shadowOffset: {width: 0, height: 2},
    shadowColor: '#171717',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2
  },
  PICKED: {
    margin: 2,
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
  }
})

export default React.memo(ModalHeader)
