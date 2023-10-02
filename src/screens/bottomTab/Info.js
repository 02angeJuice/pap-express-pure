import React, { useState } from 'react'
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    Platform,
    Alert,
} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

import { useEffect } from 'react'
import {
    fetchUserProfile,
    sendLogout,
    sendRefreshToken,
} from '../../apis/loginApi'
import { path } from '../../constants/url'

import { useTranslation } from 'react-i18next'
import { useAuthToken } from '../../hooks'
import {
    resetToken,
    setAccessToken,
    setRefreshToken,
} from '../../store/slices/tokenSlice'
import { useDispatch } from 'react-redux'
import moment from 'moment'

const Info = ({ navigation }) => {
    const [profile, setProfile] = useState(null)
    const { t, i18n } = useTranslation()
    const { userName, refresh, token } = useAuthToken()

    const dispatch = useDispatch()

    // == API
    // =================================================================
    const checkRefreshToken = async () => {
        const res = await sendRefreshToken(refresh)

        if (res?.status === 200) {
            dispatch(setAccessToken(res.data?.access_token))
            dispatch(setRefreshToken(res.data?.refresh_token))
            console.log(
                `${moment().format(
                    'MMMM Do YYYY, h:mm:ss a'
                )} | REFRESH TOKEN CHANGED!.`
            )

            return true
        } else {
            dispatch(resetToken())

            Platform.OS === 'android'
                ? Alert.alert(
                      t('auth_access_denied'),
                      t('auth_access_denied_detail')
                  )
                : alert(t('auth_access_denied'), t('auth_access_denied_detail'))

            return false
        }
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
        if (await checkRefreshToken()) {
            await sendLogout(refresh)
            dispatch(resetToken())
        }
    }

    // == COMPONENT Info
    // =================================================================
    return (
        <View style={styles.container}>
            {/* <Image style={styles.logo} source={LOGO} /> */}

            <View style={[styles.infoMenu, styles.shadow]}>
                <View
                    style={[
                        styles.infoMenuItem,
                        { backgroundColor: '#AE100F' },
                    ]}
                >
                    <View style={styles.groupStart}>
                        {profile && (
                            <Image
                                resizeMode={'contain'}
                                style={styles.avatar}
                                // source={
                                //     profile
                                //         ? require(`${profile?.img_profile}`)
                                //         : AVATAR
                                // }

                                source={{
                                    uri: `${path.IMG}/${profile?.img_idcard}`,
                                }}

                                // source={{
                                //     uri: profile?.img_idcard
                                //         ? `${path.IMG}/${profile?.img_idcard}`
                                //         : AVATAR,
                                // }}
                            />
                        )}

                        <View>
                            <Text
                                style={{ color: '#fff' }}
                            >{`${profile?.first_name} ${profile?.last_name}`}</Text>
                            <Text
                                style={{ color: '#fff' }}
                            >{`ID:  ${profile?.user_id}`}</Text>
                        </View>
                    </View>
                </View>

                <InfoItem
                    icon="person"
                    text={t('personal_info')}
                    // nav={() =>
                    //     navigation.navigate(screenMap.UserProfile, {
                    //         profile: profile,
                    //     })
                    // }
                />
                {/* <InfoItem icon="qr-code" text="คิวอาร์โค้ด" /> */}
                <InfoItem icon="help-circle" text={t('help')} />
                <InfoItem icon="settings" text={t('setting')} />
            </View>

            <TouchableOpacity
                style={[styles.signout, styles.shadow]}
                onPress={handleLogout}
            >
                <View style={styles.rightIcon}>
                    <Ionicons
                        name={'log-out-outline'}
                        size={25}
                        color={'#fff'}
                    />
                    <Text style={styles.signoutText}>{t('logout')}</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

const InfoItem = ({ icon, text, nav }) => {
    return (
        <TouchableOpacity
            style={styles.infoMenuItem}
            onPress={nav ? nav : null}
        >
            <View style={styles.groupStart}>
                <Ionicons
                    name={`${icon}-outline`}
                    size={25}
                    color={'#AE100F'}
                />
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
        paddingTop: 10,
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    logo: {
        width: 80,
        height: 80,
        resizeMode: 'contain',
    },
    avatar: {
        width: 50,
        height: 50,

        borderRadius: 50,
    },
    infoMenu: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        marginBottom: 10,
        borderRadius: 8,
        overflow: 'hidden',
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
        alignItems: 'center',
    },
    groupStart: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
    },
    infoText: {
        color: '#444',
        fontSize: 18,
    },
    rightIcon: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    signout: {
        backgroundColor: '#AE100F',
        width: '100%',
        paddingVertical: 10,
        borderRadius: 15,
    },

    signoutText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
    },
    shadow: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 2,
    },
})

export default Info
