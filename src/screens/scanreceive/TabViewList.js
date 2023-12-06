import React, {useState, useEffect} from 'react'
import {
  StyleSheet,
  View,
  Text,
  useWindowDimensions,
  TouchableOpacity,
  ScrollView
} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {TabView, SceneMap, TabBar} from 'react-native-tab-view'
import {DataTable} from 'react-native-paper'
import Clipboard from '@react-native-clipboard/clipboard'
import {Empty} from '../../components/SpinnerEmpty'

import {useTranslation} from 'react-i18next'
import BarcodeInputAlert from '../../components/BarcodeInputAlert'

const TabViewList = ({detail, headSelected, detailSelected, detailInfo}) => {
  const {t} = useTranslation()

  const layout = useWindowDimensions()
  const [index, setIndex] = useState(0)
  const [routes] = useState([
    {key: 'first', title: `${t('item_list')}`},
    {key: 'second', title: `${t('receipt')}`}
  ])

  const renderTabBar = (props) => {
    return (
      <TabBar
        {...props}
        indicatorStyle={{backgroundColor: '#AE100F'}}
        style={{
          backgroundColor: '#fff0f0',
          height: 40
        }}
        renderLabel={({route, focused, color}) => (
          <Text
            style={{
              color: '#AE100F',
              fontWeight: 'bold',
              fontSize: 12
            }}>
            {route.title}
          </Text>
        )}
      />
    )
  }

  const renderScene = ({route}) => {
    switch (route.key) {
      case 'first':
        return (
          <TabViewLeft
            data={detail}
            selected={detailSelected}
            info={detailInfo}
          />
        )
      case 'second':
        return <TabViewRight selected={headSelected} />
      default:
        return null
    }
  }

  return (
    <View style={{height: 295}}>
      <TabView
        style={[styles.container]}
        renderTabBar={renderTabBar}
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width: layout.width}}
      />
    </View>
  )
}

const TabViewLeft = ({data, selected, info}) => {
  const {t} = useTranslation()

  return (
    <ScrollView nestedScrollEnabled={true}>
      <DataTable>
        <DataTable.Header style={{height: 50}}>
          <DataTable.Title style={{flex: 0.5}}>
            <Text style={styles.tableText}>#</Text>
          </DataTable.Title>
          <DataTable.Title style={{flex: 3}}>
            <Text style={styles.tableText}>{t('tracking_four')}</Text>
          </DataTable.Title>
          <DataTable.Title style={{flex: 2}}>
            <Text style={styles.tableText}>{t('item_no')}</Text>
          </DataTable.Title>
          <DataTable.Title
            style={{flex: 1, justifyContent: 'flex-end', paddingRight: '10%'}}>
            <Text style={styles.tableText}>{t('box')}</Text>
          </DataTable.Title>
          <DataTable.Title style={{flex: 2, justifyContent: 'flex-start'}}>
            <Text style={styles.tableText}>{t('status')}</Text>
          </DataTable.Title>

          <DataTable.Title style={{flex: 1}}></DataTable.Title>
        </DataTable.Header>

        {data !== null ? (
          data?.map((el) => (
            <DetailItem
              key={el.row_id}
              item={el}
              selected={selected}
              // onPress={() => onPressDetail(el?.item_no)}
              info={info}
            />
          ))
        ) : (
          <Empty />
        )}
      </DataTable>
    </ScrollView>
  )
}

