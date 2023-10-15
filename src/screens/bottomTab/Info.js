import React, {useState} from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import VersionCheck from 'react-native-version-check'

import {useEffect} from 'react'
import {CheckOnlineWeb, fetchUserProfile, sendLogout} from '../../apis/loginApi'
import {path} from '../../constants/url'

import {useTranslation} from 'react-i18next'
import {useAuthToken} from '../../hooks'
import {resetToken} from '../../store/slices/tokenSlice'
import {useDispatch} from 'react-redux'
import {screenMap} from '../../constants/screenMap'

const Info = ({navigation}) => {
  const [loading, setLoading] = useState(false)

  const [profile, setProfile] = useState(null)
  const {t, i18n} = useTranslation()
  const {userName, refresh} = useAuthToken()

  const dispatch = useDispatch()

  // == API
  // =================================================================
  const checkRefreshToken = async () => {
    const res = await CheckOnlineWeb(refresh)
      .then(() => {
        return true
      })
      .catch(() => {
        dispatch(resetToken())
        navigation.reset({index: 0, routes: [{name: screenMap.Login}]})

        Platform.OS === 'android'
          ? Alert.alert(t('auth_access_denied'), t('auth_access_denied_detail'))
          : alert(t('auth_access_denied'), t('auth_access_denied_detail'))

        return false
      })

    return res
  }

  const fetchUserProfile_API = async (user_id) => {
    const res = await fetchUserProfile(user_id)
    setProfile(res.data[0])
  }

  // == EFFECT
  // =================================================================
  useEffect(() => {
    if (userName) {
      fetchUserProfile_API(userName)
    }
  }, [])

  // == HANDLE
  // =================================================================
  const handleLogout = async () => {
    setLoading(!loading)

    if (await checkRefreshToken()) {
      await sendLogout(refresh).then(() => {
        setLoading(false)
      })
      dispatch(resetToken())
    }

    navigation.reset({index: 0, routes: [{name: screenMap.Login}]})
  }

  // == COMPONENT Info
  // =================================================================
  return (
    <View style={styles.container}>
      <View style={[styles.infoMenu, styles.shadow]}>
        <View style={[styles.infoMenuItem, {backgroundColor: '#AE100F'}]}>
          <View style={styles.groupStart}>
            {profile && (
              <Image
                resizeMode={'contain'}
                style={styles.avatar}
                source={{
                  uri: `${path.IMG}/${profile?.img_idcard}`
                }}
              />
            )}

            <View>
              <Text
                style={{
                  color: '#fff'
                }}>{`${profile?.first_name} ${profile?.last_name}`}</Text>
              <Text style={{color: '#fff'}}>{`ID:  ${profile?.user_id}`}</Text>
            </View>
          </View>
        </View>

        <InfoItem icon="person" text={t('personal_info')} />
        <InfoItem icon="help-circle" text={t('help')} />
        <InfoItem icon="settings" text={t('setting')} />
      </View>

      <TouchableOpacity
        // disabled={loading}
        style={[
          styles.signout,
          styles.shadow,
          styles.row,

          {justifyContent: 'center', gap: 10},
          loading && {backgroundColor: '#000'}
        ]}
        onPress={handleLogout}>
        {loading ? (
          <ActivityIndicator size={25} color="#FFF" />
        ) : (
          <Ionicons name={'log-out-outline'} size={25} color={'#fff'} />
        )}

        <Text style={styles.signoutText}>{t('logout')}</Text>
      </TouchableOpacity>
      <Text style={{color: '#000', alignSelf: 'flex-end'}}>
        {' '}
        v.{VersionCheck.getCurrentVersion()}
      </Text>
    </View>
  )
}

const InfoItem = ({icon, text, nav}) => {
  return (
    <TouchableOpacity style={styles.infoMenuItem} onPress={nav ? nav : null}>
      <View style={styles.groupStart}>
        <Ionicons name={`${icon}-outline`} size={25} color={'#AE100F'} />
        <Text style={styles.infoText}>{text}</Text>
      </View>
      <Ionicons
        style={styles.rightIcon}
        name={'chevron-forward-outline'}
        size={25}
        color={'#777'}
      />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    paddingHorizontal: 15,
    paddingTop: 10
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain'
  },
  avatar: {
    width: 50,
    height: 50,

    borderRadius: 50
  },
  infoMenu: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
    marginBottom: 10,
    borderRadius: 8,
    overflow: 'hidden'
  },
  infoMenuItem: {
    height: 55,
    backgroundColor: '#fff',
    // backgroundColor: 'pink',
    paddingHorizontal: 20,
    paddingVertical: 15,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  groupStart: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20
  },
  infoText: {
    color: '#444',
    fontSize: 18
  },
  rightIcon: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  signout: {
    backgroundColor: '#AE100F',
    width: '100%',
    paddingVertical: 10,
    borderRadius: 30
  },

  signoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center'
  },
  shadow: {
    shadowOffset: {width: 0, height: 2},
    shadowColor: '#171717',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5
  }
})

export default Info
