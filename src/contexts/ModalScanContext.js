import React, { createContext, useState } from 'react'
import { Platform, Alert } from 'react-native'
import { useDispatch } from 'react-redux'
import { resetToken } from '../store/slices/tokenSlice'

import { sendDetailsBox, sendAvailableBox } from '../apis'

import { useAuthToken } from '../hooks'
import { useTranslation } from 'react-i18next'

const ModalScanContext = createContext()

const ModalScanContextProvider = ({ children }) => {
    const { userName, token, refresh } = useAuthToken()
    const { t } = useTranslation()

    const [boxAvail, setBoxAvail] = useState(null)

    console.log(boxAvail)

    const dispatch = useDispatch()

    // == API
    // =================================================================

    const insertDetailsBox = async (item_no, box_id, from) => {
        await sendDetailsBox(
            {
                item_no: item_no,
                box_id: `${item_no}/${box_id}`,
                maker: userName,
                is_scan:
                    from === 'load'
                        ? 'SCANED'
                        : from === 'unload'
                        ? 'IDLE'
                        : 'IDLE',
                is_scan_d:
                    from === 'distribute'
                        ? 'SCANED'
                        : from === 'receive'
                        ? 'DONE'
                        : 'IDLE',
            },
            refresh
        ).catch((err) => {
            console.log(err.message)

            if (err.message == 401) {
                dispatch(resetToken())
                Platform.OS === 'android'
                    ? Alert.alert(
                          t('auth_access_denied'),
                          t('auth_access_denied_detail')
                      )
                    : alert(
                          t('auth_access_denied'),
                          t('auth_access_denied_detail')
                      )
            }

            Platform.OS === 'android'
                ? Alert.alert(
                      t('auth_access_denied'),
                      t('auth_access_denied_detail')
                  )
                : alert(t('auth_access_denied'), t('auth_access_denied_detail'))
        })
        // }
    }

    const updateAvailBox = async (item_no, box_avail) => {
        await sendAvailableBox(
            {
                item_no: item_no,
                qty_box_avail: box_avail,
                update_by: userName,
            },
            refresh
        ).catch((err) => {
            console.log(err.message)
            if (err.message == 401) {
                dispatch(resetToken())
                Platform.OS === 'android'
                    ? Alert.alert(
                          t('auth_access_denied'),
                          t('auth_access_denied_detail')
                      )
                    : alert(
                          t('auth_access_denied'),
                          t('auth_access_denied_detail')
                      )
            }

            Platform.OS === 'android'
                ? Alert.alert(
                      t('auth_access_denied'),
                      t('auth_access_denied_detail')
                  )
                : alert(t('auth_access_denied'), t('auth_access_denied_detail'))
        })

        // }
    }
    // =================================================================

    return (
        <ModalScanContext.Provider
            value={{
                insertDetailsBox,
                updateAvailBox,

                boxAvail,
                setBoxAvail,
            }}
        >
            {children}
        </ModalScanContext.Provider>
    )
}

export { ModalScanContext, ModalScanContextProvider }
