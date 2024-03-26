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
  TouchableWithoutFeedback
} from 'react-native'

import Ionicons from 'react-native-vector-icons/Ionicons'
import {useTranslation} from 'react-i18next'

const Information = ({orderSelected}) => {
  const {t} = useTranslation()

  return (
    <View
      style={[
        styles.column,
        {
          marginTop: 10,
          backgroundColor: '#FFF',
          borderRadius: 10,
          gap: 3
        },
        styles.itemContent,
        orderSelected?.status === 'DATA ENTRY' && {
          borderLeftColor: '#FF003C',
          borderLeftWidth: 10,
          backgroundColor: '#FFEBF1'
        },
        orderSelected?.status === 'ONSHIP' && {
          borderLeftColor: '#539ffc',
          borderLeftWidth: 10,
          backgroundColor: '#EBF4FF'
        },
        orderSelected?.status === 'CLOSED' && {
          borderLeftColor: '#95ed66',
          borderLeftWidth: 10,
          backgroundColor: '#E3FFD4'
        }
      ]}>
      <View style={[styles.row, {justifyContent: 'space-end'}]}>
        <View style={[styles.row, {gap: 3}]}>
          <Text style={{color: '#000', fontSize: 18}}>{t('receipt_no')}:</Text>
          <Text style={{color: '#000', fontSize: 18, fontWeight: '700'}}>
            {orderSelected?.distribution_id}
          </Text>
        </View>
      </View>

      {orderSelected?.distributeType !== 'PDT001' && (
        <Text style={{color: '#000', fontSize: 18}}>
          {t('driver')}: {orderSelected?.driver}
        </Text>
      )}

      <View style={[styles.row, {justifyContent: 'space-between'}]}>
        <View style={[styles.row, {gap: 3}]}>
          <Text style={{color: '#000', fontSize: 18}}>{t('recipient')}:</Text>
          <Text style={{color: '#000', fontSize: 18, fontWeight: 'bold'}}>
            {orderSelected?.customer_id}
          </Text>
        </View>
        <Text
          style={{
            color: '#000',
            fontSize: 20,
            fontStyle: 'italic',
            fontWeight: 700
          }}>
          {`${
            orderSelected?.first_name === '-'
              ? ''
              : orderSelected?.first_name || ''
          }`}
          {`${
            orderSelected?.last_name === '-'
              ? ''
              : ' ' + orderSelected?.last_name || ''
          }`}
        </Text>
      </View>

      <View
        style={[styles.column, {justifyContent: 'flex-start', marginTop: 10}]}>
        <View style={[styles.row, {gap: 3}]}>
          <Text style={{color: '#000', fontSize: 18}}>{t('phone')}:</Text>

          <TouchableOpacity
            disabled={!orderSelected?.phone}
            onPress={() => handleCallPress(orderSelected?.phone)}>
            <Text
              style={{
                color: orderSelected?.phone ? '#007ECC' : '#000',
                fontSize: 18,
                fontWeight: 'bold'
              }}>
              {orderSelected?.phone || '--'}
            </Text>
          </TouchableOpacity>

          {orderSelected?.phone && (
            <Ionicons name={'call'} size={20} color="#007ECC" />
          )}
        </View>

        <View style={[styles.row, {gap: 3}]}>
          <Text style={{color: '#000', fontSize: 18}}>{t('phone2')}:</Text>

          <TouchableOpacity
            disabled={!orderSelected?.phonespare}
            onPress={() => handleCallPress(orderSelected?.phonespare)}>
            <Text
              style={{
                color: orderSelected?.phonespare ? '#007ECC' : '#000',
                fontSize: 18,
                fontWeight: 'bold'
              }}>
              {orderSelected?.phonespare || '--'}
            </Text>
          </TouchableOpacity>

          {orderSelected?.phonespare && (
            <Ionicons name={'call'} size={20} color="#007ECC" />
          )}
        </View>
      </View>

      <View
        style={[
          styles.row,
          {
            justifyContent: 'center',
            gap: 3,
            backgroundColor: '#fff',
            borderRadius: 5,
            borderColor: '#eee',
            borderWidth: 1,
            padding: 3,
            marginVertical: 4
          }
        ]}>
        <Ionicons color="#FF0000" name="location-outline" size={20} />
        <Text
          style={{
            flex: 1,
            flexWrap: 'wrap',
            color: '#000',
            fontSize: 18
          }}>
          {orderSelected?.address?.replace('-', '')}{' '}
          {orderSelected?.subdistrict} {orderSelected?.district}{' '}
          {orderSelected?.province} {orderSelected?.zip_code}
        </Text>
      </View>

      <View style={[styles.row, {gap: 2, justifyContent: 'flex-start'}]}>
        <Text style={{color: '#000', fontSize: 18}}>
          {t('transport_type')}:{' '}
        </Text>
        <View
          style={[
            styles.status,
            styles.row,
            orderSelected?.distributeType === 'PDT001'
              ? styles.PICKED
              : orderSelected?.distributeType === 'PDT002'
              ? styles.ONSHIP
              : orderSelected?.distributeType === 'PDT003'
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
              orderSelected?.distributeType === 'PDT001'
                ? 'home'
                : orderSelected?.distributeType === 'PDT002'
                ? 'bag-handle'
                : orderSelected?.distributeType === 'PDT003'
                ? 'cube'
                : 'business'
            }
            size={15}
          />
          <Text style={{padding: 2, color: '#000', fontSize: 18}}>
            {orderSelected?.distributeType === 'PDT001'
              ? `${t('od_type_warehouse')}`
              : orderSelected?.distributeType === 'PDT002'
              ? `${t('od_type_express')}`
              : orderSelected?.distributeType === 'PDT003'
              ? `${t('od_type_self')}`
              : `${t('od_type_office')}`}
          </Text>
        </View>
      </View>

      <View style={[styles.row, {gap: 2, justifyContent: 'flex-start'}]}>
        <Text style={{color: '#000', fontSize: 18}}>{t('status')}:</Text>
        <View
          style={[
            styles.status,

            orderSelected?.status === 'CLOSED'
              ? {backgroundColor: '#2FC58B'}
              : orderSelected?.status === 'ONSHIP'
              ? {backgroundColor: '#009DFF'}
              : {backgroundColor: '#FF2F61'}
          ]}>
          <Text style={{padding: 2, color: '#FFF', fontSize: 18}}>
            {orderSelected?.status}
          </Text>
        </View>
      </View>
    </View>
  )
}

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
  }
})

export default Information
