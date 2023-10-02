import React, {useState} from 'react'
import {
  StyleSheet,
  View,
  Text,
  useWindowDimensions,
  TouchableOpacity
} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {TabView, SceneMap, TabBar} from 'react-native-tab-view'
import {DataTable} from 'react-native-paper'
import {Empty} from '../../components/SpinnerEmpty'

import {useTranslation} from 'react-i18next'

const TabViewList = ({detail, headSelected, detailSelected, detailInfo}) => {
  const {t} = useTranslation()

  const layout = useWindowDimensions()
  const [index, setIndex] = useState(0)
  const [routes] = useState([
    {key: 'first', title: `${t('item_list')}`},
    {key: 'second', title: `${t('receipt')}`}
  ])

  const renderTabBar = props => {
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

const TabViewLeft = ({data, selected, info}) => {
  const {t} = useTranslation()

  return (
    <DataTable>
      <DataTable.Header style={{height: 50}}>
        <DataTable.Title>
          <Text style={styles.tableText}>#</Text>
        </DataTable.Title>
        <DataTable.Title>
          <Text style={styles.tableText}>{t('item_name')}</Text>
        </DataTable.Title>
        <DataTable.Title>
          <Text style={styles.tableText}>{t('box')}</Text>
        </DataTable.Title>
        <DataTable.Title>
          <Text style={styles.tableText}>{t('status')}</Text>
        </DataTable.Title>
      </DataTable.Header>

      {data !== null ? (
        data?.map(el => (
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
  )
}

const DetailItem = ({item, selected, info}) => {
  const CellComponent = ({text}) => {
    return (
      <DataTable.Cell>
        <Text
        // style={[
        //     styles.titleText,
        //     selected?.item_no === item.item_no
        //         ? styles.selected
        //         : styles.unselect,
        // ]}
        >
          {text}
        </Text>
      </DataTable.Cell>
    )
  }

  return (
    <DataTable.Row
      key={item.row_id}
      onPress={() => item?.status === 'PICKED' && selected(item)}
      // onPress={() => selected(item)}
      // style={[
      //     selected?.item_no === item.item_no
      //         ? { backgroundColor: '#FFDADA' }
      //         : '',
      // ]}
    >
      <CellComponent text={item.row_id} />
      <CellComponent text={item.item_name} />
      <CellComponent text={`${item.qty_box}`} />
      <DataTable.Cell>
        <View
          style={[
            styles.status,
            item.status === 'PICKED'
              ? styles.PICKED
              : item.status === 'LOADED'
              ? styles.LOADED
              : styles.UNLOAD
          ]}>
          <Text style={{fontSize: 10}}>{item.status}</Text>
        </View>
      </DataTable.Cell>

      <TouchableOpacity
        style={{justifyContent: 'center', alignItems: 'center'}}
        onPress={() => info(item)}>
        <Ionicons
          style={styles.rightIcon}
          name={'search'}
          size={17}
          color={'#777'}
        />
      </TouchableOpacity>
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
        <Text>
          {t('container_no')}:{' '}
          {selected?.container_no === null ? '-' : selected?.container_no}{' '}
        </Text>
        <Text>
          {t('customer')}:{' '}
          {selected?.customer_id === null ? '-' : selected?.customer_id}
        </Text>
      </View>

      <Text>
        {t('date_departure')}:{' '}
        {selected?.date_departure === null ? '-' : selected?.date_departure}
      </Text>

      <Text>
        {t('car_regis')}:{' '}
        {selected?.Chinese_car_registration === null
          ? '-'
          : selected?.Chinese_car_registration}
      </Text>
      <Text>
        {t('driver')}:{' '}
        {selected?.Chinese_driver === null ? '-' : selected?.Chinese_driver}
      </Text>
      <Text>
        {t('transport_type')}:{' '}
        {selected?.shipment === null
          ? '-'
          : selected?.shipment === 'car'
          ? `${t('car')}`
          : `${t('ship')}`}
      </Text>
      <Text>
        {t('phone')}: {selected?.phone === null ? '-' : selected?.phone}
      </Text>
      <Text>
        {t('status')}: {selected?.status}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    height: 250,
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
