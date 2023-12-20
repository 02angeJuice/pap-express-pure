import {useContext} from 'react'
import {useSelector} from 'react-redux'
import {RefreshContext} from '../contexts/RefreshContext'
import {ModalScanContext} from '../contexts/ModalScanContext'

export const useRefresh = () => {
  const {fast, slow} = useContext(RefreshContext)
  return {fastRefresh: fast, slowRefresh: slow}
}

export const useScan = () => {
  const {boxAvail, setBoxAvail, insertDetailsBox, updateAvailBox} =
    useContext(ModalScanContext)

  return {boxAvail, setBoxAvail, insertDetailsBox, updateAvailBox}
}

export const useAuthToken = () => {
  const {userName, refreshToken, accessToken} = useSelector(
    (state) => state.token
  )

  return {
    userName,
    refresh: refreshToken?.token,
    token: accessToken?.token
  }
}

export const useFocus = () => {
  const focus = useSelector((state) => state.focus)
  return focus
}

export const useSettings = () => {
  const {language, filter_di, filter_re} = useSelector((state) => state.setting)
  return {language, filter_di, filter_re}
}
