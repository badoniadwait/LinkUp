import ScreenWrapper from '@/components/ScreenWrapper';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Button from '@/components/Button';
import { hp, wp } from '@/helpers/common';
import { theme } from '@/constants/theme';

export default function Index() {
    const router = useRouter();
    return (
        <ScreenWrapper bg='white'>
            <View style={styles.container}>
                <Text style={styles.title}>LinkUp!</Text>
                <Button title='Get Started' onPress={() => router.push('/welcome')} />
            </View>
        </ScreenWrapper>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: wp(5),
        gap: hp(4),
    },
    title: {
        fontSize: hp(5),
        fontWeight: theme.fonts.extraBold,
        color: theme.colors.primary,
        textAlign: 'center',
    },
});