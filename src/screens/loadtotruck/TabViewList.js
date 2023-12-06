import React, {useState} from 'react'
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
import {Empty} from '../../components/SpinnerEmpty'

import {useTranslation} from 'react-i18next'
import Scan from './Scan'

const TabViewList = ({
  data,
  detail,
  headSelected,
  detailSelected,
  detailInfo
}) => {
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
          height: 50
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
        return <TabViewLeft data={data} />
      case 'second':
        return <TabViewRight selected={data} />
      default:
        return null
    }
  }

  // ----------------------------------------------------------
  // == MAIN
  // ----------------------------------------------------------
  return (
    <TabView
      style={[styles.container, styles.shadow]}
      renderTabBar={renderTabBar}
      navigationState={{index, routes}}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{width: layout.width}}
    />
  )
}

const TabViewLeft = ({data}) => {
  const {t} = useTranslation()

  // return "dsds"

  return <Scan data={data} />
}

const DetailItem = ({item, selected, info}) => {
  return (
    <DataTable.Row
      style={{paddingRight: 0}}
      key={item.row_id}
      onPress={() => item?.status === 'PICKED' && selected(item)}
      // onPress={() => selected(item)}
      // style={[
      //     selected?.item_no === item.item_no
      //         ? { backgroundColor: '#FFDADA' }
      //         : '',
      // ]}
    >
      <DataTable.Cell
        style={{
          flex: 0.5,
          borderRightWidth: 0.75,
          borderStyle: 'dashed',
          borderColor: '#eee'
        }}>
        <Text>{item.row_id}</Text>
      </DataTable.Cell>
      <DataTable.Cell style={{flex: 2, justifyContent: 'center'}}>
        <Text>{item.item_serial}</Text>
      </DataTable.Cell>
      <DataTable.Cell style={{flex: 3, justifyContent: 'flex-start'}}>
        <Text>{item.item_name}</Text>
      </DataTable.Cell>
      <DataTable.Cell style={{flex: 0.75, justifyContent: 'flex-end'}}>
        <Text>{item.qty_box}</Text>
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
    maxHeight: 100,

    flex: 1,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#fff0f0'
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