const DetailItem = ({item, selected, info}) => {
  return (
    <DataTable.Row
      style={{paddingRight: 0}}
      key={item.row_id}
      onPress={() => item?.status === 'PICKED' && selected(item)}>
      <DataTable.Cell
        style={{
          flex: 0.5,
          borderRightWidth: 0.75,
          borderStyle: 'dashed',
          borderColor: '#eee'
        }}>
        <Text style={{color: '#000'}}>{item.row_id}</Text>
      </DataTable.Cell>
      <DataTable.Cell style={{flex: 2, justifyContent: 'center'}}>
        <Text style={{color: '#000'}}>{item.item_serial}</Text>
      </DataTable.Cell>
      <DataTable.Cell
        style={{flex: 3, justifyContent: 'flex-start'}}
        onLongPress={() => {
          Clipboard.setString(item.item_no)
          console.log('copy ', item.item_no)
        }}>
        <Text style={{color: '#000'}}>{item.item_no}</Text>
      </DataTable.Cell>
      <DataTable.Cell style={{flex: 0.75, justifyContent: 'flex-end'}}>
        <Text style={{color: '#000'}}>{item.qty_box}</Text>
      </DataTable.Cell>
      <DataTable.Cell
        style={{flex: 2.5, justifyContent: 'flex-end', paddingRight: '2%'}}>
        <View
          style={[
            styles.status,
            item.status === 'PICKED'
              ? styles.PICKED
              : item.status === 'LOADED'
              ? styles.LOADED
              : styles.UNLOAD
          ]}>
          <Text style={{fontSize: 10, color: '#ffff'}}>{item.status}</Text>
        </View>
      </DataTable.Cell>
      <DataTable.Cell
        style={{
          flex: 2,
          // backgroundColor: 'pink',
          justifyContent: 'center'
        }}
        onPress={() => info(item)}>
        <Ionicons
          style={styles.rightIcon}
          name={'search-circle'}
          size={40}
          color={'#777'}
        />
      </DataTable.Cell>
    </DataTable.Row>
  )
}

const TabViewRight = ({selected}) => {
  const {t} = useTranslation()

  return (
    <View style={{padding: 10, flex: 1}}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
        <Text style={{color: '#000'}}>
          {t('container_no')}:{' '}
          {selected?.container_no === null ? '-' : selected?.container_no}{' '}
        </Text>
        <Text style={{color: '#000'}}>
          {selected?.customer_id === null ? '-' : selected?.customer_id}
        </Text>
      </View>

      <Text style={{color: '#000'}}>
        {t('date_departure')}:{' '}
        {selected?.date_departure === null ? '-' : selected?.date_departure}
      </Text>

      <Text style={{color: '#000'}}>
        {t('date_arrival')}:{' '}
        {selected?.date_departure === null ? '-' : selected?.date_departure}
      </Text>

      <Text style={{color: '#000'}}>
        {t('car_regis')}:{' '}
        {selected?.Chinese_car_registration === null
          ? '-'
          : selected?.Chinese_car_registration}
      </Text>
      <Text style={{color: '#000'}}>
        {t('driver')}:{' '}
        {selected?.Chinese_driver === null ? '-' : selected?.Chinese_driver}
      </Text>
      <Text style={{color: '#000'}}>
        {t('transport_type')}:{' '}
        {selected?.shipment === null
          ? '-'
          : selected?.shipment === 'car'
          ? `${t('car')}`
          : `${t('ship')}`}
      </Text>
      <Text style={{color: '#000'}}>
        {t('phone')}: {selected?.phone === null ? '-' : selected?.phone}
      </Text>
      <Text style={{color: '#000'}}>
        {t('status')}: {selected?.status}
      </Text>
    </View>
  )
}

// ----------------------------------------------------------
// == STYLE
// ----------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    height: '100%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc'
  },

  shadow: {
    shadowOffset: {width: 0, height: 2},
    shadowColor: '#171717',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2
  },

  tableText: {
    color: 'black',
    fontSize: 10
  },
  titleText: {
    color: 'black',
    fontSize: 10
  },
  selected: {
    fontWeight: 'bold'
  },
  unselect: {
    backgroundColor: 'transparent',
    fontWeight: 'normal'
  },
  status: {
    paddingHorizontal: 3,
    paddingVertical: 1,
    borderRadius: 50
  },
  PICKED: {
    backgroundColor: '#4AB800',
    color: '#183B00'
  },
  LOADED: {
    backgroundColor: '#009DFF',
    color: '#003F67'
  },
  UNLOAD: {
    backgroundColor: '#FF003C',
    color: '#4A0011'
  }
})

export default TabViewList
