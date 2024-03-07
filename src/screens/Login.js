import React, {useState} from 'react'
import {
  StatusBar,
  StyleSheet,
  View,
  Text,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  Alert,
  Platform,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import VersionCheck from 'react-native-version-check'

import {LOGIN} from '../constants/images'

import {useController, useForm} from 'react-hook-form'
import {useTranslation} from 'react-i18next'
import {useAuthToken} from '../hooks'
import {useDispatch} from 'react-redux'
import {
  setAccessToken,
  setRefreshToken,
  setUserName
} from '../store/slices/tokenSlice'

import {sendCheckLoginHH, sendLoginHH} from '../apis/loginApi'
// import {screenMap} from '../constants/screenMap'

const Login = ({navigation}) => {
  const [loading, setLoading] = useState(false)

  const {t} = useTranslation()
  const {userName} = useAuthToken()
  const {control, handleSubmit, reset} = useForm({
    defaultValues: {
      username: userName || ''
    }
  })

  const dispatch = useDispatch()

  // ----------------------------------------------------------
  // == API
  // ----------------------------------------------------------
  const sendCheckLoginHH_API = async ({user_id, password}) => {
    setLoading(true)

    try {
      const res = await sendCheckLoginHH({user_id, password})
      console.log('sendCheckLoginHH_API:', res?.data)

      if (res?.data.statusCode == 200) {
        await sendLoginHH_API({
          user_id: user_id,
          password: password
        })
      }
    } catch (err) {
      const {error, message, statusCode} = err?.response?.data
      console.log('sendCheckLoginHH_API', err.response?.data)

      if (message === 'alertOnline') {
        console.log('มีคน Login อยู่')
        Alert.alert(t('auth_login_online'), t('auth_login_online_detail'), [
          {
            text: t('cancel'),
            onPress: () => setLoading(false),
            style: 'cancel'
          },
          {
            text: t('confirm'),
            onPress: async () =>
              await sendLoginHH_API({
                user_id: user_id,
                password: password
              })
          }
        ])
      } else if (message === 'loginInvalid') {
        alertReUse('auth_login_invalid', 'auth_login_invalid_detail')
        reset({username: user_id, password: ''})
      } else if (message[0] === 'password should not be empty') {
        alertReUse('auth_login_invalid', 'auth_login_invalid_password')
      } else if (message[0] === 'user_id should not be empty') {
        alertReUse('auth_login_invalid', 'auth_login_invalid_username')
      } else {
        alertReUse(`${statusCode} ${error}`, message)
      }
    }

    setLoading(false)
  }

  const sendLoginHH_API = async ({user_id, password}) => {
    setLoading(true)

    try {
      const res = await sendLoginHH({user_id, password})
      console.log('sendLoginHH_API', res?.data)

      if (res?.status == 200) {
        dispatch(setAccessToken(res?.data?.access_token))
        dispatch(setRefreshToken(res?.data?.refresh_token))
        dispatch(setUserName(user_id))

        alertReUse('auth_login_success', 'auth_login_success_detail')
        // navigation.navigate(screenMap.HomePage)
        // navigation.reset({index: 0, routes: [{name: screenMap.HomePage}]})
      }
    } catch (err) {
      const {error, message, statusCode} = err?.response?.data

      console.log('sendLoginHH_API', err.response?.data)

      if (message === 'alertLoginLimit') {
        alertReUse('auth_login_limit', 'auth_login_limit_detail')
      } else {
        alertReUse(`${statusCode} ${error}`, message)
      }
    }

    setLoading(false)
  }

  // ----------------------------------------------------------
  // == HANDLE
  // ----------------------------------------------------------
  const onSubmit = async (data) => {
    try {
      const res = await sendCheckLoginHH_API({
        user_id: data.username,
        password: data.password
        // password: data.password ? data.password : 'Warehousedbo!1'
      })

      console.log(res)
    } catch (error) {}
  }

  const alertReUse = (msg, detail) => {
    Platform.OS === 'android'
      ? Alert.alert(t(msg), t(detail), [{onPress: () => setLoading(false)}])
      : alert(t(msg), t(detail))
  }

  // ----------------------------------------------------------
  // == MAIN
  // ----------------------------------------------------------
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#6AA3F0" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ImageBackground style={styles.image} resizeMode="cover" source={LOGIN}>
          <View style={styles.groupForm}>
            <View style={styles.groupInput}>
              <Input name={t('username')} type="username" control={control} />
            </View>
            <View style={styles.groupInput}>
              <Input name={t('password')} type="password" control={control} />
            </View>

            <TouchableOpacity
              // disabled={loading}
              style={[
                styles.button,
                styles.shadow,
                styles.row,
                {justifyContent: 'center', gap: 10},
                loading && {backgroundColor: '#000'}
              ]}
              onPress={handleSubmit(onSubmit)}>
              {loading ? (
                <ActivityIndicator size={25} color="#FFF" />
              ) : (
                <Ionicons name={'log-in-outline'} size={25} color={'#000'} />
              )}

              <Text
                style={[
                  {color: '#183B00', fontSize: 20, fontWeight: 'bold'},
                  loading && {color: '#fff'}
                ]}>
                {t('login')}
              </Text>
            </TouchableOpacity>

            <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
              <Text style={[{color: '#000'}]}>
                v.{VersionCheck.getCurrentVersion()}
              </Text>
            </View>
          </View>
        </ImageBackground>
      </TouchableWithoutFeedback>
    </View>
  )
}

// ----------------------------------------------------------
// == COMPONENT
// ----------------------------------------------------------
const Input = ({name, type, control}) => {
  const {field} = useController({
    control,
    defaultValue: '',
    name: type
  })

  return (
    <TextInput
      style={[styles.shadow, styles.input, {color: '#000', fontSize: 20}]}
      editable={true}
      maxLength={16}
      secureTextEntry={type === 'password'}
      placeholder={`${name}`}
      placeholderTextColor="gray"
      value={field.value}
      onChangeText={field.onChange}
    />
  )
}

// ----------------------------------------------------------
// == STYLE
// ----------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  image: {
    flex: 1,
    justifyContent: 'center'
  },
  groupForm: {
    marginTop: '30%',
    padding: 25,
    display: 'flex',
    flexDirection: 'column',
    gap: 20
  },
  groupInput: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 5
  },
  labelText: {
    fontSize: 20,
    color: '#222'
  },
  input: {
    backgroundColor: '#F4F4F4',
    borderColor: '#7A7A7A',
    borderWidth: 0.5,
    borderRadius: 30,
    padding: 8,
    paddingHorizontal: 20,
    width: '100%'
  },
  button: {
    marginTop: 10,
    backgroundColor: 'white',
    borderRadius: 30,
    backgroundColor: '#ABFC74',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  shadow: {
    shadowOffset: {width: 0, height: 2},
    shadowColor: '#171717',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5
  },
  shadowText: {
    textShadowOffset: {width: 0, height: 3},
    textShadowColor: '#000',
    textShadowRadius: 5
  },

  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center'
  },
  checked: {
    backgroundColor: 'blue' // Change to your desired checked color
  }
})

export default React.memo(Login)
