import React, { useEffect, useRef } from 'react'
import { Animated, View, Text, StyleSheet } from 'react-native'

const SkeletonScreen = ({ width, height, variant }) => {
    const opacity = useRef(new Animated.Value(0.3))

    let borderRadius = variant === 'circle' ? Number(height) / 2 : 0

    console.log(borderRadius)

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity.current, {
                    toValue: 1,
                    useNativeDriver: true,
                    duration: 500,
                }),
                Animated.timing(opacity.current, {
                    toValue: 0.3,
                    useNativeDriver: true,
                    duration: 800,
                }),
            ])
        ).start()
    }, [opacity])

    return (
        <Animated.View
            style={[
                { opacity: opacity.current, width, height, borderRadius },
                styles.skeleton,
            ]}
        ></Animated.View>
    )
}

const styles = StyleSheet.create({
    skeleton: {
        backgroundColor: 'gray',
    },
})

export default SkeletonScreen
