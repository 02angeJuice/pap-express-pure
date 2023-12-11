import React, {createContext, useState} from 'react'
import {Platform, Alert} from 'react-native'
import {useDispatch, useSelector} from 'react-redux'
import {resetToken} from '../store/slices/tokenSlice'

import {sendDetailsBox, sendAvailableBox} from '../apis'

import {useTranslation} from 'react-i18next'
import {screenMap} from '../constants/screenMap'

const ModalScanContext = createContext()

const ModalScanContextProvider = ({children}) => {
  const {userName, refreshToken} = useSelector((state) => state.token)

  const {t} = useTranslation()

  const [boxAvail, setBoxAvail] = useState(null)

  console.log('scan context', boxAvail)

  const dispatch = useDispatch()

  // ----------------------------------------------------------
  // == API
  // ----------------------------------------------------------
  const insertDetailsBox = async (
    item_no,
    box_id,
    num_box,
    from,
    navigation
  ) => {
    await sendDetailsBox(
      {
        item_no: item_no,
        box_id: `${item_no}/${box_id}`,
        num_box: num_box,
        maker: userName,
        is_scan:
          from === 'load' ? 'SCANED' : from === 'unload' ? 'IDLE' : 'IDLE',
        is_scan_d:
          from === 'distribute'
            ? 'SCANED'
            : from === 'receive'
            ? 'DONE'
            : 'IDLE'
      },
      refreshToken.token
    ).catch((err) => {
      console.log(err.message)

      if (err.message == 401) {
        dispatch(resetToken())
        navigation.reset({index: 0, routes: [{name: screenMap.Login}]})

        Platform.OS === 'android'
          ? Alert.alert(t('auth_access_denied'), t('auth_access_denied_detail'))
          : alert(t('auth_access_denied'), t('auth_access_denied_detail'))
      }

      Platform.OS === 'android'
        ? Alert.alert(t('auth_access_denied'), t('auth_access_denied_detail'))
        : alert(t('auth_access_denied'), t('auth_access_denied_detail'))
    })
    // }
  }

  const updateAvailBox = async (item_no, box_avail) => {
    await sendAvailableBox(
      {
        item_no: item_no,
        qty_box_avail: box_avail,
        update_by: userName
      },
      refreshToken.token
    )
    // }
  }
  // ----------------------------------------------------------

  return (
    <ModalScanContext.Provider
      value={{
        insertDetailsBox,
        updateAvailBox,

        boxAvail,
        setBoxAvail
      }}>
      {children}
    </ModalScanContext.Provider>
  )
}

export {ModalScanContext, ModalScanContextProvider}
