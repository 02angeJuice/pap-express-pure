import React from 'react'
import { TouchableOpacity, Alert, View, Text } from 'react-native'

const UserProfile = ({ navigation, route }) => {
    const { profile } = route?.params

    return (
        <TouchableOpacity
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
            }}
        >
            <Text>{JSON.stringify(profile)}</Text>
        </TouchableOpacity>
    )
}

export default UserProfile
