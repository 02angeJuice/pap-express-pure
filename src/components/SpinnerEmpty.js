import { View, Text } from 'react-native'

export const Spinning = ({ visible }) => {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        ></View>
    )
}

export const Empty = ({ text = 'Loading...' }) => {
    return (
        <View>
            <Text>{text}</Text>
        </View>
    )
}
