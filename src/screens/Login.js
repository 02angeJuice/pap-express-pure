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
  ActivityIndicator
} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import VersionCheck from 'react-native-version-check'

// import RNFS from 'react-native-fs'

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
import {screenMap} from '../constants/screenMap'

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

  // == API
  // =================================================================
  const sendCheckLoginHH_API = async ({user_id, password}) => {
    try {
      const res = await sendCheckLoginHH({user_id, password})
      // console.log('CheckLoginHH:', res)

      if (res?.status === 200) {
        await sendLoginHH_API({
          user_id: user_id,
          password: password
        })
      } else {
        if (res?.response.data.message === 'alertOnline') {
          console.log('มีคนล็อคอินอยู่')

          Platform.OS === 'android'
            ? Alert.alert(
                t('auth_login_online'),
                t('auth_login_online_detail'),
                [
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
                ]
              )
            : confirm(
                `${t('auth_login_online')} ${t('auth_login_online_detail')}`
              ) &&
              (await sendLoginHH_API({
                user_id: user_id,
                password: password
              }))
        } else {
          if (res?.response.data.message[0].includes('password')) {
            alertReUse('auth_login_invalid', 'auth_login_invalid_password')
          } else if (res?.response.data.message[0].includes('user_id')) {
            alertReUse('auth_login_invalid', 'auth_login_invalid_username')
          } else {
            alertReUse('auth_login_invalid', 'auth_login_invalid_detail')

            reset({username: user_id, password: ''})
          }
        }
      }
    } catch (error) {
      console.log('sendCheckLoginHH_API: ', error)
    }
  }

  const sendLoginHH_API = async ({user_id, password}) => {
    try {
      const res = await sendLoginHH({user_id, password})
      // console.log('LoginHH', res)

      if (res?.status == 200) {
        dispatch(setAccessToken(res.data?.access_token))
        dispatch(setRefreshToken(res.data?.refresh_token))
        dispatch(setUserName(user_id))

        console.log('access', res.data?.access_token)
        console.log('refresh', res.data?.refresh_token)

        alertReUse('auth_login_success', 'auth_login_success_detail')
        // navigation.navigate(screenMap.HomePage)

        setLoading(false)

        navigation.reset({index: 0, routes: [{name: screenMap.HomePage}]})
      } else {
        if (res?.response.data.message === 'alertLoginLimit') {
          console.log('จำนวนล็อคอินเต็ม')
          alertReUse('auth_login_limit', 'auth_login_limit_detail')
        }
      }
    } catch (error) {
      console.log('sendLoginHH_API: ', error)
    }
  }

  // == HNADLE
  // =================================================================
  const onSubmit = async (data) => {
    setLoading(!loading)

    await sendCheckLoginHH_API({
      user_id: data.username,
      // password: data.password ? data.password : 'Warehousedbo!1'
      password: data.password
    })
  }

  const alertReUse = (msg, detail) => {
    Platform.OS === 'android'
      ? Alert.alert(t(msg), t(detail), [{onPress: () => setLoading(false)}])
      : alert(t(msg), t(detail))
  }

  // == COMPONENT Login
  // =================================================================
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#6AA3F0" />
      <ImageBackground style={styles.image} resizeMode="cover" source={LOGIN}>
        {/* <DismissKeyboardView> */}
        <View style={styles.groupForm}>
          <View style={styles.groupInput}>
            {/* <Text style={styles.labelText}>{t('username')}</Text> */}
            <Input name="username" control={control} />
          </View>
          <View style={styles.groupInput}>
            {/* <Text style={styles.labelText}>{t('password')}</Text> */}
            <Input name="password" control={control} />
          </View>

          <TouchableOpacity
            disabled={loading}
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
                {color: '#183B00', fontSize: 18, fontWeight: 'bold'},
                loading && {color: '#fff'}
              ]}>
              {t('login')}
            </Text>
          </TouchableOpacity>

          <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
            <Text style={{color: '#000'}}>
              v.{VersionCheck.getCurrentVersion()}
            </Text>
          </View>
        </View>
        {/* </DismissKeyboardView> */}
      </ImageBackground>
    </View>
  )
}

const Input = ({name, control}) => {
  const {field} = useController({
    control,
    defaultValue: '',
    name
  })

  return (
    <TextInput
      style={[styles.shadow, styles.input, {color: '#000', fontSize: 20}]}
      editable={true}
      maxLength={16}
      secureTextEntry={name === 'password'}
      placeholder={`${name}`}
      placeholderTextColor="gray"
      value={field.value}
      onChangeText={field.onChange}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
    // marginTop: StatusBar.currentHeight || 0,
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
    // fontWeight: 'bold',
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

export default Login
