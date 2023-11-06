import {View, Text, ActivityIndicator} from 'react-native'

export const Spinning = ({visible}) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}></View>
  )
}

export const Empty = ({text, spin}) => {
  return (
    <View style={{marginTop: '5%'}}>
      {text ? (
        <Text style={{color: '#000'}}>{text}</Text>
      ) : (
        <ActivityIndicator size={20} color="#999" />
      )}
      {/* {spin && <ActivityIndicator size={20} color="#999" />}
      {text && <Text style={{color: '#000'}}>{text}</Text>} */}
    </View>
  )
}
