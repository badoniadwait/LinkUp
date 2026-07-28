import Button from '@/components/Button'
import ScreenWrapper from '@/components/ScreenWrapper'
import { theme } from '@/constants/theme'
import { hp, wp } from '@/helpers/common'
import { useRouter } from 'expo-router'
import React from 'react'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'

const Welcome = () => {
    const router = useRouter();
    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <Image style={styles.welcomeImage} resizeMode='contain' source={require('../assets/images/welcome.png')} />

                <View style={{ gap: 20 }}>
                    <Text style={styles.title}>LinkUp!</Text>
                    <Text style={styles.punchLine}>connect with new peoples.</Text>
                </View>

                <View style={styles.footer}>
                    <Button title='Getting Started' buttonStyle={{ marginHorizontal: wp(3) }} onPress={() => router.push('/signup')} />
                </View>

                <View style={styles.bottomTextContainer}>
                    <Text style={styles.loginText}>
                        Already Have an account!
                    </Text>
                    <Pressable onPress={() => router.push('/login')}>
                        <Text style={[styles.loginText, {color: theme.colors.primaryDark, fontWeight: theme.fonts.semibold}]}>Login</Text>
                    </Pressable>
                </View>
            </View>
        </ScreenWrapper>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-around",
        backgroundColor: "white",
        paddingHorizontal: wp(4),
    },
    welcomeImage: {
        height: hp(30),
        width: wp(100),
        alignSelf: 'center',
    },
    title: {
        color: theme.colors.text,
        fontSize: hp(4),
        textAlign: "center",
        fontWeight: theme.fonts.extraBold,

    },
    punchLine: {
        color: theme.colors.text,
        fontSize: hp(1.7),
        textAlign: "center",
        fontWeight: theme.fonts.medium,
        paddingHorizontal: wp(10),
    },
    footer: {
        gap: 30,
        width: '100%'
    },
    bottomTextContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,

    },
    loginText: {
        textAlign: 'center',
        color: theme.colors.text,
        fontSize: hp(1.6),
    }
});

export default Welcome