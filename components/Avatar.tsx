import { theme } from '@/constants/theme'
import { hp } from '@/helpers/common'
import { getUserImageSrc } from '@/service/imageService'
import { Image } from 'expo-image'
import React from 'react'
import { StyleProp, StyleSheet, ViewStyle } from 'react-native'

export const Avatar = ({ uri, size = hp(4.5), rounded = theme.radius.md, style = {} }: {
    uri: string | null | undefined,
    size?: number,
    rounded?: number,
    style?: StyleProp<ViewStyle>
}) => {
    return (

        <Image
            source={getUserImageSrc(uri)}
            style={[styles.avatar, { height: size, width: size, borderRadius: rounded }, style]}
        />


    )
}



const styles = StyleSheet.create({
    avatar: {
        borderCurve: 'continuous',
        borderColor: theme.colors.darkLight,
        borderWidth: 1,
    },
})